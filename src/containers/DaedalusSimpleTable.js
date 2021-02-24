// @flow

import React, { useEffect } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Search from '../components/Search';
import Alert from '../components/Alert';
import { YoroiCallback } from '../API/yoroi';

import { DesktopOnly, MobileOnly } from '../components/layout/Breakpoints';
import { getPoolsByDaedalusSimple } from '../API/api';
import type { ApiPoolsDaedalusSimpleResponse, PoolDaedalusSimple, SearchParams } from '../API/api';
import type { QueryState } from '../utils/types';

import Modal from '../components/common/Modal';
import SaturatedPoolAlert from '../components/SaturatedPoolAlert';
import ProviderSelect from '../components/ProviderSelect';
import DaedalusSimpleDesktopTable from '../components/tables/DaedalusSimpleDesktopTable';
import DaedalusSimpleMobileTable from '../components/tables/DaedalusSimpleMobileTable';

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

export type UrlParams = {|
  chromeId: ?string,
  mozId: ?string,
  source: ?string,
  selectedPoolIds: ?Array<string>,
  lang: ?string,
  totalAda: ?number,
|};

export type DaedalusSimpleTableProps = {|
  urlParams: UrlParams,
|};

export type DelegationProps = {|
  stakepoolName: string,
  stakepoolTotalStake: string,
  isAlreadySaturated: boolean,
  id: string,
|};

function DaedalusSimpleTable(props: DaedalusSimpleTableProps): Node {
  const [rowData, setRowData] = React.useState<?Array<PoolDaedalusSimple>>(null);
  const [status, setStatus] = React.useState<QueryState>('idle');
  const [filterOptions, setFilterOptions] = React.useState<SearchParams>({
    search: '',
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [confirmDelegationModal, setConfirmDelegationModal] = React.useState<boolean>(false);
  const [delegationModalData, setDelegationModalData] = React.useState<Object>({});

  const toPoolArray: (?{| [string]: PoolDaedalusSimple |}) => Array<PoolDaedalusSimple> = (
    pools,
  ) => {
    if (pools == null) return [];
    return Object.keys(pools).map((key) => pools[key]);
  };

  useEffect(() => {
    setStatus('pending');
    getPoolsByDaedalusSimple()
      .then((poolsData: ApiPoolsDaedalusSimpleResponse) => {
        setStatus('resolved');
        setRowData(toPoolArray(poolsData.pools));
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
    getPoolsByDaedalusSimple(newSearch)
      .then((poolsData: ApiPoolsDaedalusSimpleResponse) => {
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

  const alertText =
    'The new saturation point for Stakepools will be 63.6 million ADA from December 6th. If the "Pool Size" parameter of your Stakepool is over this limit, delegate to a new stakepool to avoid less than expected rewards';

  function filterPools(
    pools: ?Array<PoolDaedalusSimple>,
    totalAda: ?number,
  ): ?Array<PoolDaedalusSimple> {
    if (pools == null) return pools;

    // don't filter out saturated pools if the user explicitly searches
    if (filterOptions.search != null && filterOptions.search !== '') {
      return pools;
    }

    const lovelaceDelegation = totalAda == null ? 0 : totalAda * 1000000;

    if (lovelaceDelegation > SATURATION_LIMIT) return pools;

    // const arr = pools.filter(
    //   (item) => Number(item.total_stake) + lovelaceDelegation < SATURATION_LIMIT,
    // );
    return pools;
  }

  const {
    urlParams: { selectedPoolIds, totalAda },
  } = props;

  return (
    <>
      <Alert title={alertText} />
      <Header>
        <Search filter={filterSearch} />
        <ProviderSelect />
      </Header>
      <DesktopOnly>
        <DaedalusSimpleDesktopTable
          status={status}
          delegateFunction={delegateFunction}
          data={filterPools(rowData, totalAda)}
          selectedIdPools={selectedPoolIds}
          totalAda={totalAda}
        />
      </DesktopOnly>
      <MobileOnly>
        <DaedalusSimpleMobileTable
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
    </>
  );
}

export default DaedalusSimpleTable;
