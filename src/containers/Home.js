// @flow

import React, { useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Search from '../components/Search';
import Alert from '../components/Alert';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { listBiasedPools } from '../API/api';
import type { ListBiasedPoolsResponse, Pool, SearchParams } from '../API/api';
import DesktopTable from '../components/DesktopTable';
import MobileTable from '../components/MobileTable';
import SortSelect from '../components/SortSelect';
import type { QueryState } from '../utils/types';

import Modal from '../components/common/Modal';
import SaturatedPoolAlert from '../components/SaturatedPoolAlert';
import cexplorerIconMini from '../assets/cexplorer-logo-mini.svg';
import cexplorerIcon from '../assets/cexplorer-logo-extend.svg';

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
  #logo-mini {
    background: #ffffff;
    margin-left: 10px;
    margin-bottom: 6px;
    padding: 0px 6px;
    border-radius: 4px;
    height: 20px;
  }
  #logo {
    background: #ffffff;
    margin-left: -2px;
    margin-top: 6px;
    border-radius: 4px;
    height: 32px;
  }
`;
export type UrlParams = {|
  chromeId: ?string,
  mozId: ?string,
  source: ?string,
  selectedPoolIds: ?Array<string>,
  lang: ?string,
  totalAda: ?number,
  layout: ?string,
  bias: ?string,
|};

export type HomeProps = {|
  urlParams: UrlParams,
|};

export type DelegationProps = {|
  stakepoolName: string,
  stakepoolTotalStake: string,
  isAlreadySaturated: boolean,
  id: string,
|};

function Home(props: HomeProps): Node {
  const [saturationLimit, setSaturationLimit] = React.useState<?number>(null);
  const [rowData, setRowData] = React.useState<?Array<Pool>>(null);
  const [status, setStatus] = React.useState<QueryState>('idle');
  const [filterOptions, setFilterOptions] = React.useState<SearchParams>({
    search: '',
    sort: 'score',
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [confirmDelegationModal, setConfirmDelegationModal] = React.useState<boolean>(false);
  const [delegationModalData, setDelegationModalData] = React.useState<Object>({});

  const { urlParams } = props;
  const seed = urlParams?.bias ?? 'bias';

  useEffect(() => {
    setStatus('pending');
    listBiasedPools(seed, {})
      .then((resp: ListBiasedPoolsResponse) => {
        setStatus('resolved');
        setRowData(resp.pools);
        setSaturationLimit(resp.saturationLimit);
      })
      .catch((err) => {
        setStatus('rejected');
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
    listBiasedPools(seed, newSearch)
      .then((resp: ListBiasedPoolsResponse) => {
        setStatus('resolved');
        setRowData(resp.pools);
        setSaturationLimit(resp.saturationLimit);
      })
      .catch((err) => {
        setStatus('rejected');
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
    listBiasedPools(seed, newSearch)
      .then((resp: ListBiasedPoolsResponse) => {
        setStatus('resolved');
        setRowData(resp.pools);
        setSaturationLimit(resp.saturationLimit);
      })
      .catch((err) => {
        setStatus('rejected');
        console.error(err);
      });
  };

  const confirmedDelegateFunction = (id: string): void => {
    YoroiCallback([id], {
      source: urlParams.source,
      chromeId: urlParams.chromeId,
      mozId: urlParams.mozId,
    });
  };

  const delegateFunction = (delegation: DelegationProps, totalAda: ?number): void => {
    if (delegation == null) return;
    const lovelaceDelegation = totalAda == null ? 0 : totalAda * 1000000;

    const limit: ?number = saturationLimit;
    if (limit != null && Number(delegation.stakepoolTotalStake) + lovelaceDelegation >= limit) {
      setDelegationModalData({ ...delegation, totalAda });
      setConfirmDelegationModal(true);
      setOpenModal(true);
    } else {
      confirmedDelegateFunction(delegation.id);
    }
  };

  const alertText = null;

  const {
    urlParams: { selectedPoolIds, totalAda },
  } = props;
  return (
    <Layout>
      <Alert title={alertText} />
      <Header>
        <Search filter={filterSearch} />
        <SortSelect isRevamp={false} filter={filterSelect} />
        {/* <ColorButton type="button" onClick={() => setOpenModal(true)}> */}
        {/*  Colors meaning */}
        {/* </ColorButton> */}
      </Header>
      <DesktopOnly>
        <DesktopTable
          status={status}
          delegateFunction={delegateFunction}
          data={rowData}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </DesktopOnly>
      <MobileOnly>
        <MobileTable
          status={status}
          delegateFunction={delegateFunction}
          data={rowData}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </MobileOnly>
      {openModal && confirmDelegationModal && (
        <Modal
          title=""
          isOpen={openModal && confirmDelegationModal}
          onClose={() => {
            setOpenModal(false);
            setConfirmDelegationModal(false);
          }}
        >
          <SaturatedPoolAlert
            delegation={delegationModalData}
            onSuccess={confirmedDelegateFunction}
            close={() => {
              setOpenModal(false);
              setConfirmDelegationModal(false);
            }}
          />
        </Modal>
      )}
      <CreditSection>
        Powered by
        <a href="https://cexplorer.io/" target="_blank" rel="noopener noreferrer">
          <img src={cexplorerIconMini} id="logo-mini" alt="cexplorer-logo" />
          <img src={cexplorerIcon} id="logo" alt="cexplorer-logo" />
        </a>
      </CreditSection>
    </Layout>
  );
}

export default Home;
