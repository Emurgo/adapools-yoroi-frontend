// @flow

/* eslint-disable indent */
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

type Props = {|
  roa: string,
  description?: string,
|};

const RoaElementRevamp = styled.div`
  height: 26px;
  text-align: center;
  padding: 3px 0;
  color: #242838;
  font-size: 16px;
  @media (max-width: 1125px) {
    text-align: left;
  }
`;

function CardRoaRevamp({ roa, description }: Props): Node {
  return (
    <RoaElementRevamp>
      {description}
      {parseFloat(roa) === 0 ? 'unknown' : `${parseFloat(roa).toFixed(2)}% `}
    </RoaElementRevamp>
  );
}

export default CardRoaRevamp;
