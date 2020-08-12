// @flow

import React from "react";
import styled from "styled-components";
import { PieChart } from "react-minimal-pie-chart";
import type { Node } from "react";

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: flex-start;
  }
  .tag {
    padding: 2px 8px;
    background: #c9ede5;
    border-radius: 8px;
    color: #2b2c32;
    margin-right: 23px;
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
  }
  .value {
    color: #242838;
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
        color: "#FE1351",
      },
      {
        value: 1 - percent,
        color: "#17D1AA",
      },
    ];
  }

  return (
    <Card>
      <div className="tag">
        <div className="piechart">
          <PieChart totalValue={1} data={formatArray(percentage)}></PieChart>
        </div>
        <div>{percentage}%</div>
      </div>
      <p className="value">{value} ₳</p>
    </Card>
  );
}

export default PoolSizeCard;
