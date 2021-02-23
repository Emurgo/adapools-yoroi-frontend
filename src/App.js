// @flow

import React from 'react';
import type { Node } from 'react';
import GlobalStyle from './helpers/globalStyles';
import type { UrlParams } from './containers/HomeContainer';
import HomeContainer from './containers/HomeContainer';
import { ViewProvider } from './context/provider-context';

const parseIds = (array: ?string): Array<string> => {
  if (array == null) return [];
  return JSON.parse(decodeURIComponent(array))
};

const extractParams = (locationSearch: string): UrlParams => {
  const params = new URLSearchParams(locationSearch);
  return {
    chromeId: params.get('chromeId'),
    mozId: params.get('mozId'),
    source: params.get('source'),
    selectedPoolIds: parseIds(params.get('delegated')),
    lang: params.get('lang'),
    totalAda: params.get('totalAda'),
  }
}

function App(): Node {
  const { location } = window;
  const homeParams = { urlParams: extractParams(location.search) }

  return (
    <ViewProvider>
      <HomeContainer {...homeParams} />
      <GlobalStyle />
    </ViewProvider>
  );
}

export default App;
