const bitcore = require('bitcore-lib')
const zbitcore= require('zcash-bitcore-lib')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const Hash = bitcore.crypto.Hash;
const Unit = bitcore.Unit;
fetch.Promise = Bluebird;
const execSync = require('child_process').execSync;
URL = require('../../config/url_blockchain')

const ZEC_URL = URL.ZEC
const ZEC_URL_CHECK = URL.ZEC_CHECK

const NETWORK = "ZEC"

module.exports = {

  sendTransaction : async (req,res,next) => {
    try
    {

      let privateKey    = req.body.privateKey
      let senderAddress = req.body.senderAddress
      let amount        = req.body.amount
      let destinationAddress = req.body.destinationAddress
      const defaultFee = 0.0001;
      const importPrikey = execSync('timeout 15 zcash-cli importprivkey ' + privateKey, { encoding: 'utf-8' });
      let balance       = execSync('timeout 15 zcash-cli z_getbalance ' + senderAddress, { encoding: 'utf-8' });
      const refund = (parseFloat(balance) - parseFloat(amount) - parseFloat(defaultFee)).toFixed(8);

      if (refund > 0.00000053)
      {
        const sendMany = execSync('timeout 15 zcash-cli z_sendmany "' + senderAddress + '" "[{\\"amount\\": ' + amount + ', \\"address\\": \\"' + destinationAddress + '\\"},{\\"amount\\": ' + refund + ', \\"address\\": \\"' + senderAddress +  '\\"}]"', { encoding: 'utf-8' });  // the default is 'buffer'
      }
      else
      {
         const sendMany = execSync('timeout 15 zcash-cli z_sendmany "' + senderAddress + '" "[{\\"amount\\": ' + amount + ', \\"address\\": \\"' + destinationAddress + '\\"}]"', { encoding: 'utf-8' });  // the default is 'buffer'
      }

      const Result = execSync('timeout 15 zcash-cli z_getoperationresult', { encoding: 'utf-8' });
      const check_Result = JSON.parse(Result)
      check_status = check_Result[0].status

      if ( check_status == 'success' ) {
          res.status(200).json({
          status : "success",
          message : {
            Result: check_Result[0].result
          }
        })
      }
      else {
        res.status(200).json({
        status : "fail",
        message : {
          Result: check_Result[0].error
        }
      })
    }
  }
  catch(error){
      res.status(404).json({
        status : "fail"
      })
    }
  },

  getTransaction : async (req,res,next) => {

    // console.log(transactionID)
    try{
      let transactionID = req.params.txID
      const Result = execSync('timeout 15 zcash-cli gettransaction ' + transactionID, { encoding: 'utf-8' });
      const Result_info = JSON.parse(Result)

      res.status(200).json({
        status : "success",
        message : {
          network : "ZEC",
          txID : transactionID,
          blockhash : Result_info.blockhash,
          confirmation : Result_info.confirmations,
          time : Result_info.time,
          outcome : Result_info.details,
        }
      })
    }catch(error){
      res.status(404).json({
        error : "fail"
      })
    }
  },

  getTransactionFee : (req,res,next) => {
    try{
          res.status(200).json({
          status : "success",
          message : {
            network : "ZEC",
            fee     : "0.0001"
          }
        })
    }catch(error){
      res.status(500).json({
        error : "fail"
      })
    }

  },

  getUserBalance : async (req,res,next) => {
    try{
    let address = req.params.address
   	const Result = execSync('timeout 15 zcash-cli z_getbalance ' + address, { encoding: 'utf-8' });
	const Result_info = JSON.parse(Result)
      res.status(200).json({
        status : "success",
        message : {
          network : "ZEC",
          address : address,
          balance : Result_info,
          unconfirmed_balance : "0",
        }
      })
  }
    catch(error){
      res.status(404).json({
        error : "fail"
      })
    }
  },

  generateUserAddress : (req,res,next) => {
    try{
      var privateKey = new zbitcore.PrivateKey();
      var publicKey = new zbitcore.PublicKey(privateKey);
      var address = new zbitcore.Address(publicKey,zbitcore.Networks.mainnet);

      res.status(200).json({
        status : "success",
        message : {
          privateKey : privateKey.toWIF(),
          address : address.toString()
        }

    })}
    catch(error){
      res.status(500).json({
        error : "fail"
      })
    }
  }
}
