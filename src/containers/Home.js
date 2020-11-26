import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Search from '../components/Search';
import Alert from '../components/Alert';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { getPools, listPools } from '../API/api';
import type { ApiPoolsResponse } from '../API/api';
import DesktopTable from '../components/DesktopTable';
import MobileTable from '../components/MobileTable';
import SortSelect from '../components/SortSelect';

// import data from '../API/data';
import Modal from '../components/common/Modal';
import ColoursModal from '../components/ColoursModal';
import adapoolIcon from '../assets/adapool-logo-extend.svg'

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 36px;
  @media (max-width: 1125px) {
    flex-direction: column;
    align-items: center;
    input {
      margin-bottom: 20px;
    }
  }
`;

// const ColorButton = styled.button`
//   border: none;
//   background: none;
//   color: #2B2C32;
//   font-size: 14px;
//   line-height: 22px;
//   text-decoration: underline;
//   margin-left: auto;
//   cursor: pointer;
//   @media (max-width: 1125px){
//     margin-top: 30px;
//   }
// `;

const CreditSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 24px 0 0;
  color: #676970;
  font-size: 14px;
  img {
    background: #012b51;
    margin-left: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    height: 27px;
  }
`;
export type UrlParams = {|
  chromeId: ?string,
  mozId: ?string,
  source: ?string,
  selectedPoolIds: ?Array<string>,
  lang: ?string,
|};

export type HomeProps = {|
  urlParams: UrlParams,
|};

function Home(props: HomeProps): Node {
  const [rowData, setRowData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [filterOptions, setFilterOptions] = useState({
    search: '',
    sort: 'score',
  });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setStatus('pending');
    listPools()
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved');
        setRowData(Object.values(poolsData.pools));
      })
      .catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  }, []);

  const filterSelect = (value) => {
    const newSearch = {
      ...filterOptions,
      sort: value,
    };
    setFilterOptions(newSearch);
    setStatus('pending');
    getPools(newSearch)
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved');
        setRowData(Object.values(poolsData.pools));
      })
      .catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  };
  const filterSearch = (value) => {
    const newSearch = {
      ...filterOptions,
      search: value,
    };
    setFilterOptions(newSearch);
    setStatus('pending');
    getPools(newSearch)
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved');
        setRowData(poolsData.pools);
      })
      .catch((err) => {
        setStatus({ status: 'rejected' });
        console.error(err);
      });
  };

  const delegateFunction = (id: string): void => {
    const { urlParams } = props.props

    YoroiCallback(([id]), {
      source: urlParams.source,
      chromeId: urlParams.chromeId,
      mozId: urlParams.mozId,
    });
  };
  const alertText = 'The new saturation point for Stakepools will be 63.6 million ADA from December 6th. Delegate to a new stakepool to avoid less than expected rewards, if your Stakepool is over this limit.';
  const { props: { urlParams: { selectedPoolIds } } } = props
  return (
    <Layout>
      <Alert title={alertText} />
      <Header>
        <Search filter={filterSearch} />
        <SortSelect filter={filterSelect} />
        {/* <ColorButton type="button" onClick={() => setOpenModal(true)}>
          Colors meaning
        </ColorButton> */}
      </Header>
      <DesktopOnly>
        <DesktopTable 
          status={status}
          delegateFunction={delegateFunction} 
          data={rowData}
          selectedIdPools={selectedPoolIds}
        />
      </DesktopOnly>
      <MobileOnly>
        <MobileTable 
          status={status}
          delegateFunction={delegateFunction} 
          data={rowData}
          selectedIdPools={selectedPoolIds}
        />
      </MobileOnly>
      {openModal && (
        <Modal
          title="Colors meaning"
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <ColoursModal />
        </Modal>
      )}
      <CreditSection>Powered by 
        <a href='https://adapools.org/' target='_blank' rel='noopener noreferrer'>
          <img src={adapoolIcon} alt="adapool-logo" />
        </a>
      </CreditSection>
    </Layout>
  );
}

export default Home;
