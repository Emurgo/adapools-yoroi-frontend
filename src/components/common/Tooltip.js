import React from 'react';
import styled from 'styled-components';
import infoIcon from '../../assets/info-icon.svg';

const WrapperToolTip = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .label {
    padding-left: 3px;
  }
  @media (min-width:1125px) and (max-width: 1200px) {
    justify-content: center;
  }
`
const ToolTip = styled.span`
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  &:before {
    content: attr(data-text);
    position: absolute;
    z-index: 99999;
    bottom: 0;
    transform: translate(-50%, -50%);
    left: 50%;
    width: 200px;
    padding: 0.4rem 0.75rem;
    border-radius: 10px;
    background: #000;
    display: none;
    text-align: center;
    opacity:0;
    transition:10s opacity;   
  }
  img{
    max-width: 100%;
    width: 18px;
    height: 18px;
  }
  &:hover:before {
    display: block;
    opacity:1;
  }
`;

type Props = {|
  label: string,
  textInfo: string,
|};

function Tooltip({ label, textInfo }: Props) {
  return (
    <WrapperToolTip>
      <ToolTip data-text={textInfo}>
        {textInfo != null && <img src={infoIcon} alt="" />}
      </ToolTip>
      <span className="label">{label}</span>
    </WrapperToolTip>
  );
}

export default Tooltip;
