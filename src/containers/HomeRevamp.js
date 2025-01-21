// @flow

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import LayoutRevamp from '../components/layout/LayoutRevamp';
import Alert from '../components/Alert';
import { SendFirstAdapool, YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { listBiasedPools, Sorting, SortingDirections } from '../API/api';
import type { ListBiasedPoolsResponse, Pool, SearchParams } from '../API/api';
import SortSelect from '../components/SortSelect';
import type { QueryState } from '../utils/types';

import Modal from '../components/common/Modal';
import SaturatedPoolAlert from '../components/SaturatedPoolAlert';
import cexplorerIconMini from '../assets/cexplorer-logo-mini.svg';
import cexplorerIcon from '../assets/cexplorer-logo-extend.svg';
import DesktopTableRevamp from '../components/DesktopTableRevamp';
import SearchRevamp from '../components/SearchRevamp';
import MobileTableRevamp from '../components/MobileTableRevamp';
import { formatCostLabel } from '../utils/utils';

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;
  @media (max-width: 1125px) {
    flex-direction: column;
    align-items: center;
    form {
      margin-bottom: 20px;
    }
  }
`;
const Title = styled.h1`
  color: #000;
  font-weight: 500;
  font-size: 18px;
  @media (max-width: 1125px) {
    margin-bottom: 20px;
  }
`;
const HeaderRow = styled('div')(({ isDark }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: isDark ? '2px solid #15171F' : '2px solid #f0f4f5',
  '@media (max-width: 1125px)': {
    flexDirection: 'column',
  },
}));

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
  theme: ?string,
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

// Ref for sorting strings: https://stackoverflow.com/a/51169/7714589
const SORTING_FUNCTIONS = {
  [`${Sorting.TICKER}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) =>
    a.db_ticker?.localeCompare(String(b.db_ticker)),
  [`${Sorting.TICKER}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) =>
    b.db_ticker?.localeCompare(String(a.db_ticker)),
  [`${Sorting.ROA}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) => Number(a.roa) - Number(b.roa),
  [`${Sorting.ROA}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) => Number(b.roa) - Number(a.roa),
  [`${Sorting.POOL_SIZE}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) =>
    a.total_size - b.total_size,
  [`${Sorting.POOL_SIZE}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) =>
    b.total_size - a.total_size,
  [`${Sorting.SATURATION}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) =>
    a.saturation - b.saturation,
  [`${Sorting.SATURATION}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) =>
    b.saturation - a.saturation,
  [`${Sorting.PLEDGE}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) =>
    Number(a.pledge) - Number(b.pledge),
  [`${Sorting.PLEDGE}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) =>
    Number(b.pledge) - Number(a.pledge),
  [`${Sorting.BLOCKS}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) =>
    Number(a.blocks_epoch) - Number(b.blocks_epoch),
  [`${Sorting.BLOCKS}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) =>
    Number(b.blocks_epoch) - Number(a.blocks_epoch),
  [`${Sorting.COSTS}_${SortingDirections.ASC}`]: (a: Pool, b: Pool) =>
    formatCostLabel(Number(a.tax_ratio), a.tax_fix).localeCompare(
      formatCostLabel(Number(b.tax_ratio), b.tax_fix),
    ),
  [`${Sorting.COSTS}_${SortingDirections.DESC}`]: (a: Pool, b: Pool) =>
    formatCostLabel(Number(b.tax_ratio), b.tax_fix).localeCompare(
      formatCostLabel(Number(a.tax_ratio), a.tax_fix),
    ),
};

const defaultActiveSort = { sort: Sorting.TICKER, sortDirection: '' };

function Home(props: HomeProps): Node {
  const [saturationLimit, setSaturationLimit] = React.useState<?number>(null);
  const [rowData, setRowData] = React.useState<?Array<Pool>>(null);
  const [rowDataSorted, setRowDataSorted] = React.useState<?Array<Pool>>(null);
  const [status, setStatus] = React.useState<QueryState>('idle');
  const [filterOptions, setFilterOptions] = React.useState<SearchParams>({
    search: '',
    sort: Sorting.SCORE,
    sortDirection: SortingDirections.ASC,
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [confirmDelegationModal, setConfirmDelegationModal] = React.useState<boolean>(false);
  const [delegationModalData, setDelegationModalData] = React.useState<Object>({});

  const { urlParams } = props;
  const seed = urlParams?.bias ?? 'bias';
  const [activeSort, setActiveSort] = useState(defaultActiveSort);

  useEffect(() => {
    setStatus('pending');
    listBiasedPools(seed, {})
      .then((resp: ListBiasedPoolsResponse) => {
        setStatus('resolved');
        setRowData(resp.pools);
        setSaturationLimit(resp.saturationLimit);
        // used to show the first pool in revamp banner
        SendFirstAdapool(resp.pools[0]);
      })
      .catch((err) => {
        setStatus('rejected');
        console.error(err);
      });
  }, []);

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
        setRowDataSorted(resp.pools);
        setActiveSort(defaultActiveSort);
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

  const sortData = (sorting: Object) => {
    const defaultRowData = [].concat(rowData ?? []);
    if (sorting.sortDirection) {
      const SORTING_KEY = `${sorting.sort}_${sorting.sortDirection}`;
      const sortingFunc = SORTING_FUNCTIONS[SORTING_KEY];
      const newRowDataSorted = [].concat(rowDataSorted != null ? rowDataSorted : rowData ?? []);
      const newSortedRowData = sortingFunc ? newRowDataSorted?.sort(sortingFunc) : defaultRowData;
      setRowDataSorted(newSortedRowData);
      return;
    }

    setRowDataSorted(defaultRowData);
  };

  const handleSort = (key: string) => {
    let newActiveSort = { sort: key, sortDirection: SortingDirections.ASC };

    if (key !== activeSort.sort) {
      setActiveSort(newActiveSort);
    } else {
      let sortDirection = SortingDirections.ASC;
      if (activeSort.sortDirection && activeSort.sortDirection === SortingDirections.ASC) {
        sortDirection = SortingDirections.DESC;
      } else if (activeSort.sortDirection && activeSort.sortDirection === SortingDirections.DESC) {
        sortDirection = '';
      }
      newActiveSort = { sort: key, sortDirection };
      setActiveSort(newActiveSort);
    }

    sortData(newActiveSort);
  };

  // the filtering happens on search and
  // we sort based on the actual results
  const filterSelect = (value) => {
    setActiveSort({ sort: value, sortDirection: SortingDirections.ASC });
    sortData({ sort: value, sortDirection: SortingDirections.ASC });
  };

  const {
    urlParams: { selectedPoolIds, totalAda, theme },
  } = props;

  const filteredPools = rowDataSorted || rowData;
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  return (
    <LayoutRevamp urlParams={urlParams}>
      <HeaderRow isDark={isDark}>
        <Title>Stake pools ({status === 'resolved' ? filteredPools?.length : '...'})</Title>
        <Alert title={alertText} />
        <Header>
          <SearchRevamp filter={filterSearch} isDark={isDark} isLight={isLight} />
          <MobileOnly>
            <SortSelect filter={filterSelect} isDark={isDark} />
          </MobileOnly>
          {/* <ColorButton type="button" onClick={() => setOpenModal(true)}> */}
          {/*  Colors meaning */}
          {/* </ColorButton> */}
        </Header>
      </HeaderRow>
      <DesktopOnly>
        <DesktopTableRevamp
          status={status}
          delegateFunction={delegateFunction}
          data={filteredPools}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
          handleSort={handleSort}
          activeSort={activeSort}
          isDark={isDark}
        />
      </DesktopOnly>
      <MobileOnly>
        <MobileTableRevamp
          status={status}
          delegateFunction={delegateFunction}
          data={filteredPools}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
          isDark={isDark}
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
    </LayoutRevamp>
  );
}

export default Home;
