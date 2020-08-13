// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const BtnWrapper = styled.button`
  box-sizing: border-box;
  height: 40px;
  width: 120px;
  border: 2px solid #15d1aa;
  font-size: 14px;
  color: #15d1aa;
  background: none;
  border-radius: 8px;
  width: 100%;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.3;
    background: #15d1aa;
    color: white;
  }
`;
type Props = {|
  +children: Node,
  +disabled: boolean,
  +onClick: Function,
|};

function Button(props: Props) {
  const { children, onClick } = props;
  return <BtnWrapper onClick={onClick} {...props}>{children}</BtnWrapper>;
}

export default Button;
