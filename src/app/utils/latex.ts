////////////////////////////////////////////////////////
////////////// LAGRANGE INTERPOLATION ////////////////
////////////////////////////////////////////////////////

interface LagrangePolynomialStep {
  step_1: string;
  step_2: string;
  step_3: string;
  step_4: string;
}

interface LagrangeFinalFormStep {
  step_1: string;
  step_2: string;
}

export interface LagrangeInterpolationSteps {
  lagrange_polynomial_steps: Array<LagrangePolynomialStep>;
  final_form: LagrangeFinalFormStep;
}

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

const generateLatexForLagrangePolynomialStep1 = (
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

const generateLatexForLagrangePolynomialStep2 = (
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

const generateLatexForLagrangePolynomialStep3 = (
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

const genLatexForStepsInLagrangePolynomial = (
  xValues: Array<number>,
  lagrangeBasisAndYValues: Array<any>
): Array<LagrangePolynomialStep> => {
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
    let stepsObj: LagrangePolynomialStep = {
      step_1: step1,
      step_2: step2,
      step_3: step3,
      step_4: `$$L_${index} = ${step4}$$`,
    };
    res.push(stepsObj);
  }
  return res;
};

const genLatexForFinalPolynomialStep1 = (
  lagrangeBasisAndYValues: Array<any>
): string => {
  let res = "";
  for (let index = 0; index < lagrangeBasisAndYValues.length; index++) {
    const element = lagrangeBasisAndYValues[index];
    const lagrangeBasis = element["lagrange_basis"];
    const lagrangeBasisLatex = arrayToLatexPoly(lagrangeBasis.reverse());
    const y = element["y"];
    if (index == lagrangeBasisAndYValues.length - 1) {
      const mul = `${y}(${lagrangeBasisLatex})`;
      res += mul;
    } else {
      const mul = `${y}(${lagrangeBasisLatex}) +`;
      res += mul;
    }
  }
  return `$f(x) = ${res}$`;
};

const genLatexForFinalPolynomialStep2 = (
  coefficients: Array<number>
): string => {
  const res = arrayToLatexPoly(coefficients);
  return `$$f(x) = ${res}$$`;
};

const getlagrangeFinalFormStep = (steps: any): LagrangeFinalFormStep => {
  const lagrangeBasisAndYValues = steps["lagrange_basis_and_y_values"];
  const coefficients = steps["resulting_polynomial"];
  const step1 = genLatexForFinalPolynomialStep1(lagrangeBasisAndYValues);
  const step2 = genLatexForFinalPolynomialStep2(coefficients);
  const res = { step_1: step1, step_2: step2 };
  return res;
};

export const getLagrangeInterpolationSteps = (
  steps: any
): LagrangeInterpolationSteps => {
  const xValues = steps["x_values"];
  const lagrangeBasisAndYValues = steps["lagrange_basis_and_y_values"];
  const lagrangePolynomialSteps = genLatexForStepsInLagrangePolynomial(
    xValues,
    lagrangeBasisAndYValues
  );
  const finalFormStep = getlagrangeFinalFormStep(steps);
  const res = {
    lagrange_polynomial_steps: lagrangePolynomialSteps,
    final_form: finalFormStep,
  };
  return res;
};

////////////////////////////////////////////////////////
////////////// MULTILINEAR INTERPOLATION ////////////////
////////////////////////////////////////////////////////

function logBase(value: number, base: number): number {
  return Math.log(value) / Math.log(base);
}

function generateCombinations(variables: Array<string>) {
  const results: Array<Array<string>> = [];
  // Helper function to generate combinations recursively
  function combine(
    prefix: Array<string>,
    remaining: Array<string>,
    start: number
  ) {
    // Add the current combination (prefix) to results
    results.push(prefix);

    // Iterate through the remaining variables
    for (let i = start; i < remaining.length; i++) {
      // Recursively add more variables to the combination
      combine([...prefix, remaining[i]], remaining, i + 1);
    }
  }
  // Start with an empty combination
  combine([], variables, 0);

  return results;
}

export const coefficientsToLatexPoly = (
  coefficients: Array<[number, number]>
) => {
  let length = coefficients.length;
  let num_of_vars = logBase(length, 2);
  let main_terms = [];
  for (let index = 0; index < num_of_vars; index++) {
    main_terms.push(2 ** index);
  }

  let terms_map: any = {};
  let reverse_terms_map: any = {};

  main_terms.forEach((element, index) => {
    terms_map[element] = `x_${index + 1}`;
  });

  main_terms.forEach((element, index) => {
    reverse_terms_map[`x_${index + 1}`] = element;
  });

  let term_combinations = generateCombinations(Object.values(terms_map));
  for (let index = 0; index < term_combinations.length; index++) {
    const term_combination = term_combinations[index];
    if (term_combination.length != 0 && term_combination.length != 1) {
      let total = 0;
      let combined_term = "";
      for (let index = 0; index < term_combination.length; index++) {
        const term = term_combination[index];
        combined_term += term;
        total += reverse_terms_map[term];
      }
      terms_map[total] = combined_term;
    }
  }

  let latexPoly = "";
  let constant = "";
  for (let index = 0; index < coefficients.length; index++) {
    const id_and_coefficient = coefficients[index];
    let id = id_and_coefficient[0];
    let coefficient = id_and_coefficient[1];
    if (coefficient == 0) {
      continue;
    }
    if (id == 0) {
      constant = `${coefficient}`;
      continue;
    }
    let term;
    if (coefficient == 1) {
      term = `${terms_map[id]}`;
    } else {
      term = `${coefficient}${terms_map[id]}`;
    }
    latexPoly += `${term} + `;
  }
  latexPoly += constant;
  return `$${latexPoly}$`;
};
