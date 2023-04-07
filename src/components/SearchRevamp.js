// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
`;
const SearchInput = styled.input`
  height: 40px;
  background-color: #fff;
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: #2b2c32;
  line-height: 1.3;
  padding: 9px 16px 9px 38px;
  width: 322px;
  margin: 0;
  border: 1px solid #a7afc0;
  border-radius: 8px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  ::placeholder {
    color: #6b7384;
  }
`;
const InputBtn = styled.button`
  position: relative;
  z-index: 10;
  height: 40px;
  margin: 0;
  margin-right: -38px;
  border: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  padding: 10px;
  background: transparent;
  cursor: pointer;
  i {
    color: #6b7384;
  }
`;

type Props = {|
  filter: Function,
|};

const SearchRevamp = ({ filter }: Props): Node => {
  const [prevSearch, setPrevSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  };

  const callSearchFunction = (e) => {
    e.preventDefault();

    if (prevSearch !== searchValue) {
      filter(searchValue);
      setPrevSearch(searchValue);
    }
  };

  return (
    <Form className="search">
      <InputBtn onClick={callSearchFunction} type="submit">
        <i className="fas fa-search" />
      </InputBtn>
      <SearchInput
        value={searchValue}
        onChange={handleSearchInputChanges}
        placeholder="Search stake pool"
        type="text"
      />
    </Form>
  );
};

export default SearchRevamp;
