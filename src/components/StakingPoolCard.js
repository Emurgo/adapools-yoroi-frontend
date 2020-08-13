// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import parse from 'html-react-parser';
import { DesktopOnly } from './layout/Breakpoints';

const MainCardPool = styled.div`
  display: flex;
  padding: 15px 0;
  .card-image {
    width: 45px;
    margin-right: 15px;
    img {
      width: 100%;
    }
  }
  .card-info {
    color: #1a44b7;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 22px;
    span {
      margin-left: 8px;
      color: #676970;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .name {
    display: flex;
    align-items: flex-start;
  }
  .social-media {
    display: grid;
    grid-template-columns: repeat(5, auto);
    a {
      margin-right: 10px;
    }
    a[href*="https://adapools.org"]
    {
      grid-column: -1/1;
      grid-row: 1;
      margin-bottom: 6px;
    }
  }
  .id {
  }
`;
type Props = {|
  avatar: string,
  fullname: string,
  id: string,
|};

function StakingPoolCard({ avatar, fullname, id }: Props): Node {
  function truncateString(string) {
    if (string.length <= 8) {
      return string;
    }
    return `${string.substring(0, 6)}...${string.slice(string.length - 2)}`;
  }

  return (
    <MainCardPool>
      <div className="card-image">
        <img
          src={avatar || 'https://s3.amazonaws.com/learn-verified/identicon-example.png'}
          alt=""
        />
      </div>
      <div className="card-info">
        <div className="name">
          <div className="social-media">{parse(fullname)}</div>
          <DesktopOnly>
            <span className="id"> {truncateString(id)}</span>
          </DesktopOnly>
        </div>
      </div>
    </MainCardPool>
  );
}

export default StakingPoolCard;
