// @flow
import React from 'react';
import styled from 'styled-components';
import { Pool, Sorting } from '../API/api';
import { CostsCardRevamp } from './CostsCard';
import { PledgeCardRevamp } from './PledgeCard';
import { CardRoaRevamp } from './CardRoa';
import { formatBigNumber, formatCostLabel } from '../utils/utils';
import { ButtonRevamp } from './common/Button';
import { TooltipRevamp } from './common/Tooltip';
import type { QueryState } from '../utils/types';
import type { DelegationProps } from '../containers/Home';
import StakingPoolCardRevamp from './StakingPoolCardRevamp';
import { PoolSizeTagRevamp } from './PoolSizeTag';
import Label from './common/Label';

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
    position: relative;

    &:after {
      content: '';
      width: 100%;
      height: 6px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid #f0f4f5;
    }
    th {
      text-align: left;
      color: #6b7384;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;
      padding: 12px 20px 16px 0;
      &:first-child > div:first-child {
        align-items: baseline;
      }
    }
  }
  tbody {
    td {
      &:not(:first-child) {
        padding-right: 25px;
      }
    }
  }
  [class^='col'] {
    width: 180px;
  }
  .col-0 {
    width: 360px;
  }
  .col-1 {
    width: 100px;
  }
  .col-2 {
    width: 130px;
  }
  .col-3 {
    width: 100px;
  }
  .col-4 {
    width: 120px;
  }
  .col-5 {
    width: 90px;
  }
  .col-6 {
    width: 90px;
  }
  .col-7 {
    width: 70px;
  }
  .col-last {
    width: 120px;
  }
`;

type Props = {|
  data: ?Array<Pool>,
  delegateFunction: (DelegationProps, ?number) => void,
  +status: QueryState,
  selectedIdPools: ?Array<string>,
  totalAda: ?number,
  handleSort: Function,
  activeSort: Object,
|};

function DesktopTableRevamp({
  data,
  delegateFunction,
  status,
  selectedIdPools,
  totalAda,
  handleSort,
  activeSort,
}: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data != null && data.length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>No results found.</h1>;
  }

  if (isLoading) {
    return <h1 style={{ fontWeight: 400 }}>Loading..</h1>;
  }

  if (isRejected) {
    return <h1>Oops! something wrong happened. Try again!</h1>;
  }

  const tableTheads = [
    {
      id: 0,
      label: 'Ticker and name',
      textInfo: null,
      value: Sorting.TICKER,
    },
    {
      id: 1,
      label: 'ROA',
      textInfo: 'Estimated ROA (Return of ADA, annualised) based on lifetime staking results',
      value: Sorting.ROA,
    },
    {
      id: 2,
      label: 'Pool size',
      textInfo: 'Entire Supply',
      value: Sorting.POOL_SIZE,
    },
    {
      id: 3,
      label: 'Share',
      textInfo: 'Total share of all ada being staked in pool',
      value: Sorting.SHARE,
    },
    {
      id: 4,
      label: 'Costs',
      textInfo: 'Tax ratio + Fix',
      value: Sorting.COSTS,
    },
    {
      id: 5,
      label: 'Pledge',
      textInfo: 'Available Pledge',
      value: Sorting.PLEDGE,
    },
    {
      id: 6,
      label: 'Blocks',
      textInfo:
        'Minted blocks in actual epoch + block trend; Background = today estimated performance',
      value: Sorting.BLOCKS,
    },
  ];

  return (
    <TableContent>
      <Table>
        <thead>
          <tr role="row">
            {tableTheads.map(({ label, value, textInfo, id }) => (
              <th key={`col-${id}`} scope="col" className={`col-${id}`}>
                <TooltipRevamp textInfo={textInfo} />
                <Label label={label} sortValue={value} sort={handleSort} activeSort={activeSort} />
              </th>
            ))}
            <th className="col-last" />
          </tr>
        </thead>
        <tbody>
          {data != null &&
            data
              .filter((x) => x != null)
              .map((pool) => (
                <tr role="row" key={pool.id}>
                  <td>
                    <StakingPoolCardRevamp
                      id={pool.id}
                      bech={pool.id_bech}
                      avatar={pool.pool_pic}
                      tickerName={pool.db_ticker}
                      name={pool.db_name}
                      links={pool.handles}
                      fullname={pool.fullname}
                    />
                  </td>
                  <td>
                    <CardRoaRevamp roa={pool.roa} />
                  </td>
                  <td>
                    <ValueRevamp>{formatBigNumber(pool.total_stake)}</ValueRevamp>
                  </td>
                  <td>
                    <PoolSizeTagRevamp value={pool.saturation} />
                  </td>
                  <td>
                    <CostsCardRevamp
                      value={formatCostLabel(Number(pool.tax_ratio), pool.tax_fix)}
                    />
                  </td>
                  <td>
                    <PledgeCardRevamp value={pool.pledge} real={pool.pledge_real} />
                  </td>
                  <td>
                    <ValueRevamp>{pool.blocks_epoch}</ValueRevamp>
                  </td>
                  <td>
                    <ButtonRevamp
                      disabled={selectedIdPools != null && selectedIdPools.indexOf(pool.id) > -1}
                      onClick={() =>
                        delegateFunction(
                          {
                            stakepoolName: pool.db_name ?? '',
                            stakepoolTotalStake: pool.total_stake,
                            isAlreadySaturated: pool.saturation >= 1,
                            id: pool.id,
                          },
                          totalAda,
                        )
                      }
                    >
                      Delegate
                    </ButtonRevamp>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </TableContent>
  );
}

export default DesktopTableRevamp;

export const ValueRevamp: any = styled.div`
  color: #242838;
  font-size: 16px;
`;
