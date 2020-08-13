import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Search from '../components/Search';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { getPools, listPools } from '../API/api';
import type { ApiPoolsResponse } from '../API/api';
import DesktopTable from '../components/DesktopTable';
import MobileTable from '../components/MobileTable';
import SortSelect from '../components/SortSelect';

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 36px;
  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: center;
    input {
      margin-bottom: 20px;
    }
  }
`;

export type UrlParams = {|
    chromeId: ?string,
    mozId: ?string,
    source: ?string,
    selectedPoolId: ?string,
    lang: ?string,
|}

export type HomeProps = {|
    urlParams: UrlParams,
|}

function Home(props: HomeProps): Node {
  const [rowData, setRowData] = useState(null);
  const [status, setStatus] = useState('idle')
  const [filterOptions, setFilterOptions] = useState({
    search: '',
    sort: 'roa',
  })

  useEffect(() => {
    setStatus('pending')
    listPools()
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved')
        setRowData(Object.values(poolsData.pools));

      }).catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  }, []);

  const filterSelect = (value) => {
    const newSearch = {
      ...filterOptions,
      search: value
    };
    setFilterOptions(newSearch)
    setStatus('pending')
    getPools(newSearch)
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved')
        setRowData(Object.values(poolsData.pools));
      }).catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  }
  const filterSearch = (value) => {
    const newSearch = {
      ...filterOptions,
      search: value
    };
    setFilterOptions(newSearch);
    setStatus('pending')
    getPools(newSearch)
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved')
        setRowData(poolsData.pools);
      }).catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  }

  const randomFunction = (id: string): void => {
    YoroiCallback(
      [{ poolHash: id }],
      {
        source: props.urlParams.source,
        chromeId: props.urlParams.chromeId,
        mozId: props.urlParams.mozId,
      }
    )
  };

  return (
    <Layout>
      <h1 style={{ textAlign: 'center', margin: '30px 0 50px' }}>Delegation Page</h1>

      <Header>
        <Search filter={filterSearch} />
        <SortSelect filter={filterSelect} />
      </Header>

      <DesktopOnly>
        <DesktopTable status={status} randomFunction={randomFunction} data={rowData} />
      </DesktopOnly>
      <MobileOnly>
        <MobileTable status={status} randomFunction={randomFunction} data={rowData} />
      </MobileOnly>
    </Layout>
  );
}

export default Home;
