const RippleAPI = require('ripple-lib').RippleAPI;
const XRP = require('../../config/constants').XRP;
const ripple_api = new RippleAPI({
  server: XRP.MAINNET
})
ripple_api.connect();

module.exports = {
  sendTransaction: async (req, res, next) => {
    try {
      const source = req.body.senderAddress;
      const destination = req.body.destinationAddress;

      if (!ripple_api.isValidAddress(source)) {
        res.status(404).json({
          error: "Invalid Source Address"
        })
      } else if (!ripple_api.isValidAddress(destination)) {
        res.status(404).json({
          error: "Invalid Destination Address"
        })
      }

      const secret = req.body.privateKey;
      if (!ripple_api.isValidSecret(secret)) {
        res.status(404).json({
          error: "Invalid Secret"
        })
      }

      const amount = parseFloat(req.body.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        res.status(404).json({
          error: "Invalid Amount"
        })
      }

      const destinationTag = parseInt(req.body.destinationTag);
      if (Number.isNaN(destinationTag)) {
        res.status(404).json({
          error: "Invalid Destination Tag"
        })
      }

      const fee = parseFloat(req.body.txFee);
      if (Number.isNaN(fee)) {
        res.status(404).json({
          error: "Invalid Fee"
        })
      } else if (fee < XRP.MIN_FEE) {
        res.status(404).json({
          error: "Insufficient Fee"
        })
      }

      const preparedTx = await ripple_api.prepareTransaction({
        "TransactionType": "Payment",
        "Account": source,
        "Amount": ripple_api.xrpToDrops(amount),
        "Destination": destination,
        "DestinationTag": destinationTag,
        "Fee": ripple_api.xrpToDrops(fee)
      }, {
        "maxLedgerVersionOffset": 75
      })

      const response = ripple_api.sign(preparedTx.txJSON, secret);
      const signedTx = response.signedTransaction;

      await ripple_api.submit(signedTx);

      res.status(200).json({
        status: "Success",
        message: {
          network: "XRP",
          txId: response.id
        }
      })

    } catch (error) {
      res.status(404).json({
        error: error
      })
    }
  },
  getTransaction: async (req, res, next) => {
    try {
      const txID = req.params.txid;

      const serverInfo = await ripple_api.getServerInfo();
      const ledgers = serverInfo.completeLedgers.split('-');
      const minLedgerVersion = Number(ledgers[0]);
      const maxLedgerVersion = Number(ledgers[1]);

      const tx = await ripple_api.getTransaction(txID, {
        minLedgerVersion: minLedgerVersion,
        maxLedgerVersion: maxLedgerVersion
      });
      let outcomeArray = [];
      for (let key in tx.outcome.balanceChanges) {
        tx.outcome.balanceChanges[key][0]['address'] = key;
        outcomeArray.push(tx.outcome.balanceChanges[key][0]);
      }

      res.status(200).json({
        status: "Success",
        message: {
          network: "XRP",
          txID: txID,
          ledgerNumber: tx.outcome.ledgerVersion,
          time: tx.outcome.timestamp,
          outcome: outcomeArray
        }
      });

    } catch (error) {
      res.status(404).json({
        error: error
      });
    }
  },
  getUserBalance: async (req, res, next) => {
    const address = req.params.address;

    if (!ripple_api.isValidAddress(address)) {
      res.status(404).json({
        error: "User doesn't exist"
      });
    } else {
      try {
        const balances = await ripple_api.getBalances(address);
        res.status(200).json({
          status: "Success",
          message: {
            network: "XRP",
            address: address,
            balances: balances
          }
        });
      } catch (error) {
        res.status(404).json({
          error: "Unknown error"
        });
      }
    }
  },
  generateUserAddress: (req, res, next) => {
    const address = ripple_api.generateAddress();
    res.status(200).json({
      status: "Success",
      message: {
        network: "XRP",
        address: address.address,
        secret: address.secret
      }
    })
  },
}