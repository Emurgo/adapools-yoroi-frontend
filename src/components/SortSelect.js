// @flow
import React from 'react';
import styled from 'styled-components';
import type { SortingEnum } from '../API/api';
import { SelectInput, SelectLabel } from './common/Inputs';

const WrapperSelectInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 1125px) {
    margin-left: 0;
  }
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

function SortSelect({ filter }: Props): React$Node {
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
      <SelectLabel htmlFor="sort">Sort by:</SelectLabel>
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

export default SortSelect;
