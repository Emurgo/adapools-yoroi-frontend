// @flow

import React from 'react';
import type { Node } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalStyle from './helpers/globalStyles';
import HomeClassic from './containers/HomeClassic';
import HomeRevamp from './containers/HomeRevamp';
import type { UrlParams } from './containers/HomeClassic';

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
    totalAda: Number(params.get('totalAda')),
    layout: params.get('layout'),
    bias: params.get('bias'),
  };
};

const queryClient = new QueryClient();

function App(): Node {
  const { location } = window;
  const homeParams = { urlParams: extractParams(location.search) };
  const layout = homeParams?.urlParams?.layout ?? 'CLASSIC';
  const mapHomeComponentByLayout = {
    CLASSIC: HomeClassic,
    REVAMP: HomeRevamp,
  };
  const HomeComponent = mapHomeComponentByLayout[layout];

  return (
    <QueryClientProvider client={queryClient}>
      <HomeComponent {...homeParams} />
      <GlobalStyle />
    </QueryClientProvider>
  );
}

export default App;
