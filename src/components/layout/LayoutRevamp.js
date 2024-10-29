// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 20px 0px;
`;

const SBackground = styled('div')(({ isDark, isLight }) => ({
  // eslint-disable-next-line no-nested-ternary
  backgroundColor: isDark ? '#15171F' : isLight ? '#FFFFFF' : '#FFFFFF',
  '& h1, & h2, & h3, & h4, & h5, & h6, & a, & p, & span': {
    color: isDark && '#E1E6F5',
  },
  '& table': {
    background: isDark && '#15171F',
  },
}));

function LayoutRevamp({ children, urlParams }: {| children?: ?Node, urlParams: any |}): Node {
  const isDark = urlParams.theme === 'dark';
  const isLight = urlParams.theme === 'light';

  return (
    <SBackground isDark={isDark} isLight={isLight}>
      <Container>{children}</Container>
    </SBackground>
  );
}

export default LayoutRevamp;
