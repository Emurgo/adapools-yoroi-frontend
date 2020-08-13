// @flow

import React from 'react';
import styled from 'styled-components';
import type { Node } from 'react';

const Card = styled.div`
  display: inline-block;
  font-size: 14px;
  border-radius: 8px;
  background-color: ${(props) => props.background || '#fff'};
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

type Props = {|
  value: string,
|};

function PledgeCard({ value }: Props): Node {
  let backgroundColor = null;
  // to fix according to ranges
  switch (true) {
    case value.indexOf('k') > -1:
      backgroundColor = 'hsl(144.51411110481,95%,95%)';
      break;
    case value.indexOf('M') > -1:
      backgroundColor = 'hsl(38.527896145612,80%,80%)';
      break;
    case value.indexOf('B') > -1:
      backgroundColor = 'hsl(193.87471217905,95%,95%)';
      break;
    case value.indexOf('T') > -1:
      backgroundColor = 'hsl(240,95%,95%)';
      break;
    default:
      backgroundColor = 'hsl(0,95%,95%)';

      break;
  }

  return (
    <Card background={backgroundColor}>
      <i className="fas fa-check" />
      <span>{value}</span>
    </Card>
  );
}

export default PledgeCard;
