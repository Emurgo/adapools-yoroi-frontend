// @flow

import * as React from 'react';
import type { Node } from 'react';
import Layout from '../components/layout/Layout';
import AdapoolsTable from './AdapoolsTable';
import { useViewProvider } from '../context/provider-context';
import DaedalusSimpleTable from './DaedalusSimpleTable';

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
    component = <AdapoolsTable {...props} />;
    break;
  case 'daedalus_simple':
    component = <DaedalusSimpleTable {...props} />;
    break;
  default:
    component = <AdapoolsTable {...props} />;
  }
  return (
    <Layout>{component}</Layout>
  );
}

export default HomeContainer;
