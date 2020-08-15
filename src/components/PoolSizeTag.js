import React from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';

const Tag = styled.div`
  padding: 2px 8px;
  background: ${(props) => props.background};
  border-radius: 8px;
  color: #2b2c32;
  margin-right: 23px;
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
    @media (min-width:1024px) and (max-width: 1200px) {
      margin: 0;
    }
  }
  @media (min-width:1024px) and (max-width: 1200px) {
    margin: 0;
    margin-top: 4px;
  }
  @media (max-width: 1023px) {
    margin-bottom: 8px;
  }
  
`;

type Props = {|
  +value: number,
|};

function PoolSizeTag({ value }: Props) {
  const totalValue = 0.7
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
  case value >= 0.6:
    backgroundColor = '#FFC3D3';
    break;
  case value < 0.6 && value >= 0.5:
    backgroundColor = '#FFDCE5';
    break;
  case value < 0.5 && value >= 0.4:
    backgroundColor = '#FCE4BC';
    break;
  case value < 0.4 && value >= 0.3:
    backgroundColor = '#FBF6B6';
    break;
  case value < 0.3 && value >= 0.2:
    backgroundColor = '#DDFBB6';
    break;
  case value < 0.2 && value >= 0:
    backgroundColor = '#C9EDE5';
    break;
  default:
    backgroundColor = 'none';
    break;
  }

  return (
    <Tag background={backgroundColor}>
      <div className="piechart">
        <PieChart totalValue={totalValue} data={formatArray(value)} />
      </div>
      <div className="value">{value}%</div>
    </Tag>
  )
}

export default PoolSizeTag;
