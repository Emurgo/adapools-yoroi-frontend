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
  @media (max-width: 1023px) {
    justify-content: center;
  }
  i {
    margin-right: 4px;
    font-size: 10px;
    display: inline;
  }
`;

type Props = {|
  value: string,
|};

function PledgeCard({ value }: Props): Node {
  
  // to fix according to ranges
  let backgroundColor = null;
  const realValue = Number(value) / 1000000; // divided in 1,000,000 to convert from Lovelace to ADA

  switch(true){
  case realValue >= 515e3:
    backgroundColor = 'hsl(240,95%,95%)';
    break;
  case realValue < 500e3 && realValue > 400e3:
    backgroundColor = 'hsl(189.34735165297,95%,95%)';
    break;
  case realValue <= 400e3 && realValue > 200e3:
    backgroundColor = 'hsl(133.65695410798,95%,95%)';
    break;
  case realValue <= 200e3 && realValue > 100e3:
    backgroundColor = 'hsl(49.453073019951,95%,95%)';
    break;
  case realValue <= 100e3 && realValue > 50e3:
    backgroundColor = 'hsl(22.276159017996,95%,95%)';
    break;
  case realValue <= 50e3 && realValue > 10e3:
    backgroundColor = 'hsl(4.4552318035992,95%,95%)';
    break;
  default:
    backgroundColor = 'hsl(0.44552318035993,95%,95%)';
    break;
  }
  
  return (
    <Card background={backgroundColor}>
      <i className="fas fa-check" />
      <span>{formatBigNumber(value)}</span>
    </Card>
  );
}

export default PledgeCard;
