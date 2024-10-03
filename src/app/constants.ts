import {
  LagrangeInterpolationSteps,
  MultilinearLagrangeInterpolationStepsAndEvaluations,
} from "./utils/latex";

export const PRODUCTION_BACKEND_URL = "https://api.modcc.xyz/";

export const LOCAL_BACKEND_URL = "http://127.0.0.1:8080";

export let BACKEND_URL: string;

if (process.env.NEXT_PUBLIC_ENVIRONMENT == "local") {
  BACKEND_URL = LOCAL_BACKEND_URL;
} else if (process.env.NEXT_PUBLIC_ENVIRONMENT == "production") {
  BACKEND_URL = PRODUCTION_BACKEND_URL;
} else {
  BACKEND_URL = "";
}

////////////////////////////////////////////////////////
////////////// LAGRANGE INTERPOLATION /////////////////
////////////////////////////////////////////////////////

export const Y_VALUES_PLACEHOLDER = "3, 2, 5, 7, 9";
export const X_VALUES_PLACEHOLDER = "0, 1, 2, 3, 4";
export const MODULUS_PLACEHOLDER = "17";
export const LAGRANGE_INTERPOLATION_DEFAULT_ANSWER =
  "$f(x) = 13x^4 + 9x^3 + 3x^2 + 8x + 3$";

export const UNIVARIATE_LAGRANGE_GENERAL_FORM =
  "$$f(x) = y_0L_0 + y_1L_1 + y_2L_2 + ... + y_{n-1}L_{n-1}$$";
export const LAGRANGE_BASIS_FORMULA =
  "$$L_i = \\prod_{j=0, j \\neq i}^{n - 1}(\\dfrac{x-x_j}{x_i-x_j})$$";

export const UNIVARIATE_LAGRANGE_DEFAULT_STEPS: LagrangeInterpolationSteps = {
  lagrange_polynomial_steps: [
    {
      step_1:
        "$$L_0 =  (\\dfrac{x - x_1}{x_0 - x_1})(\\dfrac{x - x_2}{x_0 - x_2})(\\dfrac{x - x_3}{x_0 - x_3})(\\dfrac{x - x_4}{x_0 - x_4})$$",
      step_2:
        "$$= (\\dfrac{x - 1}{0 - 1})(\\dfrac{x - 2}{0 - 2})(\\dfrac{x - 3}{0 - 3})(\\dfrac{x - 4}{0 - 4})$$",
      step_3: "$$= 5(x - 1)(x - 2)(x - 3)(x - 4)$$",
      step_4: "$$L_0 =  5x^4 + 1x^3 + 5x^2 + 5x + 1$$",
    },
    {
      step_1:
        "$$L_1 =  (\\dfrac{x - x_0}{x_1 - x_0})(\\dfrac{x - x_2}{x_1 - x_2})(\\dfrac{x - x_3}{x_1 - x_3})(\\dfrac{x - x_4}{x_1 - x_4})$$",
      step_2:
        "$$= (\\dfrac{x - 0}{1 - 0})(\\dfrac{x - 2}{1 - 2})(\\dfrac{x - 3}{1 - 3})(\\dfrac{x - 4}{1 - 4})$$",
      step_3: "$$= 14(x - 0)(x - 2)(x - 3)(x - 4)$$",
      step_4: "$$L_1 =  14x^4 + 10x^3 + 7x^2 + 4x $$",
    },
    {
      step_1:
        "$$L_2 =  (\\dfrac{x - x_0}{x_2 - x_0})(\\dfrac{x - x_1}{x_2 - x_1})(\\dfrac{x - x_3}{x_2 - x_3})(\\dfrac{x - x_4}{x_2 - x_4})$$",
      step_2:
        "$$= (\\dfrac{x - 0}{2 - 0})(\\dfrac{x - 1}{2 - 1})(\\dfrac{x - 3}{2 - 3})(\\dfrac{x - 4}{2 - 4})$$",
      step_3: "$$= 13(x - 0)(x - 1)(x - 3)(x - 4)$$",
      step_4: "$$L_2 =  13x^4 + 15x^3 + 9x^2 + 14x $$",
    },

    {
      step_1:
        "$$L_3 =  (\\dfrac{x - x_0}{x_3 - x_0})(\\dfrac{x - x_1}{x_3 - x_1})(\\dfrac{x - x_2}{x_3 - x_2})(\\dfrac{x - x_4}{x_3 - x_4})$$",
      step_2:
        "$$= (\\dfrac{x - 0}{3 - 0})(\\dfrac{x - 1}{3 - 1})(\\dfrac{x - 2}{3 - 2})(\\dfrac{x - 4}{3 - 4})$$",
      step_3: "$$= 14(x - 0)(x - 1)(x - 2)(x - 4)$$",
      step_4: "$$L_3 =  14x^4 + 4x^3 + 9x^2 + 7x $$",
    },

    {
      step_1:
        "$$L_4 =  (\\dfrac{x - x_0}{x_4 - x_0})(\\dfrac{x - x_1}{x_4 - x_1})(\\dfrac{x - x_2}{x_4 - x_2})(\\dfrac{x - x_3}{x_4 - x_3})$$",
      step_2:
        "$$= (\\dfrac{x - 0}{4 - 0})(\\dfrac{x - 1}{4 - 1})(\\dfrac{x - 2}{4 - 2})(\\dfrac{x - 3}{4 - 3})$$",
      step_3: "$$= 5(x - 0)(x - 1)(x - 2)(x - 3)$$",
      step_4: "$$L_4 =  5x^4 + 4x^3 + 4x^2 + 4x $$",
    },
  ],
  final_form: {
    step_1:
      "$f(x) = 3( 5x^4 + 1x^3 + 5x^2 + 5x + 1) +2( 14x^4 + 10x^3 + 7x^2 + 4x ) +5( 13x^4 + 15x^3 + 9x^2 + 14x ) +7( 14x^4 + 4x^3 + 9x^2 + 7x ) +9( 5x^4 + 4x^3 + 4x^2 + 4x )$",
    step_2: "$f(x) =  13x^4 + 9x^3 + 3x^2 + 8x + 3$",
  },
};

////////////////////////////////////////////////////////
////////////// MULTILINEAR INTERPOLATION /////////////////
////////////////////////////////////////////////////////
export const MULTILINEAR_INTERPOLATION_DEFAULT_ANSWER =
  "$\\tilde f(x_1,x_2,x_3) = 16x_{1} +2x_{2} +3x_{1}x_{2} +6x_{3} +9x_{1}x_{3} +6x_{2}x_{3} +6x_{1}x_{2}x_{3} + 3$";
export const MULTILINEAR_LAGRANGE_GENERAL_FORM =
  "$$ \\tilde f(x_1, ..., x_n) = \\sum _{w \\in \\{0, 1\\}^n} f(w).L_w(x_1, ..., x_n)$$";
export const MULTILINEAR_LAGRANGE_BASIS_FORMULA =
  "$$L_w(x_1, ...., x_n) = \\prod_{i = 1}^n L_i$$";
export const MULTILINEAR_LAGRANGE_DEFAULT_STEPS: MultilinearLagrangeInterpolationStepsAndEvaluations =
  {
    multilinear_lagrange_polynomial_steps: [
      {
        step_1: {
          lhs: "$L(0,0,0)$",
          rhs: "$(L_0)(L_0)(L_0)$",
        },
        step_2: {
          lhs: "            ",
          rhs: "$(1 - x_{1})(1 - x_{2})(1 - x_{3})$",
        },
        step_3: {
          lhs: "            ",
          rhs: "$16x_{1} +16x_{2} +x_{1}x_{2} +16x_{3} +x_{1}x_{3} +x_{2}x_{3} +16x_{1}x_{2}x_{3} + 1$",
        },
      },
    ],
    final_form: {
      step_1:
        "$\\tilde f(x_1,x_2,x_3) = 3(16x_{1} +16x_{2} +x_{1}x_{2} +16x_{3} +x_{1}x_{3} +x_{2}x_{3} +16x_{1}x_{2}x_{3} +1) +2(x_{1} +16x_{1}x_{2} +16x_{1}x_{3} +x_{1}x_{2}x_{3} ) +5(x_{2} +16x_{1}x_{2} +16x_{2}x_{3} +x_{1}x_{2}x_{3} ) +7(x_{1}x_{2} +16x_{1}x_{2}x_{3} ) +9(x_{3} +16x_{1}x_{3} +16x_{2}x_{3} +x_{1}x_{2}x_{3} ) +0(x_{1}x_{3} +16x_{1}x_{2}x_{3} ) +0(x_{2}x_{3} +16x_{1}x_{2}x_{3} ) +0(x_{1}x_{2}x_{3} )$",
      step_2:
        "$\\tilde f(x_1,x_2,x_3) = 16x_{1} + 2x_{2} +3x_{1}x_{2} + 6x_{3} + 9x_{1}x_{3} +6x_{2}x_{3} + 6x_{1}x_{2}x_{3} + 3$",
    },
    evaluations: [
      "$$\\tilde f(0,0,0) = 3$$",
      "$$\\tilde f(0,0,1) = 2$$",
      "$$\\tilde f(0,1,0) = 5$$",
      "$$\\tilde f(0,1,1) = 7$$",
      "$$\\tilde f(1,0,0) = 9$$",
      "$$\\tilde f(1,0,1) = 0$$",
      "$$\\tilde f(1,1,0) = 0$$",
      "$$\\tilde f(1,1,1) = 0$$",
    ],
  };

///////////////////////////////////////////////////////////
////////////// MULTIVARIATE INTERPOLATION /////////////////
///////////////////////////////////////////////////////////
export const X_VALUES_PLACEHOLDER_FOR_MULTIVARIATE = "(0 1), (2 3), (4 5)";
export const Y_VALUES_PLACEHOLDER_FOR_MULTIVARIATE = "3, 2, 5";
export const MULTIVARIATE_INTERPOLATION_DEFAULT_ANSWER =
  "$\\tilde f(x_1,x_2) = 15x_1^5x_2^5 + 4x_1^5x_2^4 + 7x_1^5x_2^3 + 1x_1^5x_2^2 + 4x_1^5x_2 + 6x_1^4x_2^5 + 11x_1^4x_2^4 + 9x_1^4x_2^2 + 2x_1^4x_2 + 9x_1^2x_2^5 + 10x_1^2x_2^4 + 10x_1^2x_2^3 + 8x_1^2x_2^2 + 9x_1^2x_2 + 4x_1x_2^5 + 12x_1x_2^4 + 12x_1x_2^3 + 13x_1x_2^2 + 4x_1x_2 + 15x_2^5 + 11x_2^4 + 11x_2^3 + 2x_2^2 + 15x_2 + 10x_1^3x_2^5 + 6x_1^3x_2^4 + 16x_1^3x_2^3 + 15x_1^3x_2^2 + 4x_1^3x_2 + 9x_1^2x_2^5 + 1x_1^2x_2^4 + 1x_1^2x_2^3 + 8x_1^2x_2^2 + 15x_1^2x_2 + 13x_1x_2^4 + 11x_1x_2^3 + 12x_1x_2^2 + 15x_1x_2$";
