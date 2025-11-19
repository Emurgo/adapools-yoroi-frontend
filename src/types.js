// @flow

export type UrlParams = {|
  chromeId: ?string,
  mozId: ?string,
  source: ?string,
  selectedPoolIds: ?Array<string>,
  lang: ?string,
  totalAda: ?number,
  layout: ?string,
  bias: ?string,
  theme: ?string,
  network: 'mainnet' | 'preprod',
|};
