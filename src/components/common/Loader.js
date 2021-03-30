// @flow
import * as React from 'react';
import styled from 'styled-components';
import type { Node } from 'react';
import spinnerImg from '../../assets/spinner.svg';

const LoaderWrapper = styled.div`
  width: 30px;
  height: 30px;
  margin: 50px auto;
  background: url(${spinnerImg}) no-repeat center;
  background-size: 30px;
  animation: loading-spin 1.5s linear;
  animation-iteration-count: infinite;

  @keyframes loading-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Loader = (): Node => {
  return <LoaderWrapper />;
};

export default Loader;
