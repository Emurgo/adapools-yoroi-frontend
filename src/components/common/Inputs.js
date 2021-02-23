// @flow
import styled from 'styled-components';
import arrowDownIcon from '../../assets/arrow-select-down.svg';

const SelectLabel: any = styled.label`
  color: #676970;
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 6px;
`;
const SelectInput: any = styled.select`
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

export { SelectLabel, SelectInput };
