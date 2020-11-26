// @flow

import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const StyledModal: any = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  opacity: 0;
  transition: opacity linear 0.15s;
  z-index: 2000;

  border-radius: 4px;
  margin-top: 70px;

  height: 100vh;

  position: fixed;
  overflow: hidden;
  width: 700px;
  height: 600px;
  margin: 50px auto;

  &.fade-in {
    opacity: 1;
    transition: opacity linear 0.15s;
    margin: auto;
  }
  &.fade-out {
    opacity: 0;
    transition: opacity linear 0.15s;
  }

  .background {
    opacity: 0.75;
    background-color: #0B183A;
    position: fixed;
    z-index: 1040;
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    outline: 0;
    overflow: hidden;
  }
  
  .box-dialog {
    z-index: 1050;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;

    .box-content {
      padding: 0px 24px;
      width: 100%;
      overflow-y: scroll;
      height: 100%;
    }

    .close {
      font-size: 16px;
    }
    .box-header {
      position: relative;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;

      button:focus {
        outline: 0;
      }

      .box-title {
        color: #242838;
        text-transform: uppercase;

        @media (max-width: 1125px) {
          font-size: 17px;
        }
      }
      .x-close {
        right: 5%;
        position: absolute;
        width: 24px;
        background: transparent;
        color: #242838;
        cursor: pointer;
        border: none;
        outline: none;
        img {
          width: 100%;
        }
        &:hover {
          opacity: 0.5;
        }
      }
    }
    .box-body {
      font-size: 14px;
      padding: 0px;
      width: auto;
      height: auto;
    }

    @media (max-width: 1125px) {
      max-width: 100%;
    }
  }

  @media (max-width: 1125px) {
    height: 70%;
  }

  @media (max-width: 1125px) {
    width: 70%;
  }
`;
