// @flow
import React from 'react';
import styled from 'styled-components';
import type { Pool } from '../API/api';
import StakingPoolCard from './StakingPoolCard';
import PoolSizeCard from './PoolSizeCard';
import CostsCard from './CostsCard';
import PledgeCard from './PledgeCard';
import CardRoa from './CardRoa';
import { roundTwoDecimal, formatBigNumber, roundOneDecimal, formatCostLabel } from '../utils/utils';
import Button from './common/Button';
import Tooltip from './common/Tooltip';
import AverageCostCard from './AverageCostCard';

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
  data: Pool,
  delegateFunction: Function,
  +status: 'idle' | 'pending' | 'resolved' | 'rejected',
  selectedIdPools: Array<string>,
|};

function DesktopTable({ data, delegateFunction, status, selectedIdPools }: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';
  
  if (isResolved && data && Object.entries(data).length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>Ups.. We haven’t found any data</h1>;
  }

  if(isLoading) {
    return <h1 style={{ fontWeight: 400 }}>Loading..</h1>;
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
      label: 'ROA 30d',
      textInfo: 'Estimated ROA (Return of ADA, annualised) based on staking result from last 30 days'
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
      label: 'Average Cost',
      textInfo: 'Real average fees'
    },
    {
      id: 5,
      label: 'Pledge',
      textInfo: 'Available Pledge'
    },
    {
      id: 6,
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
                  <Tooltip
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
          {data &&
            (Object.entries(data): any).map(([, value]) => (
              <tr role="row" key={value.id}>
                <td>
                  <StakingPoolCard
                    id={value.id}
                    avatar={value.pool_pic}
                    tickerName={value.db_ticker}
                    name={value.db_name}
                    links={value.handles}
                    fullname={value.fullname}
                  />
                </td>
                <td>
                  <CardRoa
                    roa={value.roa}
                    data={value.hist_roa}
                  />
                </td>
                <td>
                  <PoolSizeCard
                    percentage={roundOneDecimal(value.saturation)}
                    value={formatBigNumber(value.total_stake)}
                  />
                </td>
                <td>
                  <CostsCard
                    percentage={roundTwoDecimal(value.tax_computed)}
                    value={formatCostLabel(value.tax_ratio, value.tax_fix)}
                  />
                </td>
                <td>
                  <AverageCostCard
                    percentage={roundTwoDecimal(value.tax_computed)}
                  />
                </td>
                <td>
                  <PledgeCard value={value.pledge} real={value.pledge_real} />
                </td>
                <td>{value.blocks_epoch}</td>
                <td>
                  <Button 
                    disabled={selectedIdPools && selectedIdPools.indexOf(value.id) > -1}
                    onClick={() => delegateFunction(value.id)}
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
