// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';
import { roundOneDecimal, } from '../utils/utils';

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
    color: #2B2C32;
    font-size: 14px;
    line-height: 22px;
  }
  .piechart {
    width: 15px;
    height: 15px;
    margin-right: 5px;
    @media (min-width:1125px) and (max-width: 1200px) {
      margin: 0;
    }
  }
  @media (min-width:1125px) and (max-width: 1200px) {
    margin: 0;
    margin-top: 4px;
  }
  @media (max-width: 1125px) {
    margin-bottom: 8px;
  }

`;

type Props = {|
  +value: number,
|};

function PoolSizeTag({ value }: Props): Node {
  const totalValue = 1
  function formatArray(percent) {
    return [
      {
        value: percent,
        color: '#FE1351',
      },
      {
        value: totalValue - percent,
        color: '#17D1AA',
      },
    ];
  }

  let backgroundColor = null;

  switch (true) {
  case value > 0.9:
    backgroundColor = '#FFC3D3';
    break;
  case value > 0.8:
    backgroundColor = '#FCE4BC';
    break;
  case value > 0.7:
    backgroundColor = '#FBF6B6';
    break;
  case value > 0.6:
    backgroundColor = '#DDFBB6';
    break;
  default:
    backgroundColor = '#C9EDE5';
    break;
  }

  return (
    <Tag background={backgroundColor}>
      <div className="piechart">
        <PieChart totalValue={totalValue} data={formatArray(value)} />
      </div>
      <div className="value">{roundOneDecimal(value)}%</div>
    </Tag>
  )
}

const TagRevamp = styled.div`
  padding: 2px 0;
  background: ${(props) => props.background};
  border-radius: 8px;
  color: #2b2c32;
  margin-right: 10px;
  display: flex;
  align-items: center;
  .value {
    margin-left: 6px;
    color: #2B2C32;
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
    <TagRevamp>
      <div className="piechart">
        <PieChart totalValue={totalValue} data={formatArray(value)} />
      </div>
      <div className="value">{roundOneDecimal(value)}%</div>
    </TagRevamp>
  );
}

export default PoolSizeTag;
export { PoolSizeTagRevamp };