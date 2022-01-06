// @flow
import { useQuery } from 'react-query';
import { listBiasedPools } from '../../API/api';
import type { Pool, SearchParams } from '../../API/api';
import { SendFirstAdapool } from '../../API/yoroi';

export const useListBiasedPools = (
  seed: string,
  newSearch: SearchParams,
  config: ?Object,
): Object => {
  const response = useQuery({
    queryKey: ['listBiasedPools', seed, newSearch],
    queryFn: () => listBiasedPools(seed, newSearch).then((pools: Pool[]) => pools),
    config,
  });
  return { ...response, poolList: response.data ?? [] };
};

export const useListBiasedPoolsRevamp = (seed: string, newSearch: SearchParams): Object => {
  const response = useQuery({
    queryKey: ['listBiasedPools', seed, newSearch],
    queryFn: () => listBiasedPools(seed, newSearch).then((pools: Pool[]) => pools),
    onSuccess: (pools) => {
      // used to show the first pool in revamp banner
      SendFirstAdapool(pools[0]);
    },
  });
  return { ...response, poolList: response.data ?? [] };
};
