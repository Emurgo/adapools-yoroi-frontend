// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
`;
const SearchInput = styled.input`
  height: 40px;
  background-color: #f0f3f5;
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: #2b2c32;
  line-height: 1.3;
  padding: 0.6em 44px 0.5em 0.8em;
  width: 322px;
  margin: 0;
  border: none;
  border-radius: 8px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #f0f3f5;
  outline: none;
  ::placeholder {
    color: #c4cad7;
  }
`;
const InputBtn = styled.button`
  background: #17d1aa;
  height: 40px;
  margin: 0;
  border: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 0 8px 8px 0;
  padding: 0.6em 0.9em 0.5em 0.9em;
  margin-left: -44px;
  i {
    color: white;
  }
`;

type Props = {|
  filter: Function,
|};

const Search = ({ filter }: Props): Node => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  };

  const callSearchFunction = (e) => {
    e.preventDefault();
    filter(searchValue);
  };

  return (
    <Form className="search">
      <SearchInput
        value={searchValue}
        onChange={handleSearchInputChanges}
        placeholder="Search By Id or Name"
        type="text"
      />

      <InputBtn onClick={callSearchFunction} type="submit">
        <i className="fas fa-search" />
      </InputBtn>
    </Form>
  );
};

export default Search;
