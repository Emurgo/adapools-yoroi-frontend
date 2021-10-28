// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;
const Wrapper = styled.div`
  padding: ${({ noGutters }) => (noGutters ? '20px 0' : '40px 30px')};
`;
const Background = styled.div`
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

function Layout({ children, noGutters }: {| children?: ?Node, noGutters?: boolean |}): Node {
  return (
    <Background>
      <Container>
        <Wrapper noGutters={noGutters}>{children}</Wrapper>
      </Container>
    </Background>
  );
}

export default Layout;
