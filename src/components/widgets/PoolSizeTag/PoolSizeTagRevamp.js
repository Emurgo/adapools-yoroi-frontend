// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';
import { roundOneDecimal } from '../../../utils/utils';

type Props = {|
  +value: number,
|};

const Tag = styled.div`
  padding: 2px 8px;
  background: ${(props) => props.background};
  border-radius: 8px;
  color: #2b2c32;
  margin-right: 10px;
  display: flex;
  align-items: center;
  .value {
    margin-left: 6px;
    color: #2b2c32;
    font-size: 16px;
    line-height: 22px;
  }
  .piechart {
    min-width: 17px;
    height: 17px;
  }
  @media (max-width: 1125px) {
    margin-bottom: 8px;
  }
`;

function PoolSizeTagRevamp({ value }: Props): Node {
  const totalValue = 1;
  function formatArray(percent) {
    return [
      {
        value: percent,
        color: '#DBE0E9',
      },
      {
        value: totalValue - percent,
        color: '#A7AFC0',
      },
    ];
  }
  return (
    <Tag>
      <div className="piechart">
        <PieChart totalValue={totalValue} data={formatArray(value)} />
      </div>
      <div className="value">{roundOneDecimal(value)}%</div>
    </Tag>
  );
}

export default PoolSizeTagRevamp;
