// @flow

import React, { useState } from "react";
import styled from "styled-components";

const SearchInput = styled.input`
  height: 40px;
  background-color: #f0f3f5;
  height: 40px;
  display: block;
  font-size: 14px;
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
  ::placeholder {
    color: #c4cad7;
  }
`;

const Search = ({ search }: (string) => void) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchInputChanges = e => {
        setSearchValue(e.target.value);
    };

    const resetInputField = () => {
        setSearchValue("");
    };

    const callSearchFunction = e => {
        e.preventDefault();
        search(searchValue);
        resetInputField();
    };

    return (
        <form className="search">
            <input
                value={searchValue}
                onChange={handleSearchInputChanges}
                type="text"
            />

            <input onClick={callSearchFunction} type="submit" value="SEARCH" />
        </form>
    );
};

export default Search;