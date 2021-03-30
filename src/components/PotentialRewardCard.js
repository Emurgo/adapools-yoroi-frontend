// @flow
import * as React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  @media (max-width: 1125px) {
    text-align: left;
  }
`;
const AdaValueReward = styled.p`
  color: #242838;
  margin-bottom: 4px;
`;
const PercetangeReward = styled.p`
  color: #6b7384;
  font-size: 14px;
`;

type Props = {|
  +value: string,
  +percentage: string,
|};

const PotentialRewardCard = ({ value, percentage }: Props): Node => {
  return (
    <Wrapper>
      <AdaValueReward>{value} ADA</AdaValueReward>
      <PercetangeReward>{percentage}%</PercetangeReward>
    </Wrapper>
  );
};

export default PotentialRewardCard;
