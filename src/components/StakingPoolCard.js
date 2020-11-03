// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { toSvg } from 'jdenticon';
import SVG from 'react-inlinesvg';
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
    display: flex;
    flex-wrap: wrap;
    color: #1a44b7;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 22px;
    a {
      display: block;
    }
  }
  .name {
    margin-right: 8px;
    margin-bottom: 4px;
  }
  .social-media {
    display: flex;
    flex: 1 1 50%;
    a {
      margin-right: 10px;
      font-size: 20px;
    }
  }
  .id {
    color: #676970;
    line-height: 22px;
    font-size: 14px;
    margin-right: 13px;
  }
`;
type Props = {|
  avatar: string,
  fullname: string,
  id: string,
  tickerName: string,
  name: string,
  links: {|
    tw:?string, 
    tg:?string, 
    fb:?string, 
    yt:?string, 
    tc:?string, 
    di:?string, 
    gh:?string, 
  |}
|};

function StakingPoolCard({
  id,
  avatar,
  tickerName,
  name,
  links,
  fullname }: Props): Node {
  function truncateString(string) {
    if (string.length <= 8) {
      return string;
    }
    return `${string.substring(0, 6)}...${string.slice(string.length - 2)}`;
  }

  const twitter = links && links.tw
  const telegram = links && links.tg
  const facebook = links && links.fb
  const youtube = links && links.yt
  const twitch = links && links.tc
  const discord = links && links.di
  const github = links && links.gh
  const websiteUrl = fullname.match(/(https?:\/\/[^\s]+"?utm_source=adapools.org)/g)
  
  return (
    <MainCardPool>
      <div className="card-image">
        { avatar ?
          <img src={avatar} alt="" />
          :
          <SVG src={toSvg(id, 42)} />
        }
      </div>
      <div className="card-info">
        <a
          href={`https://adapools.org/pool/${id}`}
          className="name"
          target="_blank"
          rel="noreferrer"
        >
          {tickerName ?  <>[{tickerName}]{' '}</> : null}
          {name || ''}
        </a>
        <DesktopOnly>
          <span className="id"> {truncateString(id)}</span>
        </DesktopOnly>
        <span className="social-media">
          {twitter ? 
            <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noreferrer">
              <i className="fa fa-twitter" />
            </a> :null}
          {telegram ? 
            <a href={`https://t.me/${telegram}`} target="_blank" rel="noreferrer">
              <i className="fa fa-telegram" />
            </a> :null}
          {facebook ? 
            <a href={`https://fb.me/${facebook}`} target="_blank" rel="noreferrer">
              <i className="fa fa-facebook" />
            </a> :null}
          {youtube ? 
            <a href={`https://youtube.com/${youtube}`} target="_blank" rel="noreferrer">
              <i className="fa fa-youtube" />
            </a> :null}
          {twitch ? 
            <a href={`https://twitch.com/${twitch}`} target="_blank" rel="noreferrer">
              <i className="fa fa-twitch" />
            </a> :null}
          {discord ? 
            <a href={`https://discord.gg/${discord}`} target="_blank" rel="noreferrer">
              <i className="fa fa-server" />
            </a> :null}
          {github ? 
            <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer">
              <i className="fa fa-github-alt" />
            </a> :null}
          {websiteUrl ? 
            <a href={websiteUrl} target="_blank" rel="noreferrer">
              <i className="fa fa-link" />
            </a> :null}
        </span>
      </div>
    </MainCardPool>
  );
}

export default StakingPoolCard;
