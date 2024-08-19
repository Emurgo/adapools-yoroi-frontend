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
import { PoolSaturationTagRevamp } from './PoolSaturationTag';
import { ValueRevamp } from './DesktopTableRevamp';
import NoStakePoolsFound from './NoStakePoolsFound';

const CardMobile = styled('div')(({ isDark }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  backgroundColor: isDark ? '#15171F' : '#ffffff',
  boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.06)',
  marginBottom: '24px',
  padding: '11px 16px',
}));

const WrapperContent = styled('div')(({ isDark }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '15px 0',
  '@media (max-width: 1125px)': {
    alignItems: 'flex-start',
  },
  '.label': {
    color: isDark ? '#E1E6F5' : '#6b7384',
    fontSize: '14px',
    letterSpacing: 0,
    lineHeight: '22px',
    marginBottom: '8px',
  },
  '.item': {
    flex: 1,
    '@media (max-width: 1125px)': {
      alignItems: 'flex-start',
    },
  },
  '.cost-wrapper': {
    display: 'flex',
    flexDirection: 'column',
  },
}));

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
  isDark: ?boolean,
|};

function MobileTableRevamp({
  data,
  delegateFunction,
  status,
  selectedIdPools,
  totalAda,
  isDark,
}: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data != null && data.length <= 0) {
    return <NoStakePoolsFound />;
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
            <CardMobile key={pool.id} isDark={isDark}>
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
                  <CardRoaRevamp roa={pool.roa} isDark={!!isDark} />
                </div>
                <div className="item">
                  <div className="label">Pool size</div>
                  <ValueRevamp isDark={!!isDark}>{formatBigNumber(pool.total_stake)}</ValueRevamp>
                </div>
                <div className="item">
                  <div className="label">Saturation</div>
                  <PoolSaturationTagRevamp value={pool.saturation} isDark={!!isDark} />
                </div>
              </WrapperContent>
              <WrapperContent style={{ display: 'flex' }}>
                <div className="item">
                  <div className="label">Costs</div>
                  <div className="cost-wrapper">
                    <CostsCardRevamp
                      value={formatCostLabel(Number(pool.tax_ratio), pool.tax_fix)}
                      isDark={!!isDark}
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
