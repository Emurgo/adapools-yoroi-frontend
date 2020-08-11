import React from "react";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
    @media (max-width: 1023px) {
      margin-bottom: 8px;
    }
  }
  .value {
    color: #242838;
    font-size: 14px;
  }
`;
function PoolSizeCard({ percentage, size }) {
  function roundOneDecimal(number) {
    return Math.round(number * 10) / 10;
  }

  return (
    <Card>
      <div className="tag">{roundOneDecimal(percentage)}%</div>
      {/* <p className="value">{formatValueSize(size)} ₳</p> */}
      <p className="value">{"2.56 M"} ₳</p>
    </Card>
  );
}

export default PoolSizeCard;
