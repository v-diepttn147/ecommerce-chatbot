const BLOCKCHAIN_URL = {
  // BTC         : 'https://chain.so/api/v2',
  BTC         : 'https://api.blockcypher.com/v1/btc/main',
  BTC_CHECK   : 'https://blockstream.info/api',
  // BTC_TESTNET : 'https://chain.so/api/v2',
  BTC_TESTNET : 'https://api.blockcypher.com/v1/btc/test3',
  BTC_TESTNET_CHECK : 'https://blockstream.info/testnet/api',

  BCH         : 'https://rest.bitcoin.com/v2',
  BCH_CHECK   : 'https://bch.blockdozer.com/api',
  BCH_TESTNET : 'https://trest.bitcoin.com/v2',
  BCH_TESTNET_CHECK : 'https://tbch.blockdozer.com/api',

  ZEC : 'https://chain.so/api/v2',
  ZEC_CHECK : 'https://api.zcha.in/v2/mainnet/accounts',
  ZEC_TESTNET_CHECK : 'https://api.zcha.in/v2/testnet/accounts',


  XRP : '',
  XRP_TESTNET : '',

  LTC : 'https://chain.so/api/v2',
  XRP_TESTNET : '',

  ETH : 'https://api.etherscan.io/api',
  ETH_TESTNET : 'https://ropsten.etherscan.io/api',
}

module.exports = BLOCKCHAIN_URL
