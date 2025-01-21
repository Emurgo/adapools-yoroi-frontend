// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import searchIcon from '../assets/search-icon.svg';

const Form = styled.form`
  display: flex;
  position: relative;
  margin-right: 1px;
`;
const SearchInput = styled('input')(({ isDark, isLight }) => ({
  height: '40px',
  // eslint-disable-next-line no-nested-ternary
  backgroundColor: isDark ? 'transparent' : isLight ? '#EAEDF2' : '#fff',
  display: 'block',
  fontSize: '14px',
  lineHeight: '1.3', // Adjusted to match the duplicate property
  color: isDark ? '#E1E6F5' : '#2b2c32',
  padding: '9px 16px 9px 38px',
  width: '322px',
  margin: 0,
  border: '1px solid #4B5266',
  borderRadius: '8px',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none',
  outline: 'none',
  '::placeholder': {
    color: '#6b7384',
  },
  ':focus': {
    outline: '1px solid #242838',
  },
}));

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

const ClearBtn = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  right: '0px',
  transform: 'translateY(-50%)',
  padding: '0px 8px',
  background: 'transparent',
  outline: 'none',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '& svg': {
    '& path': {
      fill: '#7C85A3',
    },
  },
}));

type Props = {|
  filter: Function,
  isDark?: boolean,
  isLight?: boolean,
|};

const SearchRevamp = ({ filter, isDark, isLight }: Props): Node => {
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
        isDark={isDark}
        isLight={isLight}
      />
      {searchValue.length > 0 && (
        <ClearBtn
          onClick={(e) => {
            setSearchValue('');
            callSearchFunction(e);
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L12 10.5858L5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L12 13.4142L18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711Z"
              fill="black"
            />
          </svg>
        </ClearBtn>
      )}
    </Form>
  );
};

export default SearchRevamp;
