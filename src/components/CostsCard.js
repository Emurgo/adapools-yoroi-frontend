// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Card = styled('div')(({ isDark }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  fontSize: '14px',
  lineHeight: '22px',
  '@media (max-width: 1125px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  '@media (min-width: 1125px) and (max-width: 1200px)': {
    flexDirection: 'column-reverse',
    alignItems: 'flex-end',
  },
  '.value': {
    color: isDark ? '#E1E6F5' : '#242838',
    fontSize: '14px',
  },
  '&.cardRevamp': {
    justifyContent: 'flex-start',
  },
  '.valueRevamp': {
    color: isDark ? '#E1E6F5' : '#242838',
    fontSize: '16px',
  },
}));

type Props = {|
  value: string,
  isDark?: boolean,
|};
function CostsCard({ value }: Props): Node {
  return (
    <Card>
      <p className="value">({value})</p>
    </Card>
  );
}
function CostsCardRevamp({ value, isDark }: Props): Node {
  return (
    <Card className="cardRevamp" isDark={isDark}>
      <p className="valueRevamp">{value}</p>
    </Card>
  );
}

export default CostsCard;
export { CostsCardRevamp };
