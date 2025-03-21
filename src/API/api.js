// @flow

import axios from 'axios';
import seedrandom from 'seedrandom';
import { BACKEND_URL } from '../manifestEnvs';

const backendUrl: string = BACKEND_URL;

const BIAS_POOL_IDS = [
  // 'dbda39c8d064ff9801e376f8350efafe67c07e9e9244dd613aee5125', // EMURA
  // '359d3f8e355c873b0b5cae1e18eb12e44dcfc2ad212706d93ac314ab', // EMURB
  // '8efb053977341471256685b1069d67f4aca7166bc3f94e27ebad217f', // EMUR7
  // '0ef7aa564933ce75b695cdad66be4a39b43a22726de7c58908e0e033', // EMUR8
  '2a8294ad7538b15353b9ffd81e26dafe846ffc3f6b9e331d4c1dc030', // YORO1
  // 'b19f2d9498845652ae6eea5da77952b37e2bca9f59b2a98c56694cae', // YORO2
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
  +id_bech: string, // hash
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
  +saturation: number,
|};

export const Sorting = Object.freeze({
  TICKER: 'ticker',
  SCORE: 'score',
  ROA: 'roa',
  POOL_SIZE: 'poolSize',
  SATURATION: 'saturation',
  COSTS: 'costs',
  PLEDGE: 'pledge',
  BLOCKS: 'blocks',
});

export const SortingDirections = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

export type SortingEnum = $Values<typeof Sorting>;
export type SortingDirEnum = $Values<typeof SortingDirections>;

export type SearchParams = {|
  limit?: number,
  search?: string,
  sort?: SortingEnum,
  sortDirection?: SortingDirEnum,
|};

export type ApiPoolsResponse = {|
  world?: World,
  pools?: {| [string]: Pool |},
|};

const toPoolArray: (?{| [string]: Pool |}) => Array<Pool> = (pools) => {
  if (pools == null) return [];
  return Object.keys(pools)
    .map((key) => pools[key])
    .filter((x) => x != null);
};

export function getPools(body: SearchParams): Promise<ApiPoolsResponse> {
  const requestBody = {
    ...{ search: '', sort: Sorting.SCORE, limit: 250 },
    ...body,
  };

  const encodeForm = (data) => {
    return (Object.keys(data): any)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  };

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
        pools: {},
      };
    });
}

const rndSign = (seed: string) => {
  const rnd = seedrandom(seed);
  return () => {
    return Math.sign(rnd() * 2 - 1);
  };
};

const sortBiasedPools = (pools: Array<Pool>, seed: string): Array<Pool> => {
  const rev = seed.split('').reverse().join('');
  return [...pools].sort(rndSign(seed)).sort(rndSign(rev));
};

function getRandomInt(seed: string, min: number, max: number) {
  const rnd = seedrandom(seed);
  const intMin = Math.ceil(min);
  const intmax = Math.floor(max);
  return Math.floor(rnd() * (intmax - intMin + 1)) + intMin;
}

const tail = (input: string): string => {
  return input?.slice(-10) ?? '';
};

export type ListBiasedPoolsResponse = {|
  pools: Pool[],
  saturationLimit: ?number,
|};

export async function listBiasedPools(
  externalSeed: string,
  searchParams: SearchParams,
): Promise<ListBiasedPoolsResponse> {
  const unbiasedPoolsResponse = await getPools(searchParams);
  const originalPools = toPoolArray(unbiasedPoolsResponse.pools);

  const saturationLimit = unbiasedPoolsResponse.world?.saturation;

  if (searchParams.search || searchParams.sort === Sorting.TICKER) {
    // If user searched or sorted explicitly - then we don't bias
    return { pools: originalPools, saturationLimit };
  }

  // Filter unsaturated pools
  const unbiasedPools = saturationLimit == null ? originalPools
    : originalPools.filter(p => Number(p.total_stake) < saturationLimit);

  const [p1, p2, p3] = unbiasedPools;
  const internalSeed = tail(p1?.id) + tail(p2?.id) + tail(p3?.id);

  try {
    const biasedPoolsResponse = await getPools({ search: BIAS_POOLS_SEARCH_QUERY });
    if (!biasedPoolsResponse) return { pools: unbiasedPools, saturationLimit };
    const biasedPools = toPoolArray(biasedPoolsResponse.pools)
      .filter((x) => x.id && BIAS_POOL_IDS.indexOf(x.id) >= 0)
      .sort((a, b) => {
        // this sorting is to ensure that changes in the backend response order is not affecting the final ordering
        return BIAS_POOL_IDS.indexOf(a.id) - BIAS_POOL_IDS.indexOf(b.id);
      });
    if (biasedPools.length === 0) return { pools: unbiasedPools, saturationLimit };
    const biasedPoolsOrderByExternalSeed = sortBiasedPools(biasedPools, externalSeed);

    const topPool = biasedPoolsOrderByExternalSeed[0];

    const biasedLowerPools = biasedPools.filter((p) => p !== topPool);
    const biasedLowerPoolsOrderedByInternalSeed = sortBiasedPools(biasedLowerPools, internalSeed);

    if (unbiasedPools.length === 0) return { pools: [topPool].concat(biasedLowerPoolsOrderedByInternalSeed), saturationLimit };

    // removes the Emurgo pools from the original list, as we are reinserting it later
    const presentBiasedIds = new Set(biasedPools.map(p => p.id));
    const filteredUnbiasedPools = unbiasedPools.filter(p => !presentBiasedIds.has(p.id));

    // insert top pool
    const allPools = [topPool].concat(filteredUnbiasedPools);

    // insert lower pools
    for (let i = 0; i < brackets.length; i += 1) {
      const bracket = brackets[i];
      const targetIndex = getRandomInt(internalSeed, 0, bracket.positionGap) + bracket.startIndex;
      const biasedPool = biasedLowerPoolsOrderedByInternalSeed.shift();
      if (biasedPool != null) {
        allPools.splice(targetIndex, 0, biasedPool);
      }
    }

    return { pools: allPools, saturationLimit };
  } catch (err) {
    return { pools: unbiasedPools, saturationLimit };
  }
}

export function listPools(): Promise<ApiPoolsResponse> {
  return getPools(({}: any));
}
