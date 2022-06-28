// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import infoIcon from '../../assets/info-icon.svg';

const WrapperToolTip = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .label {
    padding-left: 3px;
  }
  @media (min-width: 1125px) and (max-width: 1200px) {
    justify-content: center;
  }
`;
const ToolTip = styled.span`
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  padding-top: 5px;
  &:before {
    content: attr(data-text);
    position: absolute;
    z-index: 99999;
    bottom: 105%;
    transform: translate(-50%, 0%);
    left: 50%;
    min-width: 150px;
    max-width: 200px;
    padding: 0.4rem 0.75rem;
    border-radius: 10px;
    background: #000;
    display: none;
    text-align: center;
    opacity: 0;
    transition: 10s opacity;
  }
  img {
    max-width: 100%;
    width: 18px;
    height: 18px;
  }
  &:hover:before {
    display: block;
    opacity: 1;
    color: white;
  }
`;

type Props = {|
  label: string,
  textInfo: ?string,
|};

function Tooltip({ label, textInfo }: Props): Node {
  return (
    <WrapperToolTip>
      <ToolTip data-text={textInfo}>{textInfo != null && <img src={infoIcon} alt="" />}</ToolTip>
      <span className="label">{label}</span>
    </WrapperToolTip>
  );
}

const WrapperToolTipRevamp = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: column;
  justify-content: flex-end;

  @media (min-width: 1125px) and (max-width: 1200px) {
    justify-content: center;
  }
`;

function TooltipRevamp({ label, textInfo }: Props): Node {
  return (
    <WrapperToolTipRevamp>
      <ToolTip data-text={textInfo}>
        {textInfo != null && <span className="label">{label}</span>}
      </ToolTip>
    </WrapperToolTipRevamp>
  );
}

export default Tooltip;
export { TooltipRevamp };
