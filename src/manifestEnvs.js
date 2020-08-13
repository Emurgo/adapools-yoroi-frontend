// @flow

const BACKEND_URL /*: string */ = process.env.BACKEND_URL != null
  ? process.env.BACKEND_URL
  : 'https://a.adapools.org/yoroi-api/';

module.exports = {
  BACKEND_URL,
};
