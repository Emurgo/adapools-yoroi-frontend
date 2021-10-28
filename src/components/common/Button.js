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
    background-color: rgba(23, 226, 184, 0.1);
  }
  &:disabled {
    background: transparent;
    color: #c9ede5;
    border: 2px solid #c9ede5;
    cursor: default;
  }
`;
type Props = {|
  +children: Node,
  +onClick: Function,
  +disabled: boolean,
  +className?: string,
|};

function Button(props: Props): React$Node {
  const { children, onClick, disabled } = props;
  return (
    <BtnWrapper disabled={disabled} onClick={onClick} {...props}>
      {children}
    </BtnWrapper>
  );
}

export default Button;
