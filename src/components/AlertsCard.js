// @flow
import * as React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import stakeSaturatedIcon from '../assets/stakepool_saturated.svg';
import stakeNewIcon from '../assets/stakepool_new.svg';
import stakeRetiredIcon from '../assets/stakepool_retired.svg';
import stakeChangingIcon from '../assets/stakepool_parameter-changing.svg';

type Props = {|
  +isSaturated: boolean,
  +isRetiring: boolean,
  +isNew: boolean,
  +isChanging: boolean,
|};
const AlertContainer = styled.div`
  @media (max-width: 1125px) {
    display: flex;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 4px;
  img {
    width: 18px;
    height: 18px;
  }
  @media (max-width: 1125px) {
    margin-right: 24px;
  }
`;
const Label = styled.p`
  color: #242838;
  font-family: Rubik;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 22px;
  text-align: right;
  margin-right: 6px;
`;

const AlertsCard = ({ isSaturated, isRetiring, isNew, isChanging }: Props): Node => {
  const isEmpty = !isSaturated && !isRetiring && !isNew && !isChanging;
  return (
    <AlertContainer>
      {isSaturated ? (
        <Wrapper>
          <Label>Saturated</Label>
          <img src={stakeSaturatedIcon} alt="stakepool saturated" />
        </Wrapper>
      ) : null}
      {isRetiring ? (
        <Wrapper>
          <Label>Retiring</Label>
          <img src={stakeRetiredIcon} alt="stakepool retired" />
        </Wrapper>
      ) : null}
      {isNew ? (
        <Wrapper>
          <Label>New</Label>
          <img src={stakeNewIcon} alt="stakepool new" />
        </Wrapper>
      ) : null}
      {isChanging ? (
        <Wrapper>
          <Label>Parameters changing</Label>
          <img src={stakeChangingIcon} alt="stakepool parameters changing" />
        </Wrapper>
      ) : null}
      {isEmpty ? <p> - </p> : null}
    </AlertContainer>
  );
};

export default AlertsCard;
