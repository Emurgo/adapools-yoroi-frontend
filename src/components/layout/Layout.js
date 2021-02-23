// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import adapoolIcon from '../../assets/adapool-logo-extend.svg';

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;
const Wrapper = styled.div`
  padding: 40px 30px;
`;
const Background = styled.div`
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const CreditSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 24px 0 0;
  color: #676970;
  font-size: 14px;
  img {
    background: #012b51;
    margin-left: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    height: 27px;
  }
`;

function Layout({ children }: {| children?: ?Node |}): Node {
  return (
    <Background>
      <Container>
        <Wrapper>{children}</Wrapper>
      </Container>
      <CreditSection>
        Powered by
        <a href="https://adapools.org/" target="_blank" rel="noopener noreferrer">
          <img src={adapoolIcon} alt="adapool-logo" />
        </a>
      </CreditSection>
    </Background>
  );
}

export default Layout;
