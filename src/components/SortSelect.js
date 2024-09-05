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

const SelectInput = styled('select')(({ isDark }) => ({
  height: '40px',
  display: 'block',
  fontSize: '14px',
  lineHeight: '1.3', // Adjusted to match the duplicate property
  color:isDark ? '#7C85A3' :'#2b2c32',
  padding: '0.6em 1.4em 0.5em 0.8em',
  width: '322px',
  margin: 0,
  border:isDark ? '1px solid #a7afc0' : 'none',
  borderRadius: '8px',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none',
  backgroundColor: isDark ? 'transparent' : '#f0f3f5',
  backgroundImage: `url(${arrowDownIcon})`,
  backgroundRepeat: 'no-repeat, repeat',
  backgroundPosition: 'right 0.7em top 50%, 0 0',
  backgroundSize: '24px auto, 100%',
}));

type Props = {|
  filter: Function,
  isRevamp?: boolean,
  isDark?: boolean,
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
  { label: 'Saturation', value: Sorting.SATURATION },
  { label: 'Costs', value: Sorting.COSTS },
  { label: 'Pledge', value: Sorting.PLEDGE },
  { label: 'Blocks', value: Sorting.BLOCKS },
];

function SortSelect({ filter, isRevamp = true, isDark }: Props): React$Node {
  const [selectValue, setSelectValue] = React.useState<SortingEnum>('score');

  const handleChange = (e) => {
    setSelectValue(e.currentTarget.value);
    filter(e.currentTarget.value);
  };

  return (
    <WrapperSelectInput>
      <label htmlFor="sort">Sort by:</label>
      <SelectInput name="" id="sort" value={selectValue} onChange={handleChange} isDark={isDark}>
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
