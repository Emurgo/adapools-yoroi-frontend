// @flow
import React from 'react';
import styled from 'styled-components';
import type { PoolDaedalusSimple } from '../../API/api';
import StakingPoolCard from '../StakingPoolCard';
import { roundTwoDecimal } from '../../utils/utils';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import type { QueryState } from '../../utils/types';
import type { DelegationProps } from '../../containers/HomeContainer';
import PotentialRewardCard from '../PotentialRewardCard';
import AlertsCard from '../AlertsCard';
import Loader from '../common/Loader';

const TableContent = styled.div`
  display: inline-flex;
  align-items: flex-end;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-spacing: 0 0.8rem;
  position: relative;
  table-layout: fixed;
  tr td {
    white-space: nowrap;
  }
  thead {
    &:after {
      content: '';
      width: 100%;
      height: 6px;
      position: absolute;
      left: 0;
      right: 0;
      box-shadow: inset 0 -1px 10px 0 rgba(255, 255, 255, 0.5),
        inset 0 2px 4px 0 rgba(56, 57, 61, 0.2), 0 1px 3px 0 rgba(255, 255, 255, 0.5);
    }
    th {
      &:not(:first-child) {
        text-align: right;
      }
      color: #6b7384;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;
      padding: 20px 20px 20px 0;
      &:first-child > div,
      &:nth-child(2) > div {
        justify-content: flex-start;
        text-align: left;
      }
    }
  }
  tbody {
    tr {
      border-bottom: 2px solid #dee2ea;
    }
    td {
      &:not(:first-child) {
        padding-right: 20px;
        text-align: right;
      }
    }
  }
  [class^='col'] {
    width: 90px;
  }
  .col-0 {
    width: 44px;
  }
  .col-1 {
    width: 200px;
  }
  .col-2 {
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 115px;
    }
  }
  .col-3 {
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 115px;
    }
  }
  .col-4 {
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 110px;
    }
  }
  .col-5 {
    width: 130px;
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 110px;
    }
  }
  .col-last {
    width: 120px;
  }
`;

type Props = {|
  data: ?Array<PoolDaedalusSimple>,
  delegateFunction: (DelegationProps, ?number) => void,
  +status: QueryState,
  selectedIdPools: ?Array<string>,
  totalAda: ?number,
|};

function DaedalusSimpleDesktopTable({
  data,
  delegateFunction,
  status,
  selectedIdPools,
  totalAda,
}: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data != null && data.length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>No results found.</h1>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isRejected) {
    return <h1>Oops! something wrong happened. Try again!</h1>;
  }

  const tableTheads = [
    {
      id: 0,
      label: 'Rank',
      textInfo: null,
    },
    {
      id: 1,
      label: 'Name',
      textInfo: null,
    },
    {
      id: 2,
      label: 'Potential Reward Per Epoch',
      textInfo: 'Lorem ipsum Lorem ipsumLorem ipsum Lorem ipsum',
    },
    {
      id: 3,
      label: 'Potential Reward Per Month',
      textInfo: 'Lorem ipsum Lorem ipsumLorem ipsum Lorem ipsum',
    },
    {
      id: 4,
      label: 'Potential Reward Per Year',
      textInfo: 'Lorem ipsum Lorem ipsumLorem ipsum Lorem ipsum',
    },
    {
      id: 5,
      label: 'Alerts',
      textInfo: null,
    },
  ];

  return (
    <TableContent>
      <Table>
        <thead>
          <tr role="row">
            {tableTheads.map((item) => (
              <th key={`col-${item.id}`} scope="col" className={`col-${item.id}`}>
                <Tooltip label={item.label} textInfo={item.textInfo ?? ''} />
              </th>
            ))}
            <th className="col-last" />
          </tr>
        </thead>
        <tbody>
          {data != null &&
            data.map((pool, idx) => (
              <tr role="row" key={pool.id}>
                {/* TODO: fix ranking */}
                <td>{idx + 1}</td>
                <td>
                  <StakingPoolCard
                    id={pool.id}
                    avatar={pool.pool_pic}
                    tickerName={pool.db_ticker}
                    name={pool.db_name}
                    links={pool.handles}
                    fullname={pool.fullname}
                  />
                </td>
                <td>
                  <PotentialRewardCard
                    value={pool.potential_reward_epoch}
                    percentage={roundTwoDecimal(pool.potential_reward_epoch_computed)}
                  />
                </td>
                <td>
                  <PotentialRewardCard
                    value={pool.potential_reward_month}
                    percentage={roundTwoDecimal(pool.potential_reward_month_computed)}
                  />
                </td>
                <td>
                  <PotentialRewardCard
                    value={pool.potential_reward_year}
                    percentage={roundTwoDecimal(pool.potential_reward_year_computed)}
                  />
                </td>
                <td>
                  {/* TODO: */}
                  <AlertsCard
                    isSaturated={idx !== 0 && idx % 6 === 0}
                    isRetiring={idx % 7 === 0}
                    isNew={idx !== 0 && idx % 3 === 0}
                    isChanging={idx % 9 === 0}
                  />
                </td>
                <td>
                  <Button
                    disabled={selectedIdPools != null && selectedIdPools.indexOf(pool.id) > -1}
                    onClick={() =>
                      delegateFunction(
                        {
                          // $FlowFixMe:
                          stakepoolName: pool.db_name,
                          stakepoolTotalStake: pool.total_stake,
                          isAlreadySaturated: pool.saturation >= 1,
                          id: pool.id,
                        },
                        totalAda,
                      )
                    }
                  >
                    Delegate
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </TableContent>
  );
}

export default DaedalusSimpleDesktopTable;
