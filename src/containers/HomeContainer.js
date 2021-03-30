// @flow

import * as React from 'react';
import type { Node } from 'react';
import Layout from '../components/layout/Layout';
import { useViewProvider } from '../context/provider-context';
import DaedalusSimpleContainer from './DaedalusSimpleContainer';
import AdapoolsContainer from './AdapoolsContainer';

export type UrlParams = {|
  chromeId: ?string,
  mozId: ?string,
  source: ?string,
  selectedPoolIds: ?Array<string>,
  lang: ?string,
  totalAda: ?number,
|};

export type UrlParamsProps = {|
  urlParams: UrlParams,
|};

export type DelegationProps = {|
  stakepoolName: string,
  stakepoolTotalStake: string,
  isAlreadySaturated: boolean,
  id: string,
|};

function HomeContainer(props: UrlParamsProps): Node {
  const [provider] = useViewProvider();

  let component;
  switch (provider) {
  case 'adapools':
    component = <AdapoolsContainer {...props} />;
    break;
  case 'daedalus_simple':
    component = <DaedalusSimpleContainer {...props} />;
    break;
  default:
    component = <AdapoolsContainer {...props} />;
  }
  return (
    <Layout>{component}</Layout>
  );
}

export default HomeContainer;
