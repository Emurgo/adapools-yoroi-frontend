import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import styled from "styled-components";
import poolData from "../API/data";
import StakingPoolCard from "../components/StakingPoolCard";
import PoolSizeCard from "../components/PoolSizeCard";
import CostsCard from "../components/CostsCard";
import PledgeCard from "../components/PledgeCard";
import { DesktopOnly, MobileOnly } from "../components/layout/Breakpoints";
import {
  roundInteger,
  roundTwoDecimal,
  formatBigNumber,
  roundOneDecimal,
} from "../utils/utils";

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
const WrapperSelectInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 1023px) {
    margin-left: 0;
  }
  label {
    color: #676970;
    font-size: 12px;
    line-height: 20px;
  }
`;

const SelectInput = styled.select`
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
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 36px;
  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: center;
    input {
      margin-bottom: 20px;
    }
  }
`;
const TableContent = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  /* border-collapse: separate; */
  border-spacing: 0 0.8rem;
  thead {
    border-bottom: 3px solid rgba(56, 57, 61, 0.2);
    th {
      &:first-child {
        text-align: left;
      }
      &:not(:first-child) {
        text-align: right;
      }
      color: #6b7384;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;
      padding: 20px 20px 20px 0;
    }
  }
  tbody {
    tr {
      border-bottom: 2px solid #dee2ea;
    }
    td {
      padding-right: 20px;
      &:not(:first-child) {
        text-align: right;
      }
    }
  }
`;
const Button = styled.button`
  box-sizing: border-box;
  height: 40px;
  width: 120px;
  border: 2px solid #15d1aa;
  font-size: 14px;
  color: #15d1aa;
  background: none;
  border-radius: 8px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const CardMobile = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  padding: 11px 16px;
`;
const WrapperContent = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  .label {
    color: #6b7384;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .item {
    flex: 1;
  }
`;

function Home() {
  const [rowData, setRowData] = useState(null);
  // const [searchValue, setsearchValue] = useState(null);

  function formatCostLabel(tax_computed, tax_fix) {
    return `${roundInteger(tax_computed)}% + ${parseInt(tax_fix) / 1000000}`;
  }

  useEffect(() => {
    setRowData(poolData.pools);
  }, [rowData]);

  return (
    <Layout>
      <h1 style={{ textAlign: "center", margin: "30px 0 50px" }}>
        Delegation Page
      </h1>
      <Header>
        <SearchInput type="text" placeholder="Search by Id" />
        <WrapperSelectInput>
          <label htmlFor="sort">Sort by:</label>
          <SelectInput name="" id="sort">
            <option value="">Name</option>
            <option value="">Costs</option>
          </SelectInput>
        </WrapperSelectInput>
      </Header>

      <DesktopOnly>
        <TableContent>
          <Table>
            <thead>
              <tr>
                <th>Staking Pool</th>
                <th>Pool Size</th>
                <th>Costs</th>
                <th>Pledge</th>
                <th>Blocks</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rowData &&
                Object.entries(rowData).map(([key, value]) => (
                  <tr key={value.id}>
                    <td>
                      <StakingPoolCard
                        id={value.id}
                        avatar={value.pool_pic}
                        fullname={value.fullname}
                      />
                    </td>
                    <td>
                      <PoolSizeCard
                        percentage={roundOneDecimal(value.total_size)}
                        value={formatBigNumber(value.total_stake)}
                      />
                    </td>
                    <td>
                      <CostsCard
                        percentage={roundTwoDecimal(value.tax_computed)}
                        value={formatCostLabel(
                          value.tax_computed,
                          value.tax_fix
                        )}
                      />
                    </td>
                    <td>
                      <PledgeCard value={formatBigNumber(value.pledge)} />
                    </td>
                    <td>_{value.blocks_epoch}</td>
                    <td>
                      <Button>Delegate</Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </TableContent>
      </DesktopOnly>
      <MobileOnly>
        {rowData &&
          Object.entries(rowData).map(([key, value]) => (
            <CardMobile key={value.id}>
              <StakingPoolCard
                id={value.id}
                avatar={value.pool_pic}
                fullname={value.fullname}
              />
              <WrapperContent style={{ display: "flex" }}>
                <div className="item">
                  <div className="label">Pool Size</div>
                  <PoolSizeCard
                    percentage={roundOneDecimal(value.total_size)}
                    value={formatBigNumber(value.total_stake)}
                  />
                </div>
                <div className="item">
                  <div className="label">Costs</div>
                  <CostsCard
                    percentage={roundTwoDecimal(value.tax_computed)}
                    value={formatCostLabel(value.tax_computed, value.tax_fix)}
                  />
                </div>
                <div className="item">
                  <div className="label">Costs</div>
                  <PledgeCard value={formatBigNumber(value.pledge)} />
                </div>
              </WrapperContent>
              <div>
                <Button style={{ width: "100%" }}>Delegate</Button>
              </div>
            </CardMobile>
          ))}
      </MobileOnly>
    </Layout>
  );
}

export default Home;
