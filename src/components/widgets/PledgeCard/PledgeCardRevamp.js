// @flow

import React from 'react';
import styled from 'styled-components';
import type { Node } from 'react';
import { formatBigNumber } from '../../../utils/utils';

type Props = {|
  value: string | number,
  real?: string | number,
|};

const Card = styled.div`
  display: inline-block;
  font-size: 16px;
  line-height: 22px;
  color: #242838;
  padding: 2px 8px;
  text-align: left;
  @media (max-width: 1125px) {
    justify-content: center;
    padding: 0;
  }
`;
function PledgeCardRevamp({ value }: Props): Node {
  return (
    <Card>
      <span>{formatBigNumber(value.toString())}</span>
    </Card>
  );
}

export default PledgeCardRevamp;
