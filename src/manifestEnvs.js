// @flow

const BACKEND_URL /*: string */ = process.env.BACKEND_URL != null
  ? process.env.BACKEND_URL
  : 'https://a.cexplorer.io/yoroi-api/';

module.exports = {
  BACKEND_URL,
};
