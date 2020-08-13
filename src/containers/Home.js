import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Search from '../components/Search';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { getPools, listPools } from '../API/api';
import type { ApiPoolsResponse } from '../API/api';
import DesktopTable from '../components/DesktopTable';
import MobileTable from '../components/MobileTable';

const WrapperSelectInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 1023px) {
    margin-left: 0;
  }
  label {
    color: #676970;
    font-size: 12px;
    line-height: 20px;
  }
`;

const SelectInput = styled.select`
  height: 40px;
  display: block;
  font-size: 14px;
  color: #2b2c32;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 322px;
  margin: 0;
  border: none;
  border-radius: 8px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #f0f3f5;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
`;

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

  const search = ({ search: searchValue }) => {
    setStatus('pending')
    getPools({ search: searchValue })
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved')
        setRowData(Object.values(poolsData.pools));
      }).catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  };

  const randomFunction = (id) => {
    console.log(id);
  };

  return (
    <Layout>
      <h1 style={{ textAlign: 'center', margin: '30px 0 50px' }}>Delegation Page</h1>
      <Header>
        <Search search={search} />
        <WrapperSelectInput>
          <label htmlFor="sort">Sort by:</label>
          <SelectInput name="" id="sort">
            <option value="">Name</option>
            <option value="">Costs</option>
          </SelectInput>
        </WrapperSelectInput>
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
