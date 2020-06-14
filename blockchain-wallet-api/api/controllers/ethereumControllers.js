const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;
const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');

const ETH = require('../../config/constants').ETH;
const API_KEY = ETH.API_KEY;
const URL = ETH.TESTNET;

function getNonce(address){
    return fetch(
          `${URL}/api?module=proxy&action=eth_getTransactionCount&tag=latest&address=${address}&apikey=${API_KEY}`
        ).then(response => response.json()).then(e => {
              return e.result
          })
}
module.exports = {
  sendTransaction : async (req,res,next) => {
    let addressFrom = req.body.senderAddress
    let addressTo = req.body.destinationAddress
    let value = req.body.amount

    let gasPrice = parseFloat(req.body.gasPrice);
    let gasLimit = parseInt(req.body.gasLimit);
    
    if (Number.isNaN(gasPrice) || gasPrice <= 0) {
      res.status(400).json({
        error: "Invalid Gas Price"
      })
    }

    if (Number.isNaN(gasLimit) || gasLimit <= ETH.LOWER_GAS_LIMIT || gasLimit > ETH.UPPER_GAS_LIMIT) {
      res.status(400).json({
        error: "Invalid Gas Limit"
      })
    }
    let nonce = await getNonce(addressFrom)
    let privatekey = req.body.privateKey
    var ethTx = require('ethereumjs-tx');

    try {
      const txParams = {
        nonce: nonce, // Replace by nonce for your account on geth node
        gasPrice: gasPrice * ETH.WEI_RATE,
        gasLimit: gasLimit,
        to: addressTo,
        value: value * ETH.WEI_RATE
      };
      // Transaction is created
      var tx = new ethTx(txParams);
      const privKey = Buffer.from(privatekey, 'hex');
      // Transaction is signed
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      const rawTx = '0x' + serializedTx.toString('hex');
      return fetch(
        `${URL}/api?module=proxy&action=eth_sendRawTransaction&hex=${rawTx}&apikey=${API_KEY}`
          ).then(response => response.json()).then(e => {
            if(e.error !== undefined){
              return res.status(404).json({
                error : e.error
              })
            }
            return res.status(200).json({
              status : "success",
              message : {
                network : "ETH",
                txid : e.result
              }
            })
          })
    }catch(error){
      res.status(404).json({
        error : "fail"
      })
    }
  },
  getTransaction : async (req,res,next) => {
    let txhash = req.params.txhash;
    try{
      return fetch(
        `${URL}/api?module=proxy&action=eth_getTransactionByHash&txhash=${txhash}&apikey=${API_KEY}`
        ).then(response => response.json()).then(response => {
            try{
              res.status(200).json({
                status : "success",
                 message : {
                  network : "ETH",
                  txID : txhash,
                  blockhash : response.result.blockHash,
                  blocknumber : (parseInt(response.result.blockNumber,16)).toString(),
                  inputs : [{
                    from_address:response.result.from
                  }],
                  outputs : [{
                    to_address:response.result.to
                  }],
                  outcome:[{
                   value:(parseInt(response.result.value,16) / Math.pow(10,18)).toString(),
                    gasLimit:parseInt(response.result.gas,16).toString(),
                    gasPrice:parseInt(response.result.gasPrice,16).toString(),
                    nonce:parseInt(response.result.nonce,16).toString(),
                    transactionIndex:parseInt(response.result.transactionIndex,16).toString(),
                  }]
                }
              })
            }catch(error){
              res.status(404).json({
                error : "fail"
              })
            }
        })
      }catch(error){
        res.status(404).json({
          error : "fail"
        })
      }
  },
  getTransactionFee : (req,res,next) => {

  },
  getUserBalance : async (req,res,next) => {
    let address = req.params.address
    try{
      return fetch(
        `${URL}/api?apikey=${API_KEY}&module=account&action=balance&address=${address}&tag=latest`
        ).then(response => response.json()).then(response => {
            try{
              res.status(200).json({
                status : "success",
                message : {
                  network : "ETH",
                  address : address,
                  balance : (response.result / (Math.pow(10,18))).toString()
                }
              })
            }catch(error){
              res.status(404).json({
                error : "fail"
              })
            }
        })
      }catch(error){
        res.status(404).json({
          error : "fail"
        })
      }

  },
  generateUserAddress : async (req,res,next) => {
    const mnemonic = bip39.generateMnemonic(); //generates string(
    const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const root = hdkey.fromMasterSeed(seed);
    const masterPrivateKey = root.privateKey.toString('hex');
    const addrNode = root.derive("m/44'/60'/0'/0/0"); //line 1
    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    const addr = ethUtil.publicToAddress(pubKey).toString('hex');
    const address = ethUtil.toChecksumAddress(addr);
    const privateKey = ethUtil.bufferToHex(addrNode._privateKey)
    const account = {
        address: address,
        privateKey: privateKey
    };
    if(account){
      res.status(200).json({
        status : "success",
        message : {
          network : "ETH",
          address: address,
          privateKey: privateKey.substring(2)
        }
      })
    }else{
      res.status(404).json({
        error : "fail"
      })
    }
  },
}
