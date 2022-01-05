// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

type Props = {
  +children: Node,
  +onClick: Function,
  +disabled: boolean,
  +className?: string,
  ...
};

const BtnRevampWrapper = styled.button`
  box-sizing: border-box;
  height: 40px;
  width: 120px;
  font-size: 16px;
  color: #17d1aa;
  background: none;
  border: 0;
  border-radius: 8px;
  width: 100%;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    color: #15d1aa;
  }
  &:disabled {
    background: transparent;
    color: #c9ede5;
    cursor: default;
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

export default ButtonRevamp;
