// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import PoolSaturationTag from './PoolSaturationTag';
import PledgeCard from './PledgeCard';

const Wrapper = styled.div`
  padding: 24px 20px;
  .section {
    margin-bottom: 40px;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    color: #6B7384;
  }
  .subtitle {
    color: #6B7384;
    font-size: 14px;
    line-height: 22px;
    margin-top: 4px;
    margin-bottom: 24px;
  }
  .range-row {
    display: flex;
    align-items: center;
    margin-bottom: 24px; 
    & > div:first-child {
      margin-right: 20px;
    }
  }
  .pledge-row {
    margin-top: 24px;
  }
  .description {
    color: #2B2C32;
    font-size: 14px;
    line-height: 22px;
  }
`;

const colorsLegend = [
  {
    text: 'Pool Size',
    piechart: true,
    subtitle: 'How close the pool is to its limit / Total stake in the pool',
    ranges: [
      {
        id: 0,
        value: 0.0,
        description: '0.0% - 0.1% Lorem ipsum dolor sit amet, consectetur elit.',
      },
      {
        id: 1,
        value: 0.2,
        description: '0.2% Lorem ipsum dolor sit amet, consectetur elit.',
      },
      {
        id: 3,
        value: 0.3,
        description: '0.3% Lorem ipsum dolor sit amet, consectetur elit.',
      },
      {
        id: 4,
        value: 0.4,
        description: '0.4% Lorem ipsum dolor sit amet, consectetur elit.',
      },
      {
        id: 5,
        value: 0.5,
        description: '0.5% Lorem ipsum dolor sit amet, consectetur elit.',
      },
      {
        id: 6,
        value: 0.6,
        description: '0.6% Lorem ipsum dolor sit amet, consectetur elit.',
      },
    ],
  },
  {
    text: 'Pledge',
    piechart: false,
    subtitle: null,
    ranges: [
      {
        id: 0,
        value: 2e9,
        description: '0.00k - 50.00k Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 1,
        value: 75e9,
        description: '50.00k - 100.00k Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 3,
        value: 111e9,
        description: '100.00k - 150.00k Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 4,
        value: 400e9,
        description: '150.00k - 1.00M Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: 5,
        value: 1.03e12,
        description: '< 1.00M Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ],
  },
];

function ColoursModal(): Node {
  return (
    <Wrapper>
      {colorsLegend.map(({ text, subtitle, ranges, piechart }) => (
        <div key={text} className="section">
          <h3 className="title">{text}</h3>
          {subtitle && <p className="subtitle">{subtitle}</p>}
          {piechart ?
            ranges.map(({ id, value, description }) => (
              <div key={id} className="range-row">
                <PoolSaturationTag value={value} />
                <p className="description">{description}</p>
              </div>
            )) :
            ranges.map(({ id, value, description }) => (
              <div key={id} className="range-row pledge-row">
                <PledgeCard value={value} />
                <p className="description">{description}</p>
              </div>
            ))
          }
        </div>
      ))}
    </Wrapper>
  );
}

export default ColoursModal;
