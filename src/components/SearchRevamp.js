// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import closeIcon from '../assets/close-icon-revamp.svg';
import searchIcon from '../assets/search-icon.svg';

const Form = styled.form`
  display: flex;
  position: relative;
  margin-right: 1px;
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

  :focus {
    outline: 1px solid #242838;
  }
`;
const SearchBtn = styled.button`
  position: absolute;
  top: 50%;
  left: 0px;
  transform: translateY(-50%);
  padding: 0px 8px;
  background: transparent;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ClearBtn = styled.button`
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  padding: 0px 8px;
  background: transparent;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

type Props = {|
  filter: Function,
|};

const SearchRevamp = ({ filter }: Props): Node => {
  const [prevSearch, setPrevSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const callSearchFunction = (e) => {
    e.preventDefault();

    if (prevSearch !== searchValue) {
      filter(searchValue);
      setPrevSearch(searchValue);
    }
  };

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
    callSearchFunction(e);
  };

  return (
    <Form className="search">
      <SearchBtn onClick={callSearchFunction} type="submit">
        <img src={searchIcon} alt="Search" />
      </SearchBtn>
      <SearchInput
        value={searchValue}
        onChange={handleSearchInputChanges}
        placeholder="Search stake pool"
        type="text"
      />
      {searchValue.length > 0 &&   
      <ClearBtn
        onClick={(e) => {
          setSearchValue('');
          callSearchFunction(e);
        }}
      >
        <img src={closeIcon} alt="Clear Input" />
      </ClearBtn>
      }
    
    </Form>
  );
};

export default SearchRevamp;
