import React from "react";
import styled from "styled-components";
import { roundOneDecimal } from "../utils/utils";

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
    margin-right: 9px;
    @media (max-width: 1023px) {
      margin-bottom: 9px;
    }
  }
  .value {
    color: #242838;
    font-size: 14px;
  }
`;
function CostsCard({ percentage, value = 0 }) {
  return (
    <Card>
      <div className="tag">{roundOneDecimal(percentage)}%</div>
      <p className="value">({"2.56 M"})</p>
    </Card>
  );
}

export default CostsCard;
