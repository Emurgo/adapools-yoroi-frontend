// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 20px 0px;
`;

const SBackground = styled('div')(({ isDark }) => ({
  backgroundColor: isDark ? '#1F232E' : '#EAEDF2',
  '& h1, & h2, & h3, & h4, & h5, & h6, & a, & p, & span': {
    color: isDark && '#E1E6F5',
  },
  '& table': {
    background: isDark && '#1F232E',
  },
}));

function LayoutRevamp({ children, urlParams }: {| children?: ?Node, urlParams: any |}): Node {
  const isDark = urlParams.theme === 'dark';

  return (
    <SBackground isDark={isDark}>
      <Container>{children}</Container>
    </SBackground>
  );
}

export default LayoutRevamp;
