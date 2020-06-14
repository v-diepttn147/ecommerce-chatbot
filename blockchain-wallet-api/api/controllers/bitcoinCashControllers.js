const bitcore = require('bitcore-lib-cash')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const URL = require('../../config/url_blockchain')
const Hash = bitcore.crypto.Hash;
const Unit = bitcore.Unit;
fetch.Promise = Bluebird;
const CONSTANT = require('../../config/constants')
bitcore.Transaction.FEE_PER_KB = CONSTANT.BCH.BASIC_TX_FEE

var isTestNet = false
var network = bitcore.Networks.mainnet
var BCH_URL = URL.BCH
var BCH_URL_CHECK = URL.BCH_CHECK

if (isTestNet) {
    BCH_URL = URL.BCH_TESTNET
    BCH_URL_CHECK = URL.BCH_TESTNET_CHECK
    network = bitcore.Networks.testnet
}

function toSatoshis(BCH_value) {
    return Unit.fromBTC(BCH_value).toSatoshis()
}

async function getAddressUTXO(address) {
    let res = await fetch(`${BCH_URL}/address/utxo/${address}`, { method: 'GET' })
    let res_result = await res.json()
        // console.log(res_result)
    return res_result
}

module.exports = {

    sendTransaction: async(req, res, next) => {
        try {
            // let senderAddress = getAddressFromPrivateKey(privateKey)
            // let addressSender = req.data
            let privateKey = req.body.privateKey
            let senderAddress = req.body.senderAddress
            let amount = req.body.amount
            let destinationAddress = req.body.destinationAddress
            let tx_fee = req.body.txFee
            let UTXOs = await getAddressUTXO(senderAddress)

            let utxo_list = UTXOs.utxos.map(utxo => {
                return {
                    "txId": utxo.txid,
                    "outputIndex": utxo.vout,
                    "script": UTXOs.scriptPubKey,
                    "amount": utxo.amount
                }
            })

            let hex = new bitcore.Transaction()
                .from(utxo_list)
                .to(destinationAddress, toSatoshis(amount))
                .change(senderAddress)
                .fee(toSatoshis(tx_fee))
                .sign(privateKey)
                .toString();


            let res_broadcast = await fetch(`${BCH_URL}/rawtransactions/sendRawTransaction/${hex}`, { method: 'GET' })
            let res_tx_broadcast_result = await res_broadcast.json()
            res.status(200).json({
                status: "success",
                message: {
                    txid: res_tx_broadcast_result
                }
            })
        } catch (error) {
            res.status(404).json({
                error: "fail"
            })
        }
    },
    getTransaction: async(req, res, next) => {
        try {
            let transactionID = req.params.txid
            let res_api = await fetch(`${BCH_URL}/transaction/details/${transactionID}`, { method: 'GET' })
            let res_api_result = await res_api.json()

            console.log(res_api_result)
            if (res_api_result.error) {
                res.status(404).json({
                    status: "fail",
                    message: res_api_result.error
                })
                return
            }
            res.status(200).json({
                status: "success",
                message: {
                    network: "BCH",
                    txID: res_api_result.txid,
                    blockhash: res_api_result.blockheight,
                    confirmation: res_api_result.confirmations,
                    time: res_api_result.time,
                    inputs: res_api_result.vin,
                    outputs: res_api_result.vout,
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
            let res_api = await fetch(`${BCH_URL}/address/details/${address}`, { method: 'GET' })
                // let res_check = await fetch(`${BCH_URL_CHECK}/addr/${address}/balance`, { method: 'GET' })

            let res_api_result = await res_api.json()
            console.log(res_api_result)

            let res_api_check_result = await res_check.json()

            if (Unit.fromBTC(res_api_result.unconfirmedBalance).toSatoshis() != 0) {
                res.status(200).json({
                    status: "success",
                    message: {
                        network: "BCH",
                        balance: res_api_result.balance,
                        unconfirmedBalance: res_api_result.unconfirmedBalance,
                        address: address
                    }
                })
            } else if (Math.abs(res_api_result.balance - Unit.fromSatoshis(res_api_check_result).toBTC()) < Number.EPSILON) {
                res.status(200).json({
                    status: "success",
                    message: {
                        network: "BCH",
                        balance: res_api_result.balance,
                        address: address
                    }
                })
            }

        } catch (error) {
            console.log(error)
            res.status(404).json({
                status: "server fail"
            })
        }
    },
    generateUserAddress: async(req, res, next) => {
        try {
            var privateKey = new bitcore.PrivateKey();
            var publicKey = new bitcore.PublicKey(privateKey);
            var address = new bitcore.Address(publicKey, network);

            var legacyAddressAPI = await fetch(`${BCH_URL}/slp/convert/${address}`, { method: 'GET' })
            var legacyAddress = (await legacyAddressAPI.json()).legacyAddress

            res.status(200).json({
                status: "success",
                message: {
                    privateKey: privateKey.toWIF(),
                    cashAddress: address.toString(),
                    legacyAddress: legacyAddress,
                }
            })
        } catch (error) {
            res.status(404).json({
                error: "fail"
            })
        }
    }
}