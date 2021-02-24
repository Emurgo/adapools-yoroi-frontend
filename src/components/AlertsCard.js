// @flow
import * as React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

type Props = {|
  +isSaturated: boolean,
  +isRetiring: boolean,
  +isNew: boolean,
  +isChanging: boolean,
|};
const AlertContainer = styled.div`
  @media (max-width: 1125px) {
    display: flex;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 4px;
  i {
    color: #8a92a3;
    font-size: 14px;
  }
  @media (max-width: 1125px) {
    margin-right: 24px;
  }
`;
const Label = styled.p`
  color: #242838;
  font-family: Rubik;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 22px;
  text-align: right;
  margin-right: 8px;
`;

const AlertsCard = ({ isSaturated, isRetiring, isNew, isChanging }: Props): Node => {
  const isEmpty = !isSaturated && !isRetiring && !isNew && !isChanging;
  return (
    <AlertContainer>
      {isSaturated ? (
        <Wrapper>
          <Label>Saturated</Label>
          <i className="fa fa-snowflake-o" aria-hidden="true" />
        </Wrapper>
      ) : null}
      {isRetiring ? (
        <Wrapper>
          <Label>Retiring</Label>
          <i className="fa fa-snowflake-o" aria-hidden="true" />
        </Wrapper>
      ) : null}
      {isNew ? (
        <Wrapper>
          <Label>New</Label>
          <i className="fa fa-snowflake-o" aria-hidden="true" />
        </Wrapper>
      ) : null}
      {isChanging ? (
        <Wrapper>
          <Label>Parameters changing</Label>
          <i className="fa fa-snowflake-o" aria-hidden="true" />
        </Wrapper>
      ) : null}
      {isEmpty ? <p> - </p> : null}
    </AlertContainer>
  );
};

export default AlertsCard;
