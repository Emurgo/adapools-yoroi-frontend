// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import Button from './common/Button';
import type { DelegationProps } from '../containers/HomeContainer';

const Wrapper = styled.div`
  .section {
    margin-bottom: 40px;
  }
  .title {
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;
    color: #FF1351;
  }
  .description {
    margin-top: 20px;
    color: #2B2C32;
    font-size: 14px;
    line-height: 22px;
  }
  .upper-button {
  }
  .bottom-button {
    margin-top: 20px;
    background-color: #FF1351;
    border: 2px solid #ff1351;
    color: #fff;
  }
`;

type Props = {|
    delegation: {|...DelegationProps, totalAda: ?number|},
    onSuccess: (id: string) => void,
    close: () => void
|}

function SaturatedPoolAlert({ delegation, onSuccess, close }: Props): Node {
  const text = delegation.isAlreadySaturated ?
    `${delegation.stakepoolName} is already saturated. If you continue, you will get less than the expected rewards.`
    :
    `${delegation.stakepoolName} will be saturated after your delegation. If you continue, you will get less than the expected rewards.`

  const poolShare = Number(delegation.stakepoolTotalStake) / 1000000; // divided in 1,000,000 to convert from Lovelace to ADA
  const yourAda = delegation.totalAda == null ? '' : `Your ADA: ${new Intl.NumberFormat().format(delegation.totalAda)}`;
  const yourAdaNotEmpty = yourAda !== '';

  return (
    <Wrapper>
      <h3 className="title">Saturated Stakepool Warning</h3>
      <div className="section">
        <h3 className="description">{text}</h3>
        {
          yourAdaNotEmpty &&
          <h3 className="description">{yourAda} ADA</h3>
        }
        {/* $FlowFixMe:  */}
        <h3 className="description">Stakepool Size: {new Intl.NumberFormat().format(poolShare.toFixed(0))} ADA</h3>
      </div>
      <Button onClick={() => {onSuccess(delegation.id); close()}} disabled={false} className="upper-button">
        Delegate
      </Button>
      <Button disabled={false} onClick={() => close()} className="bottom-button">
        Cancel
      </Button>
    </Wrapper>
  );
}

export default SaturatedPoolAlert;
