// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  align-items: right;
  float: right;
  justify-content: space-between;
  font-size: 14px;
  line-height: 22px;
  @media (max-width: 1125px) {
    flex-direction: column;
    align-items: flex-start;
  }
  .tag {
    padding: 2px 8px;
    font-size:0.9em;
    border-radius: 8px;
    color: #2b2c32;
    @media (max-width: 1125px) {
      margin-bottom: 9px;
    }
  }
`;
type Props = {|
  +percentage: string,
|};
function AverageCostCard({ percentage }: Props): Node {
  return (
    <Card>
      <div className="tag">{percentage}%</div>
    </Card>
  );
}

export default AverageCostCard;
