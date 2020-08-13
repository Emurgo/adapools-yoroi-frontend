// @flow
import React from 'react';
import styled from 'styled-components';
import type { Pool } from '../API/api';
import StakingPoolCard from './StakingPoolCard';
import PoolSizeCard from './PoolSizeCard';
import CostsCard from './CostsCard';
import PledgeCard from './PledgeCard';
import { roundTwoDecimal, formatBigNumber, roundOneDecimal, formatCostLabel } from '../utils/utils';
import Button from './common/Button';

const TableContent = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-spacing: 0 0.8rem;
  position: relative;
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
    }
  }
  tbody {
    tr {
      border-bottom: 2px solid #dee2ea;
    }
    td {
      padding-right: 20px;
      &:not(:first-child) {
        text-align: right;
      }
    }
  }
`;

type Props = {|
  data: Pool,
  delegateFunction: Function,
  +status: 'idle' | 'pending' | 'resolved' | 'rejected',
|};
function DesktopTable({ data, delegateFunction, status }: Props) {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';
  
  if (isResolved && data && Object.entries(data).length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>Ups.. We havent found any data</h1>;
  }

  if(isLoading) {
    return <h1 style={{ fontWeight: 400 }}>Loading..</h1>;
  }

  if(isRejected) {
    return (
      <h1>Ups! something wrong happened. Try again!</h1>
    )
  }
  return (
    <TableContent>
      <Table>
        <thead>
          <tr role="row">
            <th scope="col">Staking Pool</th>
            <th scope="col">Pool Size</th>
            <th scope="col">Costs</th>
            <th scope="col">Pledge</th>
            <th scope="col">Blocks</th>
            <th scope="col" />
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
                    fullname={value.fullname}
                  />
                </td>
                <td>
                  <PoolSizeCard
                    percentage={roundOneDecimal(value.total_size)}
                    value={formatBigNumber(value.total_stake)}
                  />
                </td>
                <td>
                  <CostsCard
                    percentage={roundTwoDecimal(value.tax_computed)}
                    value={formatCostLabel(value.tax_computed, value.tax_fix)}
                  />
                </td>
                <td>
                  <PledgeCard value={value.pledge} />
                </td>
                <td>_{value.blocks_epoch}</td>
                <td>
                  <Button onClick={() => delegateFunction(value.id)}>Delegate</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </TableContent>
  );
}

export default DesktopTable;
