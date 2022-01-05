// @flow

import React from 'react';
import styled from 'styled-components';
import type { Node } from 'react';
import PoolSizeTagClassic from '../PoolSizeTag/PoolSizeTagClassic';

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 22px;

  @media (max-width: 1125px) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (min-width:1125px) and (max-width: 1200px) {
    flex-direction: column-reverse;
    align-items: center;
  }
  .value {
    color: #242838;
    line-height: 22px;
  }
`;

type Props = {|
  percentage: number,
  value: string,
|};

function PoolSizeCardClassic({ percentage, value }: Props): Node {
  return (
    <Card>
      <PoolSizeTagClassic value={percentage} />
      <p className="value">{value} ₳</p>
    </Card>
  );
}

export default PoolSizeCardClassic;
