import React from "react";
import styled from "styled-components";

const Card = styled.div`
  /* opacity: 0.3; */
  display: inline-block;
  /* justify-content: flex-end; */
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
function PledgeCard() {
  return (
    <Card>
      <i class="fas fa-check"></i>
      <span>75.00k</span>
    </Card>
  );
}

export default PledgeCard;
