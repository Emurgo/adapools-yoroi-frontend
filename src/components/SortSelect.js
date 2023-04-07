// @flow
import React from 'react';
import styled from 'styled-components';
import { Sorting } from '../API/api';
import type { SortingEnum } from '../API/api';
import arrowDownIcon from '../assets/arrow-select-down.svg';

const WrapperSelectInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 1125px) {
    margin-left: 0;
  }
  label {
    color: #676970;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 6px;
  }
`;

const SelectInput = styled.select`
  height: 40px;
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: #2b2c32;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 322px;
  margin: 0;
  border: none;
  border-radius: 8px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #f0f3f5;
  background-image: url(${arrowDownIcon});
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 24px auto, 100%;
`;

type Props = {|
  filter: Function,
  isRevamp?: boolean,
|};

export const sortingSelectData = [
  { label: 'Score', value: Sorting.SCORE }, // default option on load
  { label: 'Ticker and name', value: Sorting.TICKER },
];

export const sortingSelectDataRevamp = [
  { label: 'Score', value: Sorting.SCORE }, // default option on load
  { label: 'Ticker and name', value: Sorting.TICKER },
  { label: 'ROA', value: Sorting.ROA },
  { label: 'Pool size', value: Sorting.POOL_SIZE },
  { label: 'Share', value: Sorting.SHARE },
  { label: 'Costs', value: Sorting.COSTS },
  { label: 'Pledge', value: Sorting.PLEDGE },
  { label: 'Blocks', value: Sorting.BLOCKS },
];

function SortSelect({ filter, isRevamp = true }: Props): React$Node {
  const [selectValue, setSelectValue] = React.useState<SortingEnum>('score');

  const handleChange = (e) => {
    setSelectValue(e.currentTarget.value);
    filter(e.currentTarget.value);
  };

  return (
    <WrapperSelectInput>
      <label htmlFor="sort">Sort by:</label>
      <SelectInput name="" id="sort" value={selectValue} onChange={handleChange}>
        {(isRevamp ? sortingSelectDataRevamp : sortingSelectData).map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectInput>
    </WrapperSelectInput>
  );
}

export default SortSelect;
