// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  line-height: 22px;
  @media (max-width: 1125px) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (min-width: 1125px) and (max-width: 1200px) {
    flex-direction: column-reverse;
    align-items: flex-end;
  }
  .value {
    color: #242838;
    font-size: 14px;
  }

  &.cardRevamp {
    justify-content: flex-start;
  }
  .valueRevamp {
    color: #242838;
    font-size: 16px;
  }
`;
type Props = {|
  value: string,
|};
function CostsCard({ value }: Props): Node {
  return (
    <Card>
      <p className="value">({value})</p>
    </Card>
  );
}
function CostsCardRevamp({ value }: Props): Node {
  return (
    <Card className="cardRevamp">
      <p className="valueRevamp">{value}</p>
    </Card>
  );
}

export default CostsCard;
export { CostsCardRevamp };
