export function roundOneDecimal(num) {
  const fNum = Number(num);
  return Math.round(fNum * 10) / 10;
}

export function roundTwoDecimal(num) {
  const fNum = Number(num);
  return (Math.round(fNum * 100) / 100).toFixed(2);
}

export function roundInteger(num) {
  const fNum = Number(num);
  return (Math.round(fNum * 100) / 100).toFixed(0);
}

export function formatBigNumber(num) {
  const fNum = Number(num);
  if (fNum >= 1e3) {
    var units = ["K", "M", "B", "T"];
    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    let unit = Math.floor((fNum.toFixed(0).length - 1) / 3) * 3;
    // Calculate the remainder
    var formattedNum = (fNum / ("1e" + unit)).toFixed(2);
    var unitname = units[Math.floor(unit / 3) - 1];
    return `${formattedNum}${unitname}`;
  }
  return num.toLocaleString();
}
