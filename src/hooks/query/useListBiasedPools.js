// @flow
import { useQuery } from 'react-query';
import { listBiasedPools } from '../../API/api';
import type { Pool, SearchParams } from '../../API/api';

// eslint-disable-next-line import/prefer-default-export
export const useListBiasedPools = (seed: string, newSearch: SearchParams): Object => {
  const response = useQuery({
    queryKey: ['listBiasedPools', seed, newSearch],
    queryFn: () => listBiasedPools(seed, newSearch).then((pools: Pool[]) => pools),
  });
  return { ...response, poolList: response.data ?? [] };
};
