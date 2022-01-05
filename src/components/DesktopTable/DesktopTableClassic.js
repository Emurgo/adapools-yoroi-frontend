// @flow
import React from 'react';
import styled from 'styled-components';
import type { Pool } from '../../API/api';
import StakingPoolCardClassic from '../widgets/StakingPoolCard/StakingPoolCardClassic';
import PoolSizeCardClassic from '../widgets/PoolSizeCard/PoolSizeCardClassic';
import CostsCardClassic from '../widgets/CostsCard/CostsCardClassic';
import PledgeCardClassic from '../widgets/PledgeCard/PledgeCardClassic';
import CardRoaClassic from '../widgets/CardRoa/CardRoaClassic';
import { formatBigNumber, formatCostLabel } from '../../utils/utils';
import Button from '../common/Button/ButtonClassic';
import TooltipClassic from '../common/Tooltip/TooltipClassic';
import type { QueryState } from '../../utils/types';
import type { DelegationProps } from '../../containers/HomeClassic';
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
      box-shadow: inset 0 -1px 10px 0 rgba(255,255,255,0.5), inset 0 2px 4px 0 rgba(56,57,61,0.2), 0 1px 3px 0 rgba(255,255,255,0.5);
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
      padding: 20px 20px 20px 0;
      &:first-child > div:first-child {
        justify-content: flex-start;
      }
    }
  }
  tbody {
    tr {
      border-bottom: 2px solid #dee2ea;
    }
    td {
      &:not(:first-child) {
      padding-right: 25px;
        text-align: right;
      }
    }
  }
  [class^="col"]{
    width: 180px;
  }
  .col-0 {
    width: 360px;
  }
  .col-1 {
    width: 110px;
  }
  .col-2 {
    width: 170px;
    @media (min-width:1125px) and (max-width: 1200px) {
      width: 115px;
    }
  }
  .col-3 {
    width: 115px;
    @media (min-width:1125px) and (max-width: 1200px) {
      width: 115px;
    }
  }
  .col-4 {
    width: 110px;
    @media (min-width:1125px) and (max-width: 1200px) {
      width: 110px;
    }
  }
  .col-5 {
    width: 80px;
    @media (min-width:1125px) and (max-width: 1200px) {
      width: 60px;
    }
  }
  .col-6 {
    width: 100px;
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

function DesktopTable({ data, delegateFunction, status, selectedIdPools, totalAda }: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data != null && data.length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>No results found.</h1>;
  }

  if(isLoading) {
    return <Loader />;
  }

  if(isRejected) {
    return (
      <h1>Oops! something wrong happened. Try again!</h1>
    )
  }

  const tableTheads = [
    {
      id: 0,
      label: 'Staking Pool',
      textInfo: 'Details registered in registry CF'
    },
    {
      id: 1,
      label: 'ROA',
      textInfo: 'Estimated ROA (Return of ADA, annualised) based on lifetime staking results'
    },
    {
      id: 2,
      label: 'Share / Pool Size',
      textInfo: 'Total share of all ada being staked in pool / Entire Supply'
    },
    {
      id: 3,
      label: 'Costs',
      textInfo: 'Tax ratio + Fix'
    },
    {
      id: 4,
      label: 'Pledge',
      textInfo: 'Available Pledge'
    },
    {
      id: 5,
      label: 'Blocks',
      textInfo: 'Minted blocks in actual epoch + block trend; Background = today estimated performance'
    },
  ]
  return (
    <TableContent>
      <Table>
        <thead>
          <tr role="row">
            {
              tableTheads.map(({ label, textInfo, id }, ) =>
                <th key={`col-${id}`} scope="col" className={`col-${id}`}>
                  <TooltipClassic
                    label={label}
                    textInfo={textInfo}
                  />
                </th>
              )
            }
            <th className="col-last" />
          </tr>
        </thead>
        <tbody>
          {data != null &&
            data.filter(x => x != null).map(pool => (
              <tr role="row" key={pool.id}>
                <td>
                  <StakingPoolCardClassic
                    id={pool.id}
                    avatar={pool.pool_pic}
                    tickerName={pool.db_ticker}
                    name={pool.db_name}
                    links={pool.handles}
                    fullname={pool.fullname}
                  />
                </td>
                <td>
                  <CardRoaClassic
                    roa={pool.roa}
                  />
                </td>
                <td>
                  <PoolSizeCardClassic
                    percentage={pool.saturation}
                    value={formatBigNumber(pool.total_stake)}
                  />
                </td>
                <td>
                  <CostsCardClassic
                    value={formatCostLabel(Number(pool.tax_ratio), pool.tax_fix)}
                  />
                </td>
                <td>
                  <PledgeCardClassic value={pool.pledge} real={pool.pledge_real} />
                </td>
                <td>{pool.blocks_epoch}</td>
                <td>
                  <Button
                    disabled={selectedIdPools != null && selectedIdPools.indexOf(pool.id) > -1}
                    onClick={() => (
                      delegateFunction({
                        stakepoolName: pool.db_name ?? pool.id,
                        stakepoolTotalStake: pool.total_stake,
                        isAlreadySaturated: pool.saturation >= 1,
                        id: pool.id },
                      totalAda)
                    )}
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

export default DesktopTable;
