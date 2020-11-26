// @flow

import axios from 'axios';
import { BACKEND_URL } from '../manifestEnvs';

const backendUrl: string = BACKEND_URL;

export type HistBPE = {|
  +val: string,
  +time: string,
  +e: number,
|};

export type SocialMediaHandles = {|
  tw: ?string,
  tg: ?string,
  fb: ?string,
  yt: ?string,
  tc: ?string,
  di: ?string,
  gh: ?string,
  icon: ?string,
|};

export type Pool = {|
  +id: string, // hash
  +db_ticker: ?string, // may not have a ticker
  +db_name: ?string, // may not have a name
  +pool_pic: ?string, // may not have a pic
  +fullname: ?string,
  +pledge: string,
  +pledge_real: string, // not sure diff with "pledge"
  +total_stake: string, // in lovelace
  +total_size: string, // percentage of total
  +tax_fix: string, // fix tax in lovelace
  +tax_ratio: string, // ratio tax in percentage
  +tax_computed: number, // not sure
  +blocks_epoch: string,
  +roa: string,
  +hist_bpe: { [string]: HistBPE },
  +hist_roa: any, // no examples yet. similar to bpe?
  +score: number,
  +handles: SocialMediaHandles, // social media stuff
  +last_rewards: string,
  +position: number,
  +color_roa: string, // hsl(240,95%,95%)
  +color_stake: string, // hsl(240,95%,95%)
  +color_fees: string, // hsl(240,95%,95%)
  +color_pledge: string, // hsl(240,95%,95%)
  +saturation: number,
|};

export type World = {|
  +epoch: number, // string from api
  +slot: number, // string from api
  +stake: string,
  +supply: string, // number from api
  +pools: string,
  +price: number,
|};

export const Sorting = Object.freeze({
  // ROA: 'roa',
  TICKER: 'ticker',
  SCORE: 'score',
});

export type SortingEnum = $Values<typeof Sorting>;

export type ApiPoolsResponse = {|
  world: World,
  pools: { [string]: Pool },
|};

export function getPools(body: {
  search?: string,
  sort?: SortingEnum,
  limit?: number
  // cancelToken: boolean
}): Promise<ApiPoolsResponse> {
  const requestBody = {
    ...{ search: '', sort: Sorting.SCORE, limit: 250 },
    ...body,
  }

  const encodeForm = (data) => {
    return (Object.keys(data): any)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  }

  return axios(`${backendUrl}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    data: encodeForm(requestBody),
  })
    .then((response) => {
      const poolsResponse: ApiPoolsResponse = response.data;
      return poolsResponse;
    })
    .catch((error) => {
      console.log('API::getPools Error: ', error);
      return {
        pools: {}
      }
    });
}

export function listPools(): Promise<ApiPoolsResponse> {
  return getPools({});
}
