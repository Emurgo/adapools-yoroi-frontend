// @flow
import React from 'react';
import styled from 'styled-components';
import type { SortingEnum } from '../../API/api';
import arrowDownIcon from '../../assets/arrow-select-down.svg';

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
|};

const selectData = [
  {
    label: 'Ticker',
    value: 'ticker',
  },
  {
    label: 'Score',
    value: 'score',
  },
  // {
  //   label: 'ROA',
  //   value: 'roa',
  // },
];

function SortSelectClassic({ filter }: Props): React$Node {
  const [selectValue, setSelectValue] = React.useState<SortingEnum>('score');

  const handleChange = (e) => {
    setSelectValue(e.currentTarget.value);
    filter(e.currentTarget.value);
  };

  React.useEffect(() => {
    // async function getSortCategories() {
    //   const response = await fetchCategories();
    //   setItems(response.data.map(({ name }) => ({ label: name, value: name })));
    // }
    // getSortCategories();
  }, []);

  return (
    <WrapperSelectInput>
      <label htmlFor="sort">Sort by:</label>
      <SelectInput name="" id="sort" value={selectValue} onChange={handleChange}>
        {selectData.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectInput>
    </WrapperSelectInput>
  );
}

export default SortSelectClassic;
