// @flow
import React from 'react';
import type { Node } from 'react';
import sortingArrowDown from '../../assets/arrow-sorting-up.svg';
import sortingArrowDownDark from '../../assets/arrow-sorting-up-dark.svg';
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
      }}
      onClick={() => sort && sort(sortValue)}
    >
      <span className="label" style={{ lineHeight: 'normal', paddingLeft: 2 }}>
        {label}
      </span>
      {sort && (
        <span
          style={{
            display: 'inline-flex',
            flexFlow: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: '2px',
          }}
        >
          <img
            src={
              isActiveCol && sortDirection === SortingDirections.DESC
                ? sortingArrowDownDark
                : sortingArrowDown
            }
            alt="sorting"
          />
          <img
            style={{
              transform: 'matrix(1, 0, 0, -1, 0, 0)',
            }}
            src={
              isActiveCol && sortDirection === SortingDirections.ASC
                ? sortingArrowDownDark
                : sortingArrowDown
            }
            alt="sorting"
          />
        </span>
      )}
    </div>
  );
}
