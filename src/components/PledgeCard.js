import React from "react";
import styled from "styled-components";

const Card = styled.div`
  display: inline-block;
  font-size: 14px;
  border-radius: 8px;
  background-color: #fce4bc;
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
function PledgeCard({ value }) {
  return (
    <Card>
      <i className="fas fa-check"></i>
      <span>{value}</span>
    </Card>
  );
}

export default PledgeCard;
