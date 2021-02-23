// @flow

import React, { useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Search from '../components/Search';
import Alert from '../components/Alert';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { getPools, listPools } from '../API/api';
import type { ApiPoolsResponse, Pool, SearchParams } from '../API/api';
import DesktopTable from '../components/DesktopTable';
import MobileTable from '../components/MobileTable';
import SortSelect from '../components/SortSelect';
import type { QueryState } from '../utils/types';

import Modal from '../components/common/Modal';
import SaturatedPoolAlert from '../components/SaturatedPoolAlert';
import ProviderSelect from '../components/ProviderSelect';

// k = 500
const SATURATION_LIMIT = 63600000000000;

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

export type UrlParams = {|
    chromeId: ?string,
    mozId: ?string,
    source: ?string,
    selectedPoolIds: ?Array<string>,
    lang: ?string,
    totalAda: ?number,
|};

export type AdapoolsTableProps = {|
  urlParams: UrlParams,
|};

export type DelegationProps = {|
    stakepoolName: string,
    stakepoolTotalStake: string,
    isAlreadySaturated: boolean,
    id: string,
|}

function AdapoolsTable(props: AdapoolsTableProps): Node {
  const [rowData, setRowData] = React.useState<?Array<Pool>>(null);
  const [status, setStatus] = React.useState<QueryState>('idle');
  const [filterOptions, setFilterOptions] = React.useState<SearchParams>({
    search: '',
    sort: 'score',
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [confirmDelegationModal, setConfirmDelegationModal] = React.useState<boolean>(false);
  const [delegationModalData, setDelegationModalData] = React.useState<Object>({});

  const toPoolArray: ?{| [string]: Pool |} => Array<Pool> = (pools) => {
    if (pools == null) return [];
    return Object.keys(pools).map(key => pools[key]);
  };

  useEffect(() => {
    setStatus('pending');
    listPools()
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved');
        setRowData(toPoolArray(poolsData.pools))
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
    getPools(newSearch)
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved');
        setRowData(toPoolArray(poolsData.pools));
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
    getPools(newSearch)
      .then((poolsData: ApiPoolsResponse) => {
        setStatus('resolved');
        setRowData(toPoolArray(poolsData.pools));
      })
      .catch((err) => {
        setStatus('rejected');
        console.error(err);
      });
  };

  const confirmedDelegateFunction = (id: string): void => {
    const { urlParams } = props;

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
    } else {
      confirmedDelegateFunction(delegation.id)
    }
  };

  const alertText = 'The new saturation point for Stakepools will be 63.6 million ADA from December 6th. If the "Pool Size" parameter of your Stakepool is over this limit, delegate to a new stakepool to avoid less than expected rewards';

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

    return pools.filter(item => (
      Number(item.total_stake) + lovelaceDelegation < SATURATION_LIMIT
    ));
  }

  const { urlParams: { selectedPoolIds, totalAda } } = props
  return (
    <>
      <Alert title={alertText} />
      <Header>
        <Search filter={filterSearch} />
        <SortSelect filter={filterSelect} />
        <ProviderSelect />
        {/* <ColorButton type="button" onClick={() => setOpenModal(true)}> */}
        {/*  Colors meaning */}
        {/* </ColorButton> */}
      </Header>
      <DesktopOnly>
        <DesktopTable
          status={status}
          delegateFunction={delegateFunction}
          data={filterPools(rowData, totalAda)}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </DesktopOnly>
      <MobileOnly>
        <MobileTable
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
    </>
  );
}

export default AdapoolsTable;
