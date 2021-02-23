// @flow
import React from 'react';
import styled from 'styled-components';
import { SelectInput, SelectLabel } from './common/Inputs';
import { useViewProvider } from '../context/provider-context';

const WrapperSelectInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 1125px) {
    margin-left: 0;
  }
`;

const selectData = [
  {
    label: 'Adapools (Advanced)',
    value: 'adapools',
  },
  {
    label: 'Daedalus Official (Simple)',
    value: 'daedalus_simple',
  },
];

function ProviderSelect(): React$Node {
  const [provider, setProvider] = useViewProvider()
  const handleChange = (e) => {
    setProvider(e.currentTarget.value);
  };

  return (
    <WrapperSelectInput>
      <SelectLabel htmlFor="sort">Provider:</SelectLabel>
      <SelectInput name="" id="sort" value={provider} onChange={handleChange}>
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
