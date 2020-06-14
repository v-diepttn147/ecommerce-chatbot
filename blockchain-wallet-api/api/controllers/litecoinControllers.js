const litecore = require('litecore-lib');
const fetch = require('node-fetch');
const constant = require('../../config/constants');

//Set default network to testnet
//change to net.mainnet when deloy to mainnet
var net = litecore.Networks;
net.defaultNetwork = net.mainnet;

//constant
const LTCTEST = constant.LTC.URLCODE;
const NETWORK = constant.LTC.NETWORKCODE;
const LTC2STS = constant.LTC.LTC2STS;
const APIURL = constant.LTC.APIURL;
const FEE = constant.LTC.FEE;
const BLOCKCYPHER = 'https://api.blockcypher.com/v1/ltc/main'

/*
@param: address - string (base58)
@return respond to api
*/
async function getAddressBalance(address){
    var respond = {};
    try{
      await fetch(`${APIURL}/get_address_balance/${LTCTEST}/${address}`)
      .then(res => res.json())
      .then(json => {
          console.log(json);
          if(json.status == 'success')
              respond = {
                "status" : "success",
                "message" : {
                  "network" : NETWORK,
                  "address" : address,
                  "balance" : json.data.confirmed_balance,
                  "unconfirmedBalance" : json.data.unconfirmed_balance
                }
              };
          else respond = { "error" : "User doesn't exist" };
      })
      await fetch(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`)
      .then(res => res.json())
      .then( json => {
          console.log(json);
          console.log(json.balance);
          console.log((respond.message.balance*LTC2STS));
          if(Math.abs(parseInt(respond.message.balance*LTC2STS) - json.balance) > 10 || Math.abs(parseInt(respond.message.unconfirmedBalance*LTC2STS) - json.unconfirmed_balance) > 10 )
              respond = { 'error' : 'Wrong information'};
      })
    }
    catch(err)
    {
      return {'error' : 'server error'};
    }

    console.log(respond);
    return respond;
}


async function getAddressBalance_blockcypher(address){
  var respond = {};
  try{
    await fetch(`${BLOCKCYPHER}/addrs/${address}/balance`)
    .then(res => res.json())
    .then(json => {
        console.log(json);
        if(!json.error)
            respond = {
              "status" : "success",
              "message" : {
                "network" : NETWORK,
                "address" : address,
                "balance" : json.balance,
                "unconfirmedBalance" : json.unconfirmed_balance
              }
            };
        else respond = { "error" : "User doesn't exist" };
    })
  }
  catch(err)
  {
    return {'error' : 'server error'};
  }

  console.log(respond);
  return respond;
}

/*
@param: address - string (base58)
@return respond to api
*/
async function getUTXOS(address){
    var UTXOS = []

    await fetch(`${APIURL}/get_tx_unspent/${LTCTEST}/${address}`)
    .then( res => res.json())
    .then( json => json.data.txs)
    .then(txs => {
        txs.forEach(element => {
            UTXOS.push(
                new litecore.Transaction.UnspentOutput({
                    "txid"          : element.txid,
                    "vout"          : element.output_no,
                    "address"       : address,
                    "scriptPubKey"  : element.script_hex,
                    "amount"        : element.value
                  })
            )
        });
    })

    return UTXOS
}
async function getUTXOS_blockcypher(address){
  var UTXOS = []

  await fetch(`${BLOCKCYPHER}/addrs/${address}?unspentOnly=true&includeScript=true`)
  .then( res => res.json())
  .then( json => json.txrefs)
  .then(txs => {
      txs.forEach(element => {
          UTXOS.push(
              new litecore.Transaction.UnspentOutput({
                  "txid"          : element.tx_hash,
                  "vout"          : element.tx_output_n,
                  "address"       : address,
                  "scriptPubKey"  : element.script,
                  "amount"        : parseFloat(element.value)/LTC2STS
                })
          )
      });
  })

  return UTXOS
}


/*
@param: address - string (base58) - the sender address
        privateKey - string (base58) - the sender privateKey
        toAddress - string (base58) - the receiver address
        amount - number (LTC unit) - number of LTC to send
@return: Transaction in hex form
*/
async function createTransaction(address, privateKey, toAddress, amount, fee){
    var privateKey = new litecore.PrivateKey(privateKey);
    var UTXOS = await getUTXOS(address);
    console.log(UTXOS);
    totalSatoshies = 0;
    UTXOS.forEach(element => totalSatoshies += element.satoshis)
    console.log(totalSatoshies);

    var Transaction = new litecore.Transaction()
    .from(UTXOS)
    .to(toAddress, amount)
    .fee(fee)
    .change(address)
    .sign(privateKey)

    return Transaction;
}


async function createTransaction_blockcypher(address, privateKey, toAddress, amount, fee){
  try{
    var privateKey = new litecore.PrivateKey(privateKey);
    var UTXOS = await getUTXOS_blockcypher(address);
    console.log(UTXOS);
    totalSatoshies = 0;
    UTXOS.forEach(element => totalSatoshies += element.satoshis);
    console.log(totalSatoshies);
    console.log(amount);
    console.log(parseInt(fee));
    var Transaction = new litecore.Transaction()
    .from(UTXOS)
    .to(toAddress, amount)
    .fee(parseInt(fee)) 
    .change(address)
    .sign(privateKey)

    return Transaction;
  }
  catch(err){
    console.log(err)
  }
}


/*
@param: address - string (base58) - the sender address
        privateKey - string (base58) - the sender privateKey
        toAddress - string (base58) - the receiver address
        amount - number (LTC unit) - number of LTC to send
@return: respond for API
*/
async function sendTransaction(address, privateKey, toAddress, amount){
    amount = parseInt(amount*LTC2STS);
    try{
    var Transaction = await createTransaction(address, privateKey, toAddress, amount);
    }
    catch(err){
      return {
        'error' : 'Cannot create transaction'
      }
    }
    const hex = `${Transaction}`;
    const body = {tx_hex: hex};
    var respond;
    try{
      await fetch(`https://chain.so/api/v2/send_tx/${LTCTEST}`, {
          method: 'post',
          body:    JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }},)
      .then(res => res.json())
      .then(json => {
          if(json.status == "success")
            respond = {
              'status' : json.status, 
              'message' : {
                'txId' : json.data.txid 
              }
            };
          else respond = {
            'error' : "Transaction is not valid"
          }
        }
      )
    }
    catch(err){
      return {'error' : 'Server error'};
    }
    console.log(respond);
    return respond;
}


async function sendTransaction_blockcypher(address, privateKey, toAddress, amount, fee){
  amount = parseInt(amount*LTC2STS);
  fee = parseInt(fee*LTC2STS)
  try{
  var Transaction = await createTransaction_blockcypher(address, privateKey, toAddress, amount, fee);
  }
  catch(err){
    console.log(err)
    return {
      'error' : 'Cannot create transaction'
    }
  }
  const hex = `${Transaction}`;
  const body = {tx: hex};
  var respond;
  try{
    await fetch(`${BLOCKCYPHER}/txs/push`, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }},)
    .then(res => res.json())
    .then(json => {
        console.log(json);
        if(!json.error){
          respond = {
            'status' : 'success', 
            'message' : {
              'txId' : json.tx.hash
            }
          };
        }
        else respond = {
          'error' : "Transaction is not valid"
        }
      }
    )
  }
  catch(err){
    return {'error' : 'Server error'};
  }
  console.log(respond);
  return respond;
}


/*
@param: privateKey - string (base58) - the privateKey
@return: publicKey of the privateKey
*/
function getPublicKey(privateKey){
    var privateKey = new litecore.PrivateKey(privateKey);
    var PublicKey = litecore.PublicKey(privateKey);
    console.log(PublicKey); 
    return `${PublicKey}`
}

/*
@param: txid - string - id of the transaction
@return: respond for the API
*/
async function getTransaction(txid){
    var respond = {};
    try{
    await fetch(`${APIURL}/get_tx/${LTCTEST}/${txid}`)
    .then(res => res.json())
    .then(json => {
        if(json.status == "success")
            respond = {
              'status' : 'success',
              'message' : {
                "network" 		  : NETWORK,
                "txID" 			    : txid,
                "blockhash" 	  : json.data.blockhash,
                "confirmation" 	: json.data.confirmations,
                "time" 			    : json.data.time,
                "inputs" 		    : json.data.inputs,
                "outputs" 		  : json.data.outputs,
              }
            }
        else respond = { "error" : "Transaction not found!"};
    });
    }
    catch(err){
      return {'error' : 'server error'};
    }

    console.log(respond);
    return respond;
}

async function getTransaction_blockcypher(txid){
  var respond = {};
  try{
  await fetch(`${BLOCKCYPHER}/txs/${txid}`)
  .then(res => res.json())
  .then(json => {
      if(!json.error)
          respond = {
            'status' : 'success',
            'message' : {
              "network" 		  : NETWORK,
              "txID" 			    : txid,
              "blockhash" 	  : json.block_hash,
              "confirmation" 	: json.confirmations,
              "time" 			    : json.confirmed,
              "inputs" 		    : json.inputs,
              "outputs" 		  : json.outputs,
            }
          }
      else respond = { "error" : "Transaction not found!"};
  });
  }
  catch(err){
    return {'error' : 'server error'};
  }

  console.log(respond);
  return respond;
}

/*
@return: publicKey of the privateKey
*/
function generateAddress(){
    var PrivateKey = new litecore.PrivateKey();
    var address = PrivateKey.toAddress();

    var respond = {
        'status' : "success",
        'message' : {
          'address'     : `${address}`,
          'privateKey'  : `${PrivateKey}`
    	}
    }

    console.log(respond);
    return respond;
}

/*
@param: privateKey - string (base58) - the privateKey
@return: publicKey of the privateKey
*/
function importAddress(privateKey){
    var address;

    try{ address = new litecore.PrivateKey(privateKey).toAddress();}
    catch(err) {
        return { 'error': 'Private key not valid'};
    }

    var respond = {
        'status' : "success",
        'message' : {
          'address'   : `${address}`,
    	}
    }

    console.log(respond);
    return respond;
}



module.exports = {

  sendTransaction : async (req,res,next) => {
    const {senderAddress, privateKey, amount, destinationAddress, txFee} = req.body;

    console.log({senderAddress, privateKey, amount, destinationAddress, txFee});

    const respond = await sendTransaction_blockcypher(senderAddress, privateKey, destinationAddress, amount, txFee);

    // try{
    //   var Transaction = await createTransaction_blockcypher(senderAddress, privateKey,destinationAddress, parseInt(amount*LTC2STS), fee);
    //   console.log(Transaction);
    // }
    // catch(err){
    //   console.log(err);
    // }
    // res.send(Transaction)
    if(respond.status == "success") res.status(200);
    else res.status(400)
    
    res.send(respond);
  },

  getTransaction : async (req,res,next) => {
    const txid = req.params.txid;

    const respond = await getTransaction_blockcypher(txid);

    if(respond.status == "success") res.status(200);
    else res.status(404)
    
    res.send(respond);
  },

  getTransactionFee : (req,res,next) => {
    const respond = {
      'status' : "success",
      'message' : {
        'network' : NETWORK,
		    'fee'     : FEE,
      }
    }

    if(respond.status == "success") res.status(200);
    else res.status(400)
    
    res.send(respond);
  },

  getUserBalance : async (req,res,next) => {
    const address = req.params.address;
    const respond = await getAddressBalance_blockcypher(address);

    if(respond.status == "success") res.status(200);
    else res.status(404)
    
    res.send(respond);
  },

  generateUserAddress : async (req,res,next) => {
    const respond = await generateAddress();
    
    if(respond.status == "success") res.status(200);
    else res.status(400)
    
    res.send(respond);
  }

};


