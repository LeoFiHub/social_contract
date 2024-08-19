const path = require('path');
const env = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config();
console.log("Provider url: ",process.env.dgt_API_URL)


module.exports = Object.freeze({
  env                 : process.env.NODE_ENV || 'production',
  port                : process.env.PORT || 3001,
  logs                : process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  logLevels           : {
    file              : process.env.FILE_LOG_LEVEL || 'info',
    console           : process.env.CONSOLE_LOG_LEVEL || 'debug',
    sentry            : process.env.SENTRY_LOG_LEVEL || 'error'
  },
  redisUrl            : process.env.REDIS_URL || "redis://127.0.0.1:6379",
  redisTopics         : {
    priceRequest : process.env.REDIS_PRICE_REQUEST || 'binaryoption-price-request',
    priceResult  : process.env.REDIS_PRICE_RESULT  || 'pblock-price-response'
  },
  sentryDsn           : process.env.SENTRY_DSN,
  dgtCfg:{
      name: 'dgt',
      network: process.env.DGT_NETWORK || 'testnet',
      contractOwnerPriv: process.env.DGT_CONTRACT_OWNER_PRIV || 'eedddc0cdc167430de9383d213a9b53c67aefd61bf3c277e3dbe01ee206f9230',
      contractOwnerAddr: process.env.DGT_CONTRACT_OWNER_ADDR || '0x0D0Df554db5623Ba9A905D0bE4C6bAc48144841E',
      providerUrl: process.env.DGT_API_URL || 'https://api.baobab.klaytn.net:8651',
      dgtTokenAddress: process.env.DGT_TOKEN_ADDRESS || '0xee42Cf6E3E575b5aBC2B3Ae760BA1AF2c05791df',
      dgtWalletAddress: process.env.DGT_WALLET_ADDRESS || '0x0D0Df554db5623Ba9A905D0bE4C6bAc48144841E',
      dgtVaultSignalAddress: process.env.DGT_VAULT_SIGNAL_ADDRESS || '0xA39C2b7957496d28Cd6B3fD005b4A1584Abe0c30',
      dgtAdminAddress: process.env.DGT_ADMIN_ADDRESS || '0xF7FCCFc3DE0789362B5B998782992a27b12040c8',
      dgtAdminPriv: process.env.DGT_ADMIN_PRIV || '6ee44874d355c054c138a417c5a725cccf7353460892125e028e60ebc8c77129',
      dgtChallengeAddress: process.env.DGT_CHALLENGE_ADDRESS || '0x24F3F152Bfb4C6C14e7c09053eDef984C2Fc5709',
      gasPrice: process.env.DGT_GAS_PRICE
  },
  dgtPriceURL: process.env.dgt_PRICE_URL || "https://dgt-dbank-monitor-api.dgt-dbank-monitor-dev.vncdevs.com/hook/mt5_pricings/price?symbol=",
  contractParams:{
    from    : process.env.dgt_CONTRACT_OWNER_ADDR || '0x0D0Df554db5623Ba9A905D0bE4C6bAc48144841E',
    gasPrice: 25000000000,
    gasLimit: 8500000,
  },
  vaultSignalParams:{
    from: process.env.DGT_ADMIN_ADDRESS || '0xF7FCCFc3DE0789362B5B998782992a27b12040c8',
    gasPrice: 25000000000,
    gasLimit: 8500000,
  }
});
