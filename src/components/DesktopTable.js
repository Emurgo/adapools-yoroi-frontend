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
  thead {
    border-bottom: 3px solid rgba(56, 57, 61, 0.2);
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
|};
function DesktopTable({ data }: Props) {
  if (data && Object.entries(data).length >= 0) {
    return <h1 style={{ fontWeight: 400 }}>Ups.. We havent found any data</h1>;
  }

  return (
    <TableContent>
      <Table>
        <thead>
          <tr>
            <th>Staking Pool</th>
            <th>Pool Size</th>
            <th>Costs</th>
            <th>Pledge</th>
            <th>Blocks</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data &&
            (Object.entries(data): any).map(([, value]) => (
              <tr key={value.id}>
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
                  <PledgeCard value={formatBigNumber(value.pledge)} />
                </td>
                <td>_{value.blocks_epoch}</td>
                <td>
                  <Button>Delegate</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </TableContent>
  );
}

export default DesktopTable;
