// @flow

import React from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';
import type { Node } from 'react';

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 22px;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: flex-start;
  }
  .value {
    color: #242838;
    line-height: 22px;
  }
`;
const Tag = styled.div`
  padding: 2px 8px;
  background: ${(props) => props.background};
  border-radius: 8px;
  color: #2b2c32;
  margin-right: 10px;
  display: flex;
  align-items: center;
  .piechart {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  @media (max-width: 1023px) {
    margin-bottom: 8px;
  }
`;

type Props = {|
  percentage: number,
  value: number,
|};

function PoolSizeCard({ percentage, value }: Props): Node {
  function formatArray(percent) {
    return [
      {
        value: percent,
        color: '#FE1351',
      },
      {
        value: 1 - percent,
        color: '#17D1AA',
      },
    ];
  }

  let backgroundColor = null;

  switch (true) {
  case percentage >= 0.5:
    backgroundColor = 'hsl(0,80%,80%)';
    break;
  case percentage < 0.5 && percentage > 0.4:
    backgroundColor = 'hsl(38.527896145612,80%,80%)';
    break;
  case percentage <= 0.4 && percentage > 0.3:
    backgroundColor = 'hsl(59.384792622058,80%,80%)';
    break;
  case percentage <= 0.3 && percentage > 0.2:
    backgroundColor = 'hsl(67.359072574924,80%,80%)';
    break;
  case percentage <= 0.2 && percentage > 0:
    backgroundColor = 'hsl(111.21169896469,80%,80%)';
    break;
  default:
    backgroundColor = 'hsl(111.21169896469,80%,80%)';
    break;
  }

  return (
    <Card>
      <Tag background={backgroundColor}>
        <div className="piechart">
          <PieChart totalValue={1} data={formatArray(percentage)} />
        </div>
        <div>{percentage}%</div>
      </Tag>
      <p className="value">{value} ₳</p>
    </Card>
  );
}

export default PoolSizeCard;
