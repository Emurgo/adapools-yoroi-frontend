// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
`;
const Background = styled.div`
  background-color: #ffffff;
`;

function LayoutRevamp({ children }: {| children?: ?Node |}): Node {
  return (
    <Background>
      <Container>{children}</Container>
    </Background>
  );
}

export default LayoutRevamp;
