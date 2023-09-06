// @flow
import React from 'react';
import type { Node } from 'react';
import sortingArrowDown from '../../assets/arrow-sorting-up.svg';
import sortingArrowDownDark from '../../assets/arrow-sorting-up-dark.svg';
import ArrowsIdle from '../../assets/arrows-idle.svg';
import ArrowsAscending from '../../assets/arrows-ascending.svg';
import ArrowsDescending from '../../assets/arrows-descending.svg';
import { SortingDirections } from '../../API/api';

type Props = {|
  label: string,
  sort?: Function | null,
  sortValue?: string,
  activeSort?: {|
    sort: string,
    sortDirection: string,
  |},
|};

function SortingIcon({
  isActiveCol,
  sortDirection,
}: {|
  isActiveCol: boolean,
  sortDirection?: string,
|}): Node {
  if (!isActiveCol || !sortDirection) return <img src={ArrowsIdle} alt="Inactive sorting" />;

  if (sortDirection === SortingDirections.DESC)
    return <img src={ArrowsDescending} alt="Sorting descending" />;

  if (sortDirection === SortingDirections.ASC)
    return <img src={ArrowsAscending} alt="Sorting Ascending" />;

  throw new Error('Unkown sorting case. Should never happen');
}

export default function Label({ label, sortValue, sort, activeSort }: Props): Node {
  const { sort: sortCol, sortDirection } = activeSort || {};
  const isActiveCol = sortCol === sortValue;

  return (
    <div
      role="none"
      style={{
        display: 'flex',
        userSelect: 'none',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: 0,
      }}
      onClick={() => sort && sort(sortValue)}
    >
      <span className="label" style={{ lineHeight: 'normal', paddingLeft: 2 }}>
        {label}
      </span>
      {sort && <SortingIcon isActiveCol={isActiveCol} sortDirection={sortDirection} />}
    </div>
  );
}
