// @flow

import axios from 'axios';
import seedrandom from 'seedrandom';
import { BACKEND_URL } from '../manifestEnvs';

const backendUrl: string = BACKEND_URL;

const biasPoolIds = [
  'df1750df9b2df285fcfb50f4740657a18ee3af42727d410c37b86207',
  'af22f95915a19cd57adb14c558dcc4a175f60c6193dc23b8bd2d8beb',
  '04357793d81097a7d2c15ec6cd6067a58cdd2fb21aaf07e56c306ecf',
  'c34a7f59c556633dc88ec25c9743c5ebca3705e179a54db5638941cb',
  'c5293f2ba88ac474787358b9c2f4fae7b3c4408f79cdf89a12c9ece4',
  '8145274aa1713d4569e0d946af510b4d2b80640d87c1a0e4e0517954',
];
const biasPoolsSearchQuery = biasPoolIds.join('|');

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

export type SortingEnum = $Values<typeof Sorting>;

export type SearchParams = {|
  limit?: number,
  search?: string,
  sort?: SortingEnum
|};

export type ApiPoolsResponse = {|
  world?: World,
  pools?: {| [string]: Pool |},
|};

export function getPools(body: SearchParams): Promise<ApiPoolsResponse> {
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
      console.error('API::getPools Error: ', error);
      return {
        pools: {}
      }
    });
}

const toPoolArray: (?{| [string]: Pool |}) => Array<Pool> = (pools) => {
  if (pools == null) return [];
  return Object.keys(pools).map((key) => pools[key]);
}

function rndSign(seed: string) {
  const rnd = seedrandom(seed);
  return () => {
    return Math.sign(rnd() * 2 - 1);
  }
}

const sortBiasedPools = (pools: Pool[], seed: string) => {
  const rev = seed.split('').reverse().join('');
  return [...pools]
    .sort(rndSign(seed))
    .sort(rndSign(rev));
}

function getRandomInt(min: number, max: number) {
  const intMin = Math.ceil(min);
  const intmax = Math.floor(max);
  return Math.floor(Math.random() * (intmax - intMin + 1)) + intMin;
}

export async function listBiasedPools(seed: string): Promise<Pool[]> {
  const unbiasedPoolsResponse = await getPools(({}: any));
  const unbiasedPools = toPoolArray(unbiasedPoolsResponse.pools);

  try {
    const biasedPoolsResponse = await getPools(({ search: biasPoolsSearchQuery }));
    if (!biasedPoolsResponse) return unbiasedPools;
    const biasedPools = sortBiasedPools(toPoolArray(biasedPoolsResponse.pools), seed);
    if (!biasedPools || biasedPools.length === 0) return unbiasedPools;
    if (unbiasedPools.length === 0) return biasedPools;

    const topPool = biasedPools.shift();
    const allPools = [topPool].concat(unbiasedPools);

    /*
      we want to list the Emurgo pools in high-ish positions.
      for that, we define a spread size which is used to define a range of
      possible positions for each pool to be inserted into the final set (allPools).

      with a `spreadBias` of `3`, it means the Emurgo pools will be all roughly in the top 33%
      of listed pools, but all separated by the value of spreadSize.

      notice that spreadSize is based on the length of unbiasedPools as well, so the more
      unbiased pools we have, the higher the spread will be.
    */
    const spreadBias = 3;
    const spreadSize = Math.trunc(Math.trunc(unbiasedPools.length / spreadBias) / biasedPools.length);
    // since we already list an Emurgo pool in the top, we say that the next Emurgo pool
    // needs to be at least this distance from the top
    const minimumDistanceFromTop = 10;

    for (let i = 0; i < biasedPools.length; i += 1) {
      const biasedPool = biasedPools[i];
      const minPossiblePosition = minimumDistanceFromTop + (spreadSize * (i + 1));
      const maxPossiblePosition = minPossiblePosition + spreadSize
      const randomPosition = getRandomInt(minPossiblePosition, maxPossiblePosition);
      allPools.splice(randomPosition, 0, biasedPool);
    }

    for (let i = 0; i < biasPoolIds.length; i += 1) {
      const poolId = biasPoolIds[i];
      const poolToRemove = unbiasedPools.find(p => p.id === poolId);
      if (poolToRemove) {
        const poolToRemoveIdx = unbiasedPools.indexOf(poolToRemove);
        if (poolToRemoveIdx > -1) {
          unbiasedPools.splice(poolToRemoveIdx, 1);
        }
      }
    }

    return allPools;
  } catch (err) {
    return unbiasedPools;
  }
  
}

export function listPools(): Promise<ApiPoolsResponse> {
  return getPools(({}: any));
}
