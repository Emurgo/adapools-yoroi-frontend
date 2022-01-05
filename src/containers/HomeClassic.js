// @flow

import React, { useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Search from '../components/Search/SearchClassic';
import Alert from '../components/common/Alert';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/common/Breakpoints';
import { listBiasedPools } from '../API/api';
import type { Pool, SearchParams } from '../API/api';
import DesktopTableClassic from '../components/DesktopTable/DesktopTableClassic';
import MobileTableClassic from '../components/MobileTable/MobileTableClassic';
import SortSelect from '../components/SortSelect/SortSelectClassic';
import type { QueryState } from '../utils/types';

import Modal from '../components/common/Modal';
import SaturatedPoolAlert from '../components/SaturatedPoolAlert/SaturatedPoolAlert';
import adapoolIcon from '../assets/adapool-logo-extend.svg';
import { SATURATION_LIMIT } from '../utils/constants';

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
|}

function Home(props: HomeProps): Node {
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
      .then((pools: Pool[]) => {
        setStatus('resolved');
        setRowData(pools);
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
      .then((pools: Pool[]) => {
        setStatus('resolved');
        setRowData(pools);
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
      .then((pools: Pool[]) => {
        setStatus('resolved');
        setRowData(pools);
      })
      .catch((err) => {
        setStatus('rejected');
        console.error(err);
      });
  };

  const confirmedDelegateFunction = (id: string): void => {
    YoroiCallback(([id]), {
      source: urlParams.source,
      chromeId: urlParams.chromeId,
      mozId: urlParams.mozId,
    });
  }

  const delegateFunction = (delegation: DelegationProps, totalAda: ?number): void => {
    if (delegation == null) return;
    const lovelaceDelegation = totalAda == null ? 0 : totalAda * 1000000;

    if (Number(delegation.stakepoolTotalStake) + lovelaceDelegation >= SATURATION_LIMIT) {
      setDelegationModalData({ ...delegation, totalAda })
      setConfirmDelegationModal(true)
      setOpenModal(true)
    }
    else {
      confirmedDelegateFunction(delegation.id)
    }
  };

  const alertText = null;

  function filterPools(
    pools: ?Array<Pool>,
    totalAda: ?number,
  ): ?Array<Pool> {
    if (pools == null) return pools;

    // don't filter out saturated pools if the user explicitly searches
    if (filterOptions.search != null && filterOptions.search !== '') {
      return pools;
    }

    const lovelaceDelegation = totalAda == null ? 0 : totalAda * 1000000;

    if (lovelaceDelegation > SATURATION_LIMIT) return pools;

    return pools.filter(item => {
      return item != null && (Number(item.total_stake) + lovelaceDelegation < SATURATION_LIMIT);
    });
  }

  const { urlParams: { selectedPoolIds, totalAda } } = props
  return (
    <Layout>
      <Alert title={alertText} />
      <Header>
        <Search filter={filterSearch} />
        <SortSelect filter={filterSelect} />
      </Header>
      <DesktopOnly>
        <DesktopTableClassic
          status={status}
          delegateFunction={delegateFunction}
          data={filterPools(rowData, totalAda)}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </DesktopOnly>
      <MobileOnly>
        <MobileTableClassic
          status={status}
          delegateFunction={delegateFunction}
          data={filterPools(rowData, totalAda)}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </MobileOnly>
      {openModal && confirmDelegationModal && (
        <Modal
          title=""
          isOpen={openModal && confirmDelegationModal}
          onClose={() => {setOpenModal(false); setConfirmDelegationModal(false)}}
        >
          <SaturatedPoolAlert
            delegation={delegationModalData}
            onSuccess={confirmedDelegateFunction}
            close={() => {setOpenModal(false); setConfirmDelegationModal(false)}}
          />
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
