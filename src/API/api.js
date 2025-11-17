// @flow

import axios from 'axios';
import seedrandom from 'seedrandom';
import { BACKEND_URL_FOR_PREPROD, BACKEND_URL_FOR_MAINNET } from '../manifestEnvs';

const BIAS_POOL_IDS = [
  'dbda39c8d064ff9801e376f8350efafe67c07e9e9244dd613aee5125', // EMURA
  '8efb053977341471256685b1069d67f4aca7166bc3f94e27ebad217f', // EMUR7
  // '0ef7aa564933ce75b695cdad66be4a39b43a22726de7c58908e0e033', // EMUR8
  '359d3f8e355c873b0b5cae1e18eb12e44dcfc2ad212706d93ac314ab', // EMURB
  '2a8294ad7538b15353b9ffd81e26dafe846ffc3f6b9e331d4c1dc030', // YORO1
  'b19f2d9498845652ae6eea5da77952b37e2bca9f59b2a98c56694cae', // YORO2
];
const BIAS_POOLS_SEARCH_QUERY = BIAS_POOL_IDS.join('|');

/**
 * Brackets used to insert non-top pools into the ranking.
 * Must be at least 1-less elements than BIAS_POOL_IDS
 */
const brackets = [
  { startIndex: 6, positionGap: 4 },
  { startIndex: 13, positionGap: 7 },
  { startIndex: 23, positionGap: 7 },
  { startIndex: 33, positionGap: 17 },
  { startIndex: 53, positionGap: 27 },
];

type HistBPE = {|
  +val: string,
  +time: string,
  +e: number,
|};

type SocialMediaHandles = {|
  tw: ?string,
  tg: ?string,
  fb: ?string,
  yt: ?string,
  tc: ?string,
  di: ?string,
  gh: ?string,
  homepage?: ?string,
  icon?: ?string,
|};

export type Pool = {|
  +id: string, // hash
  +id_bech: string, // hash
  +db_ticker: ?string, // may not have a ticker
  +db_name: ?string, // may not have a name
  +pool_pic: ?string, // may not have a pic
  +fullname?: ?string,
  +pledge: string,
  +pledge_real: string, // not sure diff with "pledge"
  +total_stake: string, // in lovelace
  +total_size?: number, // percentage of total
  +tax_fix: string, // fix tax in lovelace
  +tax_ratio: string, // ratio tax in percentage
  +tax_computed?: number, // not sure
  +blocks_epoch: string,
  +roa: string,
  +hist_bpe?: {| [string]: HistBPE |},
  +hist_roa?: any, // no examples yet. similar to bpe?
  +score?: number,
  +handles: SocialMediaHandles, // social media stuff
  +last_rewards?: string,
  +position?: number,
  +color_roa?: string, // hsl(240,95%,95%)
  +color_stake?: string, // hsl(240,95%,95%)
  +color_fees?: string, // hsl(240,95%,95%)
  +color_pledge?: string, // hsl(240,95%,95%)
  +saturation: number,
|};

export const Sorting = Object.freeze({
  SCORE: 'score',
  ROA: 'roa',
  POOL_SIZE: 'poolSize',
  PLEDGE: 'pledge',
  BLOCKS: 'blocks',
});

export const SortingDirections = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

export type SortingEnum = $Values<typeof Sorting>;
type SortingDirEnum = $Values<typeof SortingDirections>;

export type SearchParams = {|
  limit?: number,
  search?: string,
  sort?: SortingEnum,
  sortDirection?: SortingDirEnum,
|};

type ApiPoolsResponse = {|
  pools: Array<Pool>,
|};

function transformData(poolsResponse) {
  return {
    pools: poolsResponse?.data?.data?.map((pool) => (
      {
        id: pool.pool_id_hash_raw,
        id_bech: pool.pool_id,
        db_ticker: pool.pool_name.ticker,
        db_name: pool.pool_name.name,
        pool_pic: `https://ix.cexplorer.io/${pool.pool_id}`,
        pledge: String(pool.pool_update.active.pledge),
        pledge_real: String(pool.pledged),
        total_stake: String(pool.live_stake),
        tax_fix: String(pool.pool_update.active.fixed_cost),
        tax_ratio: String(pool.pool_update.active.margin),
        blocks_epoch: String(pool.blocks.epoch),
        roa: String(pool.stats.lifetime.roa),
        handles: {
          tw: pool.pool_name.extended?.twitter_handle ?? undefined,
          tg: pool.pool_name.extended?.telegram_handle ?? undefined,
          fb: pool.pool_name.extended?.facebook_handle ?? undefined,
          yt: pool.pool_name.extended?.youtube_handle ?? undefined,
          tc: pool.pool_name.extended?.twitch_handle ?? undefined,
          di: pool.pool_name.extended?.discord_handle ?? undefined,
          gh: pool.pool_name.extended?.github_handle ?? undefined,
          homepage: pool.pool_name.homepage ?? undefined,
        },
        saturation: pool.saturation,
      }
    )) ?? [],
  };
}

function convertSortingToBackendSorting(sorting: ?SortingEnum): string {
  if (sorting === Sorting.SCORE) return 'ranking';
  if (sorting === Sorting.ROA) return 'roa_lifetime';
  if (sorting === Sorting.POOL_SIZE) return 'live_stake';
  if (sorting === Sorting.PLEDGE) return 'pledge';
  if (sorting === Sorting.BLOCKS) return 'blocks';
  return 'ranking';
}

function getPools(network: 'mainnet' | 'preprod', body: SearchParams, bias: ?string = null): Promise<ApiPoolsResponse> {
  const requestBody = {
    ...{ limit: 250 },
    ...body,
    ...{ sort: convertSortingToBackendSorting(body.sort) }
  };

  const searchParams = new URLSearchParams();
  if (requestBody.sort === 'ranking') {
    searchParams.append('order', 'ranking');
  }
  if (requestBody.limit) {
    searchParams.append('limit', String(requestBody.limit));
  }
  if (requestBody.sortDirection) {
    searchParams.append('sort', requestBody.sortDirection);
  }
  if (requestBody.search) {
    searchParams.append('name', requestBody.search);
  }
  if (bias) {
    searchParams.append('poolId', bias);
  }
  const backendUrl = {
    preprod: BACKEND_URL_FOR_PREPROD,
    mainnet: BACKEND_URL_FOR_MAINNET,
  }[network];

  return axios(`${backendUrl}?${searchParams.toString()}`)
    .then((response) => {
      return transformData(response.data);
    })
    .catch((error) => {
      console.error('API::getPools Error: ', error);
      return transformData(null);
    });
}

const rndSign = (seed: string) => {
  const rnd = seedrandom(seed);
  return () => {
    return Math.sign(rnd() * 2 - 1);
  };
};

function initializeRandomInt(seed: string): (min: number, max: number) => number {
  const rnd = seedrandom(seed);
  return (min: number, max: number) => {
    const intMin = Math.ceil(min);
    const intmax = Math.floor(max);
    return Math.floor(rnd() * (intmax - intMin + 1)) + intMin;
  };
}

const sortBiasedPools = (pools: Array<Pool>, seed: string): Array<Pool> => {
  const rev = seed.split('').reverse().join('');
  return [...pools].sort(rndSign(seed)).sort(rndSign(rev));
};

const tail = (input: string): string => {
  return input?.slice(-10) ?? '';
};

export type ListBiasedPoolsResponse = {|
  pools: Pool[],
|};

export async function listBiasedPools(
  network: 'mainnet' | 'preprod',
  externalSeed: string,
  searchParams: SearchParams,
): Promise<ListBiasedPoolsResponse> {
  const unbiasedPoolsResponse = await getPools(network, searchParams);
  const originalPools = unbiasedPoolsResponse.pools;

  if (searchParams.search || (searchParams.sort !== undefined && searchParams.sort !== Sorting.SCORE) || network !== 'mainnet') {
    // If user searched or sorted explicitly - then we don't bias
    return { pools: originalPools };
  }

  // Filter unsaturated pools
  const unbiasedPools = originalPools.filter(p => Number(p.saturation) < 1.0);

  const [p1, p2, p3] = unbiasedPools;
  const internalSeed = tail(p1?.id) + tail(p2?.id) + tail(p3?.id);

  try {
    const biasedPoolsResponse = await getPools(network, ({}: any), BIAS_POOLS_SEARCH_QUERY);
    if (!biasedPoolsResponse) return { pools: unbiasedPools };
    const biasedPools = biasedPoolsResponse.pools
      .filter((x) => x.id && BIAS_POOL_IDS.indexOf(x.id) >= 0)
      .sort((a, b) => {
        // this sorting is to ensure that changes in the backend response order is not affecting the final ordering
        return BIAS_POOL_IDS.indexOf(a.id) - BIAS_POOL_IDS.indexOf(b.id);
      });
    if (biasedPools.length === 0) return { pools: unbiasedPools };
    const biasedPoolsOrderByExternalSeed = sortBiasedPools(biasedPools, externalSeed);

    const topPool = biasedPoolsOrderByExternalSeed[0];

    const biasedLowerPools = biasedPools.filter((p) => p !== topPool);
    const biasedLowerPoolsOrderedByInternalSeed = sortBiasedPools(biasedLowerPools, internalSeed);

    if (unbiasedPools.length === 0) return { pools: [topPool].concat(biasedLowerPoolsOrderedByInternalSeed) };

    // removes the Emurgo pools from the original list, as we are reinserting it later
    const presentBiasedIds = new Set(biasedPools.map(p => p.id));
    const filteredUnbiasedPools = unbiasedPools.filter(p => !presentBiasedIds.has(p.id));

    // insert top pool
    const allPools = [topPool].concat(filteredUnbiasedPools);

    const createRandomInt = initializeRandomInt(internalSeed);

    // insert lower pools
    for (let i = 0; i < brackets.length; i += 1) {
      const bracket = brackets[i];
      const targetIndex = createRandomInt(0, bracket.positionGap) + bracket.startIndex;
      const biasedPool = biasedLowerPoolsOrderedByInternalSeed.shift();
      if (biasedPool != null) {
        allPools.splice(targetIndex, 0, biasedPool);
      }
    }

    return { pools: allPools };
  } catch (err) {
    return { pools: unbiasedPools };
  }
}
