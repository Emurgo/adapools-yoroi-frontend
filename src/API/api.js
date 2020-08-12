// @flow

import axios from 'axios';
import { BACKEND_URL } from '../manifestEnvs';

const backendUrl: string = BACKEND_URL;

export type HistBPE = {|
    +val: string,
    +time: string,
    +e: number
|}

export type SocialMediaHandles = {|
        "tg": ?string,
        "fb": ?string,
        "yt": ?string,
        "tc": ?string,
        "di": ?string,
        "gh": ?string,
        "icon": ?string
|}

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
    +hist_bpe: Array<HistBPE>, // hasmap from server
    +hist_roa: any, // no examples yet. similar to bpe?
    +score: number,
    +handles: SocialMediaHandles, // social media stuff
    +last_rewards: string,
    +position: number
|};

export type World = {|
    +epoch: number, // string from api
    +slot: number, // string from api
    +stake: string,
    +supply: string, // number from api
    +pools: string,
    +price: number
|};

export const Sorting = Object.freeze({
    ROA: "roa",
    TICKER: "ticker",
});

export type SortingEnum = $Values<typeof Sorting>;

export type ApiPoolsResponse = {|
    world: World,
    pools: Array<Pool>
|}

export function getPools(
    search: string = '',
    sort: SortingEnum = Sorting.ROA,
    limit: number = 250,
    // cancelToken: boolean
): Promise<ApiPoolsResponse> {
    return axios(
        `${backendUrl}`,
        {
            // cancelToken: cancelToken,
            method: 'post',
            data: {
                limit: limit,
                sort: sort,
                search: search
            }
        }
    )
        .then(response => {
            return response.data.json()
        })
        .catch((error) => {
            console.log("API::getPools Error: ", error)
        })
}
