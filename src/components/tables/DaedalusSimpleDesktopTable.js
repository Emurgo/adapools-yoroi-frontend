// @flow
import React from 'react';
import styled from 'styled-components';
import type { PoolDaedalusSimple } from '../../API/api';
import StakingPoolCard from '../StakingPoolCard';
import { roundInteger } from '../../utils/utils';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import type { QueryState } from '../../utils/types';
import type { DelegationProps } from '../../containers/HomeContainer';
import PotentialRewardCard from '../PotentialRewardCard';
import AlertsCard from '../AlertsCard';
import Loader from '../common/Loader';

const TableContent = styled.div`
  display: inline-flex;
  align-items: flex-end;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-spacing: 0 0.8rem;
  position: relative;
  table-layout: fixed;
  tr td {
    white-space: nowrap;
  }
  thead {
    &:after {
      content: '';
      width: 100%;
      height: 6px;
      position: absolute;
      left: 0;
      right: 0;
      box-shadow: inset 0 -1px 10px 0 rgba(255, 255, 255, 0.5),
        inset 0 2px 4px 0 rgba(56, 57, 61, 0.2), 0 1px 3px 0 rgba(255, 255, 255, 0.5);
    }
    th {
      &:not(:first-child) {
        text-align: right;
      }
      color: #6b7384;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;
      padding: 20px 20px 20px 0;
      &:first-child > div,
      &:nth-child(2) > div {
        justify-content: flex-start;
        text-align: left;
      }
    }
  }
  tbody {
    tr {
      border-bottom: 2px solid #dee2ea;
    }
    td {
      &:not(:first-child) {
        padding-right: 20px;
        text-align: right;
      }
    }
  }
  [class^='col'] {
    width: 90px;
  }
  .col-0 {
    width: 44px;
  }
  .col-1 {
    width: 200px;
  }
  .col-2 {
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 115px;
    }
  }
  .col-3 {
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 115px;
    }
  }
  .col-4 {
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 110px;
    }
  }
  .col-5 {
    width: 130px;
    @media (min-width: 1125px) and (max-width: 1200px) {
      width: 110px;
    }
  }
  .col-last {
    width: 120px;
  }
`;

const RankLabel = styled.p`
  padding-left: 6px;
`;

type Props = {|
  data: ?Array<PoolDaedalusSimple>,
  delegateFunction: (DelegationProps, ?number) => void,
  +status: QueryState,
  selectedIdPools: ?Array<string>,
  totalAda: ?number,
|};
// TODO: fix
export const mockProfileData = {
  pool_id: '00000036d515e12e18cd3c88c74f09a67984c2c279a5296aa96efe89',
  pool_pic: null,
  db_ticker: 'ATADA',
  db_name: 'ATADA Stakepool Austria',
  handles: {
    tw: 'ATADA_Stakepool',
    tg: 'atada_stakepool_austria',
    fb: 'ATADA.StakePool.Austria',
    yt: '',
    tc: '',
    di: '',
    gh: 'gitmachtl',
    icon: 'https://stakepool.at/apple-icon-60x60.png',
  },
  fullname:
    '<a href="https://twitter.com/ATADA_Stakepool" target="_blank" rel="nofollow"><i class="fa fa-twitter"></i></a> <a href="https://t.me/atada_stakepool_austria" target="_blank" rel="nofollow"><i class="fa fa-telegram"></i></a> <a href="https://fb.me/ATADA.StakePool.Austria" target="_blank" rel="nofollow"><i class="fa fa-facebook"></i></a> <a href="https://github.com/gitmachtl" target="_blank" rel="nofollow"><i class="fa fa-github-alt"></i></a> <a href="https://stakepool.at?utm_source=adapools.org" target="_blank" rel="nofollow"><i class="fa fa-link"></i></a> <a href="https://adapools.org/pool/00000036d515e12e18cd3c88c74f09a67984c2c279a5296aa96efe89">[ATADA] ATADA Stakepool Austria</a>',
};

function DaedalusSimpleDesktopTable({
  data,
  delegateFunction,
  status,
  selectedIdPools,
  totalAda,
}: Props): React$Node {
  const isLoading = status === 'pending' || status === 'idle';
  const isRejected = status === 'rejected';
  const isResolved = status === 'resolved';

  if (isResolved && data != null && data.length <= 0) {
    return <h1 style={{ fontWeight: 400 }}>No results found.</h1>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isRejected) {
    return <h1>Oops! something wrong happened. Try again!</h1>;
  }

  const tableTheads = [
    {
      id: 0,
      label: 'Rank',
      textInfo: null,
    },
    {
      id: 1,
      label: 'Name',
      textInfo: null,
    },
    {
      id: 2,
      label: 'Potential Reward Per Epoch',
      textInfo: 'Lorem ipsum Lorem ipsumLorem ipsum Lorem ipsum',
    },
    {
      id: 3,
      label: 'Potential Reward Per Month',
      textInfo: 'Lorem ipsum Lorem ipsumLorem ipsum Lorem ipsum',
    },
    {
      id: 4,
      label: 'Potential Reward Per Year',
      textInfo: 'Lorem ipsum Lorem ipsumLorem ipsum Lorem ipsum',
    },
    {
      id: 5,
      label: 'Alerts',
      textInfo: null,
    },
  ];
  const daysPerEpoch = 5;
  return (
    <TableContent>
      <Table>
        <thead>
          <tr role="row">
            {tableTheads.map((item) => (
              <th key={`col-${item.id}`} scope="col" className={`col-${item.id}`}>
                <Tooltip label={item.label} textInfo={item.textInfo ?? ''} />
              </th>
            ))}
            <th className="col-last" />
          </tr>
        </thead>
        <tbody>
          {data != null &&
            data.map((pool, idx) => (
              <tr role="row" key={pool.pool_id}>
                {/* TODO: fix ranking, percentages */}
                <td>
                  <RankLabel>{idx + 1}</RankLabel>
                </td>
                <td>
                  {/* TODO: Get Profile Info */}
                  <StakingPoolCard
                    id={mockProfileData.pool_id}
                    avatar={mockProfileData.pool_pic}
                    tickerName={mockProfileData.db_ticker}
                    name={mockProfileData.db_name}
                    links={mockProfileData.handles}
                    fullname={mockProfileData.fullname}
                  />
                </td>
                <td>
                  <PotentialRewardCard
                    value={roundInteger(pool.non_myopic_member_rewards)}
                    percentage="0.10"
                  />
                </td>
                <td>
                  <PotentialRewardCard
                    value={roundInteger((pool.non_myopic_member_rewards * 30) / daysPerEpoch)}
                    percentage="0.10"
                  />
                </td>
                <td>
                  <PotentialRewardCard
                    value={roundInteger((pool.non_myopic_member_rewards * 365) / daysPerEpoch)}
                    percentage="0.10"
                  />
                </td>
                <td>
                  {/* TODO: */}
                  <AlertsCard
                    isSaturated={idx !== 0 && idx % 6 === 0}
                    isRetiring={idx % 7 === 0}
                    isNew={idx !== 0 && idx % 3 === 0}
                    isChanging={idx % 9 === 0}
                  />
                </td>
                <td>
                  {/* $FlowFixMe: */}
                  <Button
                    disabled={selectedIdPools != null && selectedIdPools.indexOf(pool.pool_id) > -1}
                    // onClick={() =>
                    //   delegateFunction(
                    // {
                    //   // $FlowFixMe:
                    //   stakepoolName: pool.db_name,
                    //   stakepoolTotalStake: pool.total_stake,
                    //   isAlreadySaturated: pool.saturation >= 1,
                    //   id: pool.id,
                    // },
                    // totalAda,
                    //   )
                    // }
                  >
                    Delegate
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </TableContent>
  );
}

export default DaedalusSimpleDesktopTable;
