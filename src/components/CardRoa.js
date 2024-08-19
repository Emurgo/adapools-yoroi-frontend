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
  color: #2b2c32;
  font-size: 14px;
`;

type Props = {|
  roa: string,
  description?: string,
  isDark?: boolean,
|};

function CardRoa({ roa, description }: Props): Node {
  return (
    <div>
      <RoaElement>
        {description}
        {parseFloat(roa) === 0 ? 'unknown' : `${parseFloat(roa).toFixed(2)}% `}
      </RoaElement>
    </div>
  );
}

const RoaElementRevamp = styled('div')(({ isDark }) => ({
  height: '26px',
  padding: '3px 0',
  color: isDark ? '#E1E6F5' : '#242838',
  fontSize: '16px',
  textAlign: 'left',
}));

function CardRoaRevamp({ roa, description, isDark }: Props): Node {
  return (
    <RoaElementRevamp isDark={isDark}>
      {description}
      {parseFloat(roa) === 0 ? 'unknown' : `${parseFloat(roa).toFixed(2)}% `}
    </RoaElementRevamp>
  );
}

export default CardRoa;
export { CardRoaRevamp };
