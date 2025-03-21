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
type Props = {
  +children: Node,
  +onClick: Function,
  +disabled: boolean,
  +className?: string,
  ...
};

function Button(props: Props): React$Node {
  const { children, onClick, disabled } = props;
  return (
    <BtnWrapper disabled={disabled} onClick={onClick} {...props}>
      {children}
    </BtnWrapper>
  );
}

const BtnRevampWrapper = styled.button`
  box-sizing: border-box;
  min-width: 120px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #7892e8;
  background: none;
  border: 0;
  border-radius: 8px;
  width: 100%;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 0.5px;
  &:hover {
    color: #3154cb;
    background-color: #e4e8f7;
  }

  &:active {
    color: #1737a3;
    background-color: #eaedf2;
  }

  &:focus {
    outline: 2px solid #ecba09;
  }

  &:disabled {
    color: #a0b3f2;
    cursor: not-allowed;
    background-color: transparent;
  }
`;

function ButtonRevamp(props: Props): React$Node {
  const { children, onClick, disabled } = props;
  return (
    <BtnRevampWrapper disabled={disabled} onClick={onClick} {...props}>
      {children}
    </BtnRevampWrapper>
  );
}

export default Button;
export { ButtonRevamp };
