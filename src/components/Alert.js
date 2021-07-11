// @flow

/* eslint-disable indent */
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import attentionIcon from '../assets/attention.svg';

const Banner = styled.div`
  padding: 24px;
  margin-bottom: 24px;
  background-color: #fff0f5;
  border-radius: 8px;
  color: #242838;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const AlertHeader = styled.div`
  font-weight: bold;
  color: #FF1351;
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const AlertIcon = styled.div`
  margin-right: 12px;
  align-items: center;
`;

const AlertText = styled.div`
  margin-right: 12px;
`;

type Props = {|
  title: string,
|};

function Alert({ title }: Props): Node {

  return ( title && 
    <Banner>
      <AlertHeader>
        <AlertIcon><img src={attentionIcon} alt="" /></AlertIcon> <AlertText>ATTENTION:</AlertText>
      </AlertHeader>
      <p>{title}</p>
    </Banner>
)
}

export default Alert;
