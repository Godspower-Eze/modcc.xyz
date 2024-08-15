export const arrayToLatexPoly = (coefficients: Array<number>) => {
  let res = "";
  coefficients.reverse().forEach((value, index) => {
    if (value == 0) {
      return;
    }
    if (index == coefficients.length - 1) {
      let term = ` ${value}`;
      res += term;
    } else if (index == coefficients.length - 2) {
      let term = ` ${value}x +`;
      res += term;
    } else {
      let term = ` ${value}x^${coefficients.length - 1 - index} +`;
      res += term;
    }
  });
  return `$${res}$`;
};
