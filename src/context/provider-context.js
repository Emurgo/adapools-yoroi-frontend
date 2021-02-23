// @flow

import * as React from 'react';
import type { Node } from 'react';
import type { ProviderEnum } from '../API/api';

const ProviderViewContext = React.createContext();

function ViewProvider(props: Object): Node {
  const [providerView, setProviderView] = React.useState<ProviderEnum>('adapools');
  const value = [providerView, setProviderView];

  return <ProviderViewContext.Provider value={value} {...props} />;
}

function useViewProvider(): any {
  const context = React.useContext(ProviderViewContext);
  if (context === undefined) {
    throw new Error(`useViewProvider must be used within a ViewProvider`);
  }
  return context;
}

export { ViewProvider, useViewProvider };
