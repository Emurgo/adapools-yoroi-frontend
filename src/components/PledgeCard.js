// @flow

import React from 'react';
import styled from 'styled-components';
import type { Node } from 'react';
import { formatBigNumber } from '../utils/utils';

const Card = styled.div`
  display: inline-block;
  font-size: 14px;
  line-height: 22px;
  border-radius: 8px;
  background-color: ${(props) => props.background || '#fff'};
  color: #2b2c32;
  padding: 2px 8px;
  @media (max-width: 1125px) {
    justify-content: center;
  }
  i {
    margin-right: 4px;
    font-size: 10px;
    display: inline;
  }
`;

type Props = {|
  value: string | number,
  real?: string | number,
|};

function PledgeCard({ value, real }: Props): Node {
  
  // to fix according to ranges
  let backgroundColor = 'none';
  const realValue = Number(value) / 1_000_000; // divided in 1,000,000 to convert from Lovelace to ADA

  if (realValue >= 250_000) {
    backgroundColor = '#BFC8FF';
  } else if (realValue >= 100_000) {
    backgroundColor = '#D6DDF5';
  } else if (realValue >= 50_000) {
    backgroundColor = '#FBF6B7';
  } else if (realValue >= 20_000) {
    backgroundColor = '#FCE4BC';
  } else if (realValue > 0) {
    backgroundColor = '#FFDCE5';
  }
  
  return (
    <Card background={backgroundColor}>
      { real != null && (Number(real) >= Number(value)) && <i className="fas fa-check" /> }
      <span>{formatBigNumber(value.toString())}</span>
    </Card>
  );
}

export default PledgeCard;
