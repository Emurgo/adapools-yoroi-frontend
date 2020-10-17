/* eslint-disable indent */
import React from 'react';
import styled from 'styled-components';

const RoaElement = styled.div`
  height: 26px;
  text-align: center;
  padding: 3px 0;
  border: 1px solid #dee2ea;
  border-radius: 8px;
  color: #2B2C32;
  font-size: 14px;
`;

function getColor($value, h = 80) {
    const $hue = (1 - $value) * 120;
    return `hsl(${$hue}, ${h}%, ${h}%)`
}

function sum(input){

    if (toString.call(input) !== "[object Array]")
        return false;

    var total =  0;
    for(var i=0;i<input.length;i++)
    {
        if(isNaN(input[i])){
            continue;
        }
        total += Number(input[i]);
    }
    return total;
}

function graph(data) {
    let json = JSON.parse(JSON.stringify(data));
    let arr = [];

    arr = Object.keys(json).map((key => json[key].val));

    let avg = sum(arr) / arr.length;

    const trend = arr.slice(0, 10).map((val,key) => {

        return (
            <div key={key}
                style={{
                    width: 2,
                    display : 'inline-block',
                    height: Math.min(12,Math.max(2, Math.ceil(12 * val / avg))),
                    backgroundColor: getColor(1 - Math.min(1,val / avg), 45)
                }}
            ></div>
        )
    });

    return trend;

}

function CardRoa({ roa, data, description }: Props) {


  return (
    <div>
      <RoaElement>
        {description}
        {parseFloat(roa) === 0 ? 'unknown' : parseFloat(roa).toFixed(2)+'% '}
        {graph(data)}
      </RoaElement>
    </div>
)
}

export default CardRoa;
