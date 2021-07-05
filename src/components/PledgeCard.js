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
  let backgroundColor = null;
  const realValue = Number(value) / 1000000; // divided in 1,000,000 to convert from Lovelace to ADA

  switch(true){
  case realValue >= 250000:
    backgroundColor = '#BFC8FF';
    break;
  case realValue < 200000 && realValue >= 100000:
    backgroundColor = '#D6DDF5';
    break;
  case realValue < 100000 && realValue >= 500000:
    backgroundColor = '#FBF6B7';
    break;
  case realValue < 500000 && realValue >= 20000:
    backgroundColor = '#FCE4BC';
    break;
  case realValue < 20000 && realValue >= 0:
    backgroundColor = '#FFDCE5';
    break;
  default:
    backgroundColor = 'none';
    break;
  }
  
  return (
    <Card background={backgroundColor}>
      { real != null && (Number(real) >= Number(value)) && <i className="fas fa-check" /> }
      <span>{formatBigNumber(value.toString())}</span>
    </Card>
  );
}

export default PledgeCard;
