// @flow

import axios from 'axios';
import { BACKEND_URL, BACKEND_URL_DAEDALUS } from '../manifestEnvs';

const backendUrlAdapools: string = BACKEND_URL;
const backendUrlDaedalus: string = BACKEND_URL_DAEDALUS;

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
  +total_size: number, // percentage of total
  +tax_fix: string, // fix tax in lovelace
  +tax_ratio: string, // ratio tax in percentage
  +tax_computed: number, // not sure
  +blocks_epoch: string,
  +roa: string,
  +hist_bpe: {| [string]: HistBPE |},
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

// TODO: fix with right data
export type PoolDaedalusSimple = {|
  +cost: string,
  +margin: string,
  +non_myopic_member_rewards: number,
  +pledge: string,
  +pool_id: string,
  +pool_info: ?string,
  +produced_blocks: number,
  +relative_stake: string,
  +saturation: string,
|};

export type World = {|
  +epoch: string,
  +slot: string,
  +stake: string,
  +supply: number,
  +pools: string,
  +price: number,
  +delegators: string,
|};

export const Sorting = Object.freeze({
  // ROA: 'roa',
  TICKER: 'ticker',
  SCORE: 'score',
});
export const Provider = Object.freeze({
  ADAPOOLS: 'adapools',
  POOLTOOL: 'pooltool',
  DAEDALUS_SIMPLE: 'daedalus_simple',
  DAEDALUS_ADVANCED: 'daedalus_advanced',
});

export type SortingEnum = $Values<typeof Sorting>;
export type ProviderEnum = $Values<typeof Provider>;

export type SearchParams = {|
  limit?: number,
  search?: string,
  sort?: SortingEnum,
|};
export type SearchParamsDaedalus = {|
  search?: string,
  limit: ?number,
  offset: ?number,
|};

export type ApiPoolsResponse = {|
  world?: World,
  pools?: {| [string]: Pool |},
|};
export type ApiPoolsDaedalusSimpleResponse = Array<PoolDaedalusSimple>;

const encodeForm = (data) => {
  return (Object.keys(data): any)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
};
export function getPools(body: SearchParams): Promise<ApiPoolsResponse> {
  const requestBody = {
    ...{ search: '', sort: Sorting.SCORE, limit: 250 },
    ...body,
  };

  return axios(`${backendUrlAdapools}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    data: encodeForm(requestBody),
  })
    .then((response) => {
      const poolsResponse: ApiPoolsResponse = response.data;
      return poolsResponse;
    })
    .catch((error) => {
      console.error('API::getPools Error: ', error);
      return {
        pools: {},
      };
    });
}

export function getPoolsByDaedalusSimple(
  body: SearchParamsDaedalus,
): Promise<ApiPoolsDaedalusSimpleResponse> {
  const requestBody = {
    search: '',
    limit: 250,
    offset: 0,
    ...body,
  };

  return axios(backendUrlDaedalus, {
    // TODO: fix when limit and offset works
    method: 'get',
    data: encodeForm(requestBody),
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error(`API daedalus: getPoolsByDaedalusSimple Error: ${error}`);
    });
}

export function listPools(): Promise<ApiPoolsResponse> {
  return getPools(({}: any));
}
