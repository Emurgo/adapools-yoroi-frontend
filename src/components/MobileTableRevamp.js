// @flow
import React from 'react';
import styled from 'styled-components';
import type { Pool } from '../API/api';

import { CostsCardRevamp } from './CostsCard';
import { PledgeCardRevamp } from './PledgeCard';
import { CardRoaRevamp } from './CardRoa';
import { formatBigNumber, formatCostLabel } from '../utils/utils';
import { ButtonRevamp } from './common/Button';
import type { QueryState } from '../utils/types';
import type { DelegationProps } from '../containers/Home';
import StakingPoolCardRevamp from './StakingPoolCardRevamp';
import { PoolSizeTagRevamp } from './PoolSizeTag';
import { ValueRevamp } from './DesktopTableRevamp';

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
    @media (max-width: 1125px) {
      align-items: flex-start;
    }
  }
  .cost-wrapper {
    display: flex;
    flex-direction: column;
  }
`;

const Message = styled.h1`
  font-weight: 400;
  padding: 20px 0px;
`;

type Props = {|
  data: ?Array<Pool>,
  delegateFunction: (DelegationProps, ?number) => void,
  +status: QueryState,
  selectedIdPools: ?Array<string>,
  totalAda: ?number,
|};

function MobileTableRevamp({
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
    return <Message>No results found.</Message>;
  }

  if (isLoading) {
    return <Message>Loading...</Message>;
  }

  if (isRejected) {
    return <Message>Oops! something wrong happened. Try again!</Message>;
  }

  return (
    <>
      {data &&
        data
          .filter((x) => x != null)
          .map((pool) => (
            <CardMobile key={pool.id}>
              <StakingPoolCardRevamp
                id={pool.id}
                bech={pool.id_bech}
                avatar={pool.pool_pic}
                tickerName={pool.db_ticker}
                name={pool.db_name}
                links={pool.handles}
                fullname={pool.fullname}
              />

              <WrapperContent style={{ display: 'flex' }}>
                <div className="item">
                  <div className="label">ROA 30d</div>
                  <CardRoaRevamp roa={pool.roa} />
                </div>
                <div className="item">
                  <div className="label">Pool size</div>
                  <ValueRevamp>{formatBigNumber(pool.total_stake)}</ValueRevamp>
                </div>
                <div className="item">
                  <div className="label">Share</div>
                  <PoolSizeTagRevamp value={pool.saturation} />
                </div>
              </WrapperContent>
              <WrapperContent style={{ display: 'flex' }}>
                <div className="item">
                  <div className="label">Costs</div>
                  <div className="cost-wrapper">
                    <CostsCardRevamp
                      value={formatCostLabel(Number(pool.tax_ratio), pool.tax_fix)}
                    />
                  </div>
                </div>
                <div className="item">
                  <div className="label">Pledge</div>
                  <PledgeCardRevamp value={pool.pledge} real={pool.pledge_real} />
                </div>
                <div className="item" />
              </WrapperContent>
              <div>
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
              </div>
            </CardMobile>
          ))}
    </>
  );
}

export default MobileTableRevamp;
