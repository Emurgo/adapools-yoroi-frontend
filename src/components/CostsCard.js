// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

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
type Props = {|
  percentage: number,
  value: number,
|};
function CostsCard({ percentage, value }: Props): Node {
  return (
    <Card>
      <div className="tag">{percentage}%</div>
      <p className="value">({value})</p>
    </Card>
  );
}

export default CostsCard;
