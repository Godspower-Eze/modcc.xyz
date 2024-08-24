export const arrayToLatexPoly = (coefficients: Array<number>): string => {
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
  if (res.endsWith("+")) {
    res = res.slice(0, -1);
  }
  return `${res}`;
};

export const generateLatexForLagrangePolynomialStep1 = (
  i: number,
  n: number
): string => {
  let basis = `L_${i} = `;
  let products = "";
  for (let j = 0; j < n; j++) {
    if (j == i) {
      continue;
    }
    let x = `(\\dfrac{x - x_${j}}{x_${i} - x_${j}})`;
    products += x;
  }
  return `$$${basis} ${products}$$`;
};

export const generateLatexForLagrangePolynomialStep2 = (
  current_value: number,
  x_values: Array<number>
): string => {
  let products = "";
  for (let i = 0; i < x_values.length; i++) {
    let x_value = x_values[i];
    if (current_value == x_value) {
      continue;
    }
    let x = `(\\dfrac{x - ${x_value}}{${current_value} - ${x_value}})`;
    products += x;
  }
  return `$$= ${products}$$`;
};

export const generateLatexForLagrangePolynomialStep3 = (
  current_value: number,
  inverse: number,
  x_values: Array<number>
): string => {
  let products = "";
  for (let i = 0; i < x_values.length; i++) {
    let x_value = x_values[i];
    if (current_value == x_value) {
      continue;
    }
    let x = `(x - ${x_value})`;
    products += x;
  }
  return `$$= ${inverse}${products}$$`;
};

export interface Steps {
  step_1: string;
  step_2: string;
  step_3: string;
  step_4: string;
}

export const generateStepsForLagrangeInterpolation = (steps: any) => {
  const xValues = steps["x_values"];
  const yValues = steps["y_values"];
  const lagrangeBasisAndYValues = steps["lagrange_basis_and_y_values"];
  const n = lagrangeBasisAndYValues.length;
  let res = [];
  for (let index = 0; index < lagrangeBasisAndYValues.length; index++) {
    const element = lagrangeBasisAndYValues[index];
    const i = element["i"];
    const step1 = generateLatexForLagrangePolynomialStep1(i, n);
    const x = element["x"];
    const step2 = generateLatexForLagrangePolynomialStep2(x, xValues);
    const inverse = element["steps"]["inverse"];
    const step3 = generateLatexForLagrangePolynomialStep3(x, inverse, xValues);
    const lagrangeBasis = element["lagrange_basis"];
    const step4 = arrayToLatexPoly(lagrangeBasis);
    let stepsObj: Steps = {
      step_1: step1,
      step_2: step2,
      step_3: step3,
      step_4: `$$L_${index} = ${step4}$$`,
    };
    res.push(stepsObj);
  }
  return res;
};
