// @flow

import React from 'react';
import type { Node } from 'react';
import GlobalStyle from './helpers/globalStyles';
import Home from './containers/Home';
import HomeRevamp from './containers/HomeRevamp';
import type { UrlParams } from './containers/Home';

const parseIds = (array: ?string): Array<string> => {
  if (array == null) return [];
  return JSON.parse(decodeURIComponent(array));
};

const extractParams = (locationSearch: string): UrlParams => {
  const params = new URLSearchParams(locationSearch);
  return {
    chromeId: params.get('chromeId'),
    mozId: params.get('mozId'),
    source: params.get('source'),
    selectedPoolIds: parseIds(params.get('delegated')),
    lang: params.get('lang'),
    // $FlowFixMe[incompatible-return]
    totalAda: params.get('totalAda'),
    layout: params.get('layout'),
  };
};

function App(): Node {
  const { location } = window;
  const homeParams = { urlParams: extractParams(location.search) };
  const layout = homeParams?.urlParams?.layout ?? 'CLASSIC';
  const mapHomeComponentByLayout = {
    CLASSIC: Home,
    REVAMP: HomeRevamp,
  };
  const HomeComponent = mapHomeComponentByLayout[layout];

  return (
    <>
      <HomeComponent {...homeParams} />
      <GlobalStyle />
    </>
  );
}

export default App;
