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
import type { QueryState } from '../../utils/types';
import type { DelegationProps } from '../../containers/HomeClassic';

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
  data: ?Array<Pool>,
  delegateFunction: (DelegationProps, ?number) => void,
  +status: QueryState,
  selectedIdPools: ?Array<string>,
  totalAda: ?number,
|};

function MobileTable({ data, delegateFunction, status, selectedIdPools, totalAda }: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data != null && data.length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>No results found.</h1>;
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
        data.filter(x => x != null).map(pool => (
          <CardMobile key={pool.id}>
            <StakingPoolCardClassic
              id={pool.id}
              avatar={pool.pool_pic}
              tickerName={pool.db_ticker}
              name={pool.db_name}
              links={pool.handles}
              fullname={pool.fullname}
            />
            <CardRoaClassic
              roa={pool.roa}
              description='Estimated ROA: '
            />

            <WrapperContent style={{ display: 'flex' }}>
              <div className="item">
                <div className="label">Pool Size</div>
                <PoolSizeCardClassic
                  percentage={pool.saturation}
                  value={formatBigNumber(pool.total_stake)}
                />
              </div>
              <div className="item">
                <div className="label">Costs</div>
                <div className="cost-wrapper">
                  <CostsCardClassic
                    value={formatCostLabel(Number(pool.tax_ratio), pool.tax_fix)}
                  />
                </div>
              </div>
              <div className="item">
                <div className="label">Pledge</div>
                <PledgeCardClassic value={pool.pledge} real={pool.pledge_real} />
              </div>
            </WrapperContent>
            <div>
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
            </div>
          </CardMobile>
        ))}
    </>
  );
}

export default MobileTable;
