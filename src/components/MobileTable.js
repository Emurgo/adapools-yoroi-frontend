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
import AverageCostCard from './AverageCostCard';

const CardMobile = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  padding: 11px 16px;
`;
const WrapperContent = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  @media (max-width: 1125px) {
    align-items: flex-start;
  }

  .label {
    color: #6b7384;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .item {
    flex: 1;
  }
  .cost-wrapper {
    display: flex;
    flex-direction: column;
  }
`;
type Props = {|
  data: Pool,
  delegateFunction: Function,
  +status: 'idle' | 'pending' | 'resolved' | 'rejected',
  selectedIdPools: Array<string>,
|};
function MobileTable({ data, delegateFunction, status, selectedIdPools }: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data && Object.entries(data).length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>Ups.. We havent found any data</h1>;
  }

  if(isLoading) {
    return <h1 style={{ fontWeight: 400 }}>Loading...</h1>;
  }

  if(isRejected) {
    return (
      <h1>Oops! something wrong happened. Try again!</h1>
    )
  }

  return (
    <>
      {data &&
        (Object.entries(data): any).map(([, value]) => (
          <CardMobile key={value.id}>
            <StakingPoolCard id={value.id} avatar={value.pool_pic} fullname={value.fullname} />
            <WrapperContent style={{ display: 'flex' }}>
              <div className="item">
                <div className="label">Pool Size</div>
                <PoolSizeCard
                  percentage={roundOneDecimal(value.saturation)}
                  value={formatBigNumber(value.total_stake)}
                />
              </div>
              <div className="item">
                <div className="label">Costs</div>
                <div className="cost-wrapper">
                  <AverageCostCard
                    percentage={roundTwoDecimal(value.tax_computed)}
                  />
                  <CostsCard
                    percentage={roundTwoDecimal(value.tax_computed)}
                    value={formatCostLabel(value.tax_ratio, value.tax_fix)}
                  />
                </div>
              </div>
              <div className="item">
                <div className="label">Pledge</div>
                <PledgeCard value={value.pledge} />
              </div>
            </WrapperContent>
            <div>
              <Button
                disabled={selectedIdPools && selectedIdPools.indexOf(value.id) > -1}
                onClick={() => delegateFunction(value.id)}
              >
                Delegate
              </Button>
            </div>
          </CardMobile>
        ))}
    </>
  );
}

export default MobileTable;
