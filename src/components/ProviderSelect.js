// @flow
import React from 'react';
import styled from 'styled-components';
import type { ProviderEnum } from '../API/api';
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
  setProvider: Function,
|};

const selectData = [
  {
    label: 'Adapools (Advanced)',
    value: 'adapools',
  },
  {
    label: 'Daedalus Official (Simple)',
    value: 'daedalus-simple',
  },
];

function ProviderSelect({ setProvider }: Props): React$Node {
  const [selectValue, setSelectValue] = React.useState<ProviderEnum>('adapools');

  const handleChange = (e) => {
    setSelectValue(e.currentTarget.value);
    setProvider(e.currentTarget.value);
  };

  return (
    <WrapperSelectInput>
      <SelectLabel htmlFor="sort">Provider:</SelectLabel>
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

export default ProviderSelect;
