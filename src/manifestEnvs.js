// @flow

const BACKEND_URL /*: string */ =
  process.env.BACKEND_URL != null ? process.env.BACKEND_URL : 'https://a.adapools.org/yoroi-api/';

const BACKEND_URL_DAEDALUS /*: string */ =
  process.env.BACKEND_URL_DAEDALUS != null
    ? process.env.BACKEND_URL_DAEDALUS
    : 'https://iohk-mainnet.yoroiwallet.com/api/pool/cardanoWallet';

module.exports = {
  BACKEND_URL,
  BACKEND_URL_DAEDALUS,
};
