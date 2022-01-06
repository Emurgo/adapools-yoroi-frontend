// @flow
import React from 'react';
import styled from 'styled-components';
import type { Pool } from '../../API/api';
import CostsCardRevamp from '../widgets/CostsCard/CostsCardRevamp';
import PledgeCardRevamp from '../widgets/PledgeCard/PledgeCardRevamp';
import CardRoaRevamp from '../widgets/CardRoa/CardRoaRevamp';
import { formatBigNumber, formatCostLabel } from '../../utils/utils';
import ButtonRevamp from '../common/Button/ButtonRevamp';
import TooltipRevamp from '../common/Tooltip/TooltipRevamp';
import type { QueryState } from '../../utils/types';
import type { DelegationProps } from '../../containers/HomeClassic';
import StakingPoolCardRevamp from '../widgets/StakingPoolCard/StakingPoolCardRevamp';
import PoolSizeTagRevamp from '../widgets/PoolSizeTag/PoolSizeTagRevamp';
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
      top: 50px;
      border-bottom: 2px solid #f0f4f5;
    }
    th {
      &:first-child {
        text-align: left;
      }
      &:not(:first-child) {
        text-align: right;
      }
      color: #6b7384;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;
      padding: 12px 20px 40px 0;
      &:first-child > div:first-child {
        align-items: baseline;
      }
    }
  }
  tbody {
    tr {
    }
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
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 100px;
    }
  }
  .col-4 {
    width: 110px;
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 110px;
    }
  }
  .col-5 {
    width: 90px;
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 60px;
    }
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
|};

function DesktopTableRevamp({
  data,
  delegateFunction,
  status,
  selectedIdPools,
  totalAda,
}: Props): React$Node {
  const { isLoading, isSuccess, isError } = status;

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <h1>Oops! something wrong happened. Try again!</h1>;
  }
  if (isSuccess && data != null && data.length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>No results found.</h1>;
  }

  const tableTheads = [
    {
      id: 0,
      label: 'Ticker and name',
      textInfo: null,
    },
    {
      id: 1,
      label: 'ROA 30d',
      textInfo: 'Estimated ROA (Return of ADA, annualised) based on lifetime staking results',
    },
    {
      id: 2,
      label: 'Pool Size (ADA)',
      textInfo: 'Entire Supply',
    },
    {
      id: 3,
      label: 'Share',
      textInfo: 'Total share of all ada being staked in pool',
    },
    {
      id: 4,
      label: 'Costs',
      textInfo: 'Tax ratio + Fix',
    },
    {
      id: 5,
      label: 'Pledge',
      textInfo: 'Available Pledge',
    },
    {
      id: 6,
      label: 'Blocks',
      textInfo:
        'Minted blocks in actual epoch + block trend; Background = today estimated performance',
    },
  ];
  return (
    <TableContent>
      <Table>
        <thead>
          <tr role="row">
            {tableTheads.map(({ label, textInfo, id }) => (
              <th key={`col-${id}`} scope="col" className={`col-${id}`}>
                <TooltipRevamp label={label} textInfo={textInfo} />
              </th>
            ))}
            <th className="col-last" />
          </tr>
        </thead>
        <tbody>
          {isSuccess &&
            data != null &&
            data.length &&
            data
              .filter((x) => x != null)
              .map((pool) => (
                <tr role="row" key={pool.id}>
                  <td>
                    <StakingPoolCardRevamp
                      id={pool.id}
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
