// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Alert from '../components/common/Alert';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/common/Breakpoints';
import type { Pool, SearchParams } from '../API/api';
import SortSelect from '../components/SortSelect/SortSelectClassic';

import Modal from '../components/common/Modal';
import SaturatedPoolAlert from '../components/SaturatedPoolAlert/SaturatedPoolAlert';
import adapoolIcon from '../assets/adapool-logo-extend.svg';
import DesktopTableRevamp from '../components/DesktopTable/DesktopTableRevamp';
import SearchRevamp from '../components/Search/SearchRevamp';
import MobileTableRevamp from '../components/MobileTable/MobileTableRevamp';
import { SATURATION_LIMIT } from '../utils/constants';
import { useListBiasedPoolsRevamp } from '../hooks/query/useListBiasedPools';

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
const Title = styled.h1`
  color: #38393d;
  font-size: 18px;
  @media (max-width: 1125px) {
    margin-bottom: 20px;
  }
`;
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f4f5;
  @media (max-width: 1125px) {
    flex-direction: column;
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
|};

function Home(props: HomeProps): Node {
  const [filterOptions, setFilterOptions] = React.useState<SearchParams>({
    search: '',
    sort: 'score',
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [confirmDelegationModal, setConfirmDelegationModal] = React.useState<boolean>(false);
  const [delegationModalData, setDelegationModalData] = React.useState<Object>({});

  const { urlParams } = props;
  const seed = urlParams?.bias ?? 'bias';
  const { isLoading, isSuccess, isError, poolList } = useListBiasedPoolsRevamp(seed, filterOptions);

  const filterSelect = (value) => {
    const newSearch = {
      ...filterOptions,
      sort: value,
    };
    setFilterOptions(newSearch);
  };
  const filterSearch = (value) => {
    const newSearch = {
      ...filterOptions,
      search: value,
    };
    setFilterOptions(newSearch);
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

    if (Number(delegation.stakepoolTotalStake) + lovelaceDelegation >= SATURATION_LIMIT) {
      setDelegationModalData({ ...delegation, totalAda });
      setConfirmDelegationModal(true);
      setOpenModal(true);
    } else {
      confirmedDelegateFunction(delegation.id);
    }
  };

  const alertText = null;

  function filterPools(pools: ?Array<Pool>, totalAda: ?number): ?Array<Pool> {
    if (pools == null) return pools;

    // don't filter out saturated pools if the user explicitly searches
    if (filterOptions.search != null && filterOptions.search !== '') {
      return pools;
    }

    const lovelaceDelegation = totalAda == null ? 0 : totalAda * 1000000;

    if (lovelaceDelegation > SATURATION_LIMIT) return pools;

    return pools.filter((item) => {
      return item != null && Number(item.total_stake) + lovelaceDelegation < SATURATION_LIMIT;
    });
  }

  const {
    urlParams: { selectedPoolIds, totalAda },
  } = props;

  const filteredPools = filterPools(poolList, totalAda);

  return (
    <Layout>
      <HeaderRow>
        <Title>Stake Pools ({isSuccess ? filteredPools?.length : '...'})</Title>
        <Alert title={alertText} />
        <Header>
          <SearchRevamp filter={filterSearch} />
          <SortSelect filter={filterSelect} />
        </Header>
      </HeaderRow>
      <DesktopOnly>
        <DesktopTableRevamp
          status={{ isLoading, isSuccess, isError }}
          delegateFunction={delegateFunction}
          data={filteredPools}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </DesktopOnly>
      <MobileOnly>
        <MobileTableRevamp
          status={{ isLoading, isSuccess, isError }}
          delegateFunction={delegateFunction}
          data={filteredPools}
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
        <a href="https://adapools.org/" target="_blank" rel="noopener noreferrer">
          <img src={adapoolIcon} alt="adapool-logo" />
        </a>
      </CreditSection>
    </Layout>
  );
}

export default Home;
