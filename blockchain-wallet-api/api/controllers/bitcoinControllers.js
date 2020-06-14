const bitcore = require('bitcore-lib')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const Hash = bitcore.crypto.Hash;
const Unit = bitcore.Unit;
const CONSTANT = require('../../config/constants')
const URL = require('../../config/url_blockchain')

fetch.Promise = Bluebird;

const isTestNet = false

var BTC_URL = URL.BTC
var BTC_URL_TEST = URL.BTC_CHECK
var network = bitcore.Networks.mainnet

if (isTestNet) {
    BTC_URL = URL.BTC_TESTNET
    BTC_URL_TEST = URL.BTC_TESTNET_CHECK
    network = bitcore.Networks.testnet
}


bitcore.Transaction.FEE_PER_KB = CONSTANT.BTC.BASIC_TX_FEE


function toSatoshis(BTC_value) {
    return Unit.fromBTC(BTC_value).toSatoshis()
}

async function getUTXOs(address) {
    try {
        let res = await fetch(`${BTC_URL}/addrs/${address}?includeScript=true&unspentOnly=true`, { method: 'GET' })
        let res_result = (await res.json()).txrefs
        if (res_result == undefined) {
            return []
        }
        return res_result
    } catch (error) {
        return []
    }
}
module.exports = {

    sendTransaction: async(req, res, next) => {
        try {
            // let senderAddress = getAddressFromPrivateKey(privateKey)
            // let addressSender = req.data
            let privateKey = req.body.privateKey
            let senderAddress = req.body.senderAddress
            let amount = req.body.amount
            let tx_fee = req.body.txFee
            let destinationAddress = req.body.destinationAddress

            let UTXOs = await getUTXOs(senderAddress)
            if (UTXOs.length == 0) {
                res.status(404).json({
                    status: "fail",
                    message: {
                        request: "there is no UTXOs to create transaction"
                    }
                })
                return
            }
            /*
              Pre-process UTXOs
            */
            var utxo = UTXOs.map(utxo => {
                    return {
                        "txId": utxo.tx_hash,
                        "outputIndex": utxo.tx_output_n,
                        "scriptPubKey": utxo.script,
                        "amount": Unit.fromSatoshis(utxo.value).toBTC(),
                        "address": senderAddress,
                    }
                })
                /*
                  generate transaction
                */
            
            let hex = new bitcore.Transaction()
                .from(utxo)
                .to(destinationAddress, toSatoshis(amount))
                .change(senderAddress)
                .sign(privateKey)
                .fee(toSatoshis(tx_fee))
                .toString()


            /*  
              Broadcast transaction
            */
            const body = {
                tx: hex,
            }
            console.log(body)
            let res_tx_broadcast = await fetch(`${BTC_URL_TEST}/tx`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            console.log(res_tx_broadcast)
            let res_tx_broadcast_result = (await res_tx_broadcast.json())
            console.log(res_tx_broadcast_result)

            if (res_tx_broadcast_result.error) {
                res.status(404).json({
                    status: "fail",
                    message: {
                        request: res_tx_broadcast_result.error
                    }
                })
                return
            }
            res.status(200).json({
                status: "success",
                message: {
                    network: "BTC",
                    txId: res_tx_broadcast_result.tx.hash
                }
            })
        } catch (error) {
            console.log(error)
            res.status(404).json({
                status: "fail"
            })
        }
    },

    getTransaction: async(req, res, next) => {

        // console.log(transactionID)
        try {
            let transactionID = req.params.txID
            let res_api = await fetch(`${BTC_URL}/txs/${transactionID}`, { method: 'GET' })
            let res_api_result = await res_api.json()
            if (res_api_result.error) {
                res.status(404).json({
                    error: "fail",
                    message: res_api_result.error
                })
                return
            }
            res.status(200).json({
                status: "success",
                message: {
                    network: "BTC",
                    txID: res_api_result.hash,
                    blockhash: res_api_result.block_hash,
                    confirmation: res_api_result.confirmations,
                    address : res_api_result.addresses,
                    total : res_api_result.total,
                    fees : res_api_result.fees,
                    inputs: res_api_result.inputs,
                    outputs: res_api_result.outputs,
                }
            })
        } catch (error) {
            res.status(404).json({
                error: "fail"
            })
        }
    },

    getUserBalance: async(req, res, next) => {
        try {
            let address = req.params.address
            let res_api = await fetch(`${BTC_URL}/addrs/${address}/balance`, { method: 'GET' })
            let res_check = await fetch(`${BTC_URL_TEST}/address/${address}`, { method: 'GET' })
            let res_result = (await res_api.json())
            if (res_result.error) {
                res.status(404).json({
                    error: "fail",
                    message: res_result.error
                })
            }
            let res_result_check = (await res_check.json()).chain_stats

            let user_balance = Unit.fromSatoshis(res_result.balance).toBTC()
            let user_balance_check = Unit.fromSatoshis(res_result_check.funded_txo_sum - res_result_check.spent_txo_sum).toBTC()
                /*
                  cross-checking
                */
            if (res_result.unconfirmed_balance != 0) {
                res.status(200).json({
                    status: "success",
                    message: {
                        network: "BTC",
                        balance: user_balance,
                        unconfirmedBalance: Unit.fromSatoshis(res_result.unconfirmed_balance).toBTC(),
                        address: address,
                    }
                })
            } else if (Math.abs(user_balance_check - user_balance) < Number.EPSILON) {
                res.status(200).json({
                    status: "success",
                    message: {
                        network: "BTC",
                        balance: user_balance,
                        address: address
                    }
                })
            } else {
                res.status(500).json({
                    error: "fail"
                })
            }
        } catch (error) {
            console.log(error)
            res.status(404).json({
                error: "fail"
            })
        }
    },

    generateUserAddress: (req, res, next) => {
        try {
            var privateKey = new bitcore.PrivateKey();
            var publicKey = new bitcore.PublicKey(privateKey);
            var address = new bitcore.Address(publicKey, network);

            res.status(200).json({
                status: "success",
                message: {
                    privateKey: privateKey.toWIF(),
                    address: address.toString()
                }
            })
        } catch (error) {
            res.status(500).json({
                error: "fail"
            })
        }
    }

}