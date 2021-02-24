// @flow
import React from 'react';
import styled from 'styled-components';
import type { PoolDaedalusSimple } from '../../API/api';

import StakingPoolCard from '../StakingPoolCard';
import { roundTwoDecimal } from '../../utils/utils';
import Button from '../common/Button';
import type { QueryState } from '../../utils/types';
import type { DelegationProps } from '../../containers/HomeContainer';
import PotentialRewardCard from '../PotentialRewardCard';
import AlertsCard from '../AlertsCard';
import Loader from '../common/Loader';

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
  text-align: left;
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
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
`;
const AlertContent = styled.div`
  margin-top: 10px;
  margin-bottom: 24px;
  .label {
    color: #6b7384;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 22px;
    margin-bottom: 8px;
    text-align: center;
  }
  .alerts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      margin: 0;
    }
  }
`;
const RankWrapper = styled.div`
  margin-right: 20px;
  text-align: center;
  .label {
    color: #6b7384;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 22px;
  }
  .value {
    display: flex;
    flex-wrap: wrap;
  }
`;
type Props = {|
  data: ?Array<PoolDaedalusSimple>,
  delegateFunction: (DelegationProps, ?number) => void,
  +status: QueryState,
  selectedIdPools: ?Array<string>,
  totalAda: ?number,
|};

function DaedalusSimpleMobileTable({
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

  return (
    <>
      {data &&
        data.map((pool, idx) => (
          <CardMobile key={pool.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RankWrapper>
                <div className="label">Rank</div>
                <p>{idx + 1}</p>
              </RankWrapper>
              <StakingPoolCard
                id={pool.id}
                avatar={pool.pool_pic}
                tickerName={pool.db_ticker}
                name={pool.db_name}
                links={pool.handles}
                fullname={pool.fullname}
              />
            </div>

            <WrapperContent style={{ display: 'flex' }}>
              <div className="item">
                <div className="label">Potential Reward Per Epoch</div>
                <PotentialRewardCard
                  value={pool.potential_reward_epoch}
                  percentage={roundTwoDecimal(pool.potential_reward_epoch_computed)}
                />
              </div>
              <div className="item">
                <div className="label">Potential Reward Per Month</div>
                <PotentialRewardCard
                  value={pool.potential_reward_month}
                  percentage={roundTwoDecimal(pool.potential_reward_month_computed)}
                />
              </div>
              <div className="item">
                <div className="label">Potential Reward Per Year</div>
                <PotentialRewardCard
                  value={pool.potential_reward_year}
                  percentage={roundTwoDecimal(pool.potential_reward_year_computed)}
                />
              </div>
            </WrapperContent>
            <AlertContent>
              <div className="label">Alerts</div>
              <div className="alerts">
                <AlertsCard
                  isSaturated={idx !== 0 && idx % 6 === 0}
                  isRetiring={idx % 7 === 0}
                  isNew={idx !== 0 && idx % 3 === 0}
                  isChanging={idx % 9 === 0}
                />
              </div>
            </AlertContent>
            <div>
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
            </div>
          </CardMobile>
        ))}
    </>
  );
}

export default DaedalusSimpleMobileTable;
