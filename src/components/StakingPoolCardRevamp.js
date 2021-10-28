// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { toSvg } from 'jdenticon';
import SVG from 'react-inlinesvg';

const MainCardPool = styled.div`
  display: flex;
  padding: 15px 0;
  .card-image {
    width: 36px;
    height: 36px;
    min-width: 36px;
    margin-right: 15px;
    border-radius: 20px;
    border: 1px solid rgba(111, 114, 144, 0.24);
    overflow: hidden;
    img {
      width: 100%;
      object-fit: scale-down;
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
    i {
      font-size: 16px;
    }
  }
  .name {
    margin-right: 8px;
    margin-bottom: 4px;
    color: #3154cb;
    text-decoration: none;
  }
  .social-media {
    display: flex;
    flex: 1 1 60%;
    color: #6b7384;
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
  avatar: ?string,
  fullname: ?string,
  id: string,
  tickerName: ?string,
  name: ?string,
  links: {|
    tw: ?string,
    tg: ?string,
    fb: ?string,
    yt: ?string,
    tc: ?string,
    di: ?string,
    gh: ?string,
    icon: ?string,
  |},
|};

function truncateString(string: string, maxLength: number): string {
  if (string.length <= maxLength) {
    return string;
  }
  return `${string.substring(0, maxLength)}...`;
}
function StakingPoolCardRevamp({ id, avatar, tickerName, name, links, fullname }: Props): Node {
  const twitter = links && links.tw;
  const telegram = links && links.tg;
  const facebook = links && links.fb;
  const youtube = links && links.yt;
  const twitch = links && links.tc;
  const discord = links && links.di;
  const github = links && links.gh;
  const websiteUrl =
    fullname == null ? undefined : fullname.match(/(https?:\/\/[^\s]+"?utm_source=adapools.org)/g);

  return (
    <MainCardPool>
      <div className="card-image">
        {avatar ? <img src={avatar} alt="" /> : <SVG src={toSvg(id, 42)} />}
      </div>
      <div className="card-info">
        <a
          href={`https://adapools.org/pool/${id}`}
          className="name"
          target="_blank"
          rel="noreferrer noopener"
        >
          {tickerName ? <>[{tickerName}] </> : null}
          {truncateString(name ?? '', 28)}
        </a>
        <span className="social-media">
          {twitter ? (
            <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-twitter" />
            </a>
          ) : null}
          {telegram ? (
            <a href={`https://t.me/${telegram}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-telegram" />
            </a>
          ) : null}
          {facebook ? (
            <a href={`https://fb.me/${facebook}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-facebook" />
            </a>
          ) : null}
          {youtube ? (
            <a href={`https://youtube.com/${youtube}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-youtube" />
            </a>
          ) : null}
          {twitch ? (
            <a href={`https://twitch.com/${twitch}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-twitch" />
            </a>
          ) : null}
          {discord ? (
            <a href={`https://discord.gg/${discord}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-server" />
            </a>
          ) : null}
          {github ? (
            <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-github-alt" />
            </a>
          ) : null}
          {websiteUrl ? (
            <a href={websiteUrl} target="_blank" rel="noreferrer noopener">
              <i className="fa fa-link" />
            </a>
          ) : null}
        </span>
      </div>
    </MainCardPool>
  );
}

export default StakingPoolCardRevamp;
