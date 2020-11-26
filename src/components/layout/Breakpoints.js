// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const MobileHidden = styled.div`
  display: none;
  @media (max-width: 1125px) {
    display: block;
  }
`;
const DesktopHidden = styled.div`
  display: block;
  @media (max-width: 1125px) {
    display: none;
  }
`;

export const MobileOnly = ({ children }: {| children?: ?Node |}): Node => <MobileHidden>{children}</MobileHidden>;

export const DesktopOnly = ({ children }: {| children?: ?Node |}): Node => <DesktopHidden>{children}</DesktopHidden>;
