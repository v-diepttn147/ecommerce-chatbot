
/*
    every constant variables are defined here
*/

const CONSTANTS = {
  basic_auth : {
    id : "teamapi", 
    pass : "Teamapi@2019"
  },
  BTC : {
    BASIC_TX_FEE : "21000",
  },
  BCH : {
    BASIC_TX_FEE : "1000",
  },

  LTC : {
    URLCODE : 'LTC',
    NETWORKCODE : 'LTC',
    LTC2STS : 100000000,
    APIURL : 'https://chain.so/api/v2',
    FEE : 0.001,
  },

  ZEC : {
    feeTransaction: "0.0001"
  },

  XRP : {
    MAINNET: 'wss://s1.ripple.com',
    TESTNET: 'wss://s.altnet.rippletest.net:51233',
    MIN_FEE: 0.00001
  },

  ETH : {
    API_KEY : 'GY9KKYEJF1HDEPIAIRGA66R2RIQWQXV9UZ',
    MAINNET: 'https://api.etherscan.io',
    TESTNET: 'https://ropsten.etherscan.io',
    WEI_RATE: Math.pow(10, 18),
    LOWER_GAS_LIMIT: 0,
    UPPER_GAS_LIMIT: 500000
  }
}

module.exports = CONSTANTS
