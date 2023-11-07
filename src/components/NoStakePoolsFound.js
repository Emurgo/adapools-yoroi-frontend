// @flow
import React from 'react';
import styled from 'styled-components';
import stakingIllustration from '../assets/staking-illustration.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 60vh;

  & .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
    text-align: center;
  }
`;

function NoStakePoolsFound(): React$Node {
  return (
    <Container>
      <img className="staking-img" src={stakingIllustration} alt="Staking Pools" />
      <h1 className="title">No stake pools found</h1>
    </Container>
  );
}

export default NoStakePoolsFound;
