import React from 'react';
import GlobalStyle from './helpers/globalStyles';
import Home from './containers/Home';
import type { UrlParams } from './containers/Home';

const extractParams = (locationSearch: string): UrlParams => {
  const params = new URLSearchParams(locationSearch);
  return {
    chromeId: params.get('chromeId'),
    mozId: params.get('mozId'),
    source: params.get('source'),
    selectedPoolIds: params.get('delegated'),
    lang: params.get('lang'),
  }
}

function App() {
  const { location } = window;
  const homeParams = { urlParams: extractParams(location.search) }

  return (
    <>
      <Home props={homeParams} />
      <GlobalStyle />
    </>
  );
}

export default App;
