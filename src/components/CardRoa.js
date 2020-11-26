// @flow

/* eslint-disable indent */
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const RoaElement = styled.div`
  height: 26px;
  text-align: center;
  padding: 3px 0;
  border: 1px solid #dee2ea;
  border-radius: 8px;
  color: #2B2C32;
  font-size: 14px;
`;

type Props = {|
  roa: string,
  description?: string,
|};

function CardRoa({ roa, description }: Props): Node {
  return (
    <div>
      <RoaElement>
        {description}
        {parseFloat(roa) === 0 ? 'unknown' : `${parseFloat(roa).toFixed(2)}% `}
      </RoaElement>
    </div>
)
}

export default CardRoa;
