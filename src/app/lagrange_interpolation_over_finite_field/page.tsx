'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { BACKEND_URL } from '../constants'
import {
  arrayToLatexPoly,
  getLagrangeInterpolationSteps,
  LagrangeInterpolationSteps,
} from '../utils/latex'
import {
  commaSeparatedToList,
  isPrime,
  listsToString,
} from '../utils/validation'

const yValuesPlaceHolder = '3, 2, 5, 7, 9'
const xValuesPlaceHolder = '0, 1, 2, 3, 4'
const modulusPlaceHolder = '17'
const defaultAnswer = '$13x^4 + 9x^3 + 3x^2 + 8x + 3$'

/// Latex Values
const generalForm = '$$f(x) = y_0L_0 + y_1L_1 + y_2L_2 + ... + y_{n-1}L_{n-1}$$'
const lagrangeBasisFormala =
  '$$L_i = \\prod_{j=0, j \\neq i}^{n - 1}(\\dfrac{x-x_j}{x_i-x_j})$$'

let defaultSteps: LagrangeInterpolationSteps = {
  lagrange_polynomial_steps: [
    {
      step_1:
        '$$L_0 =  (\\dfrac{x - x_1}{x_0 - x_1})(\\dfrac{x - x_2}{x_0 - x_2})(\\dfrac{x - x_3}{x_0 - x_3})(\\dfrac{x - x_4}{x_0 - x_4})$$',
      step_2:
        '$$= (\\dfrac{x - 1}{0 - 1})(\\dfrac{x - 2}{0 - 2})(\\dfrac{x - 3}{0 - 3})(\\dfrac{x - 4}{0 - 4})$$',
      step_3: '$$= 5(x - 1)(x - 2)(x - 3)(x - 4)$$',
      step_4: '$$L_0 =  5x^4 + 1x^3 + 5x^2 + 5x + 1$$',
    },
    {
      step_1:
        '$$L_1 =  (\\dfrac{x - x_0}{x_1 - x_0})(\\dfrac{x - x_2}{x_1 - x_2})(\\dfrac{x - x_3}{x_1 - x_3})(\\dfrac{x - x_4}{x_1 - x_4})$$',
      step_2:
        '$$= (\\dfrac{x - 0}{1 - 0})(\\dfrac{x - 2}{1 - 2})(\\dfrac{x - 3}{1 - 3})(\\dfrac{x - 4}{1 - 4})$$',
      step_3: '$$= 14(x - 0)(x - 2)(x - 3)(x - 4)$$',
      step_4: '$$L_1 =  14x^4 + 10x^3 + 7x^2 + 4x $$',
    },
    {
      step_1:
        '$$L_2 =  (\\dfrac{x - x_0}{x_2 - x_0})(\\dfrac{x - x_1}{x_2 - x_1})(\\dfrac{x - x_3}{x_2 - x_3})(\\dfrac{x - x_4}{x_2 - x_4})$$',
      step_2:
        '$$= (\\dfrac{x - 0}{2 - 0})(\\dfrac{x - 1}{2 - 1})(\\dfrac{x - 3}{2 - 3})(\\dfrac{x - 4}{2 - 4})$$',
      step_3: '$$= 13(x - 0)(x - 1)(x - 3)(x - 4)$$',
      step_4: '$$L_2 =  13x^4 + 15x^3 + 9x^2 + 14x $$',
    },

    {
      step_1:
        '$$L_3 =  (\\dfrac{x - x_0}{x_3 - x_0})(\\dfrac{x - x_1}{x_3 - x_1})(\\dfrac{x - x_2}{x_3 - x_2})(\\dfrac{x - x_4}{x_3 - x_4})$$',
      step_2:
        '$$= (\\dfrac{x - 0}{3 - 0})(\\dfrac{x - 1}{3 - 1})(\\dfrac{x - 2}{3 - 2})(\\dfrac{x - 4}{3 - 4})$$',
      step_3: '$$= 14(x - 0)(x - 1)(x - 2)(x - 4)$$',
      step_4: '$$L_3 =  14x^4 + 4x^3 + 9x^2 + 7x $$',
    },

    {
      step_1:
        '$$L_4 =  (\\dfrac{x - x_0}{x_4 - x_0})(\\dfrac{x - x_1}{x_4 - x_1})(\\dfrac{x - x_2}{x_4 - x_2})(\\dfrac{x - x_3}{x_4 - x_3})$$',
      step_2:
        '$$= (\\dfrac{x - 0}{4 - 0})(\\dfrac{x - 1}{4 - 1})(\\dfrac{x - 2}{4 - 2})(\\dfrac{x - 3}{4 - 3})$$',
      step_3: '$$= 5(x - 0)(x - 1)(x - 2)(x - 3)$$',
      step_4: '$$L_4 =  5x^4 + 4x^3 + 4x^2 + 4x $$',
    },
  ],
  final_form: {
    step_1:
      '$f(x) = 3( 5x^4 + 1x^3 + 5x^2 + 5x + 1) +2( 14x^4 + 10x^3 + 7x^2 + 4x ) +5( 13x^4 + 15x^3 + 9x^2 + 14x ) +7( 14x^4 + 4x^3 + 9x^2 + 7x ) +9( 5x^4 + 4x^3 + 4x^2 + 4x )$',
    step_2: '$$f(x) =  13x^4 + 9x^3 + 3x^2 + 8x + 3$$',
  },
}

export default function Home() {
  const [yValues, setYValues] = useState<string>(yValuesPlaceHolder)
  const [yValuesError, setYValuesError] = useState<string>('')
  const [yValuesIsValid, setYValuesIsValid] = useState<boolean>(true)

  const [xValues, setXValues] = useState<string>(xValuesPlaceHolder)
  const [xValuesError, setXValuesError] = useState<string>('')
  const [xValuesIsValid, setXValuesIsValid] = useState<boolean>(true)

  const [modulus, setModulus] = useState<string>(modulusPlaceHolder)
  const [modulusError, setModulusError] = useState<string>('')
  const [modulusIsValid, setModulusIsValid] = useState<boolean>(true)

  const [xValuesAndYValuesIsValid, setXValuesAndYValuesIsValid] = useState<
    boolean
  >(true)

  const [answer, setAnswer] = useState<string>(defaultAnswer)
  const [steps, setSteps] = useState<LagrangeInterpolationSteps>(defaultSteps)
  const [input, setInput] = useState<string>(
    '[(0, 3), (1, 2), (2, 5), (3, 7), (4, 9)]',
  )
  const [formValid, setFormValid] = useState<boolean>(true)
  const [isSubmitting, setisSubmitting] = useState<boolean>(false)

  const commaSeperatedNumbersRegex = /^\s*(,\s*)?(0|[1-9]\d*)\s*(,\s*(0|[1-9]\d*)\s*)*(,\s*)?$/
  const numberRegex = /^\s*[1-9]\d*\s*$/

  const handleYValuesChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(e.target.value)
    setYValuesError('')
    setYValuesIsValid(true)
    setFormValid(xValuesIsValid && modulusIsValid && true)
    if (!commaSeperatedNumbersRegex.test(e.target.value)) {
      setYValuesError('invalid format. use format, e.g: 1, 2, 3, 4')
      setYValuesIsValid(false)
      setFormValid(false)
      return
    }
  }

  const handleXValuesChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(e.target.value)
    setXValuesError('')
    setXValuesIsValid(true)
    setFormValid(yValuesIsValid && modulusIsValid && true)
    if (!commaSeperatedNumbersRegex.test(e.target.value)) {
      setXValuesError('invalid format. use format, e.g: 1, 2, 3, 4')
      setXValuesIsValid(false)
      setFormValid(false)
      return
    }
  }

  const handleModulusChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(e.target.value)
    setModulusError('')
    setModulusIsValid(true)
    setFormValid(xValuesIsValid && yValuesIsValid && true)
    console.log(xValuesIsValid && yValuesIsValid && true)
    if (!numberRegex.test(e.target.value)) {
      setModulusError('invalid format. enter a number')
      setModulusIsValid(false)
      setFormValid(false)
      return
    }
    if (!isPrime(parseInt(e.target.value.trim()))) {
      setModulusError('invalid number. enter a prime number')
      setModulusIsValid(false)
      setFormValid(false)
      return
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      xValues == xValuesPlaceHolder &&
      yValues == yValuesPlaceHolder &&
      modulus == modulusPlaceHolder
    ) {
      setAnswer(defaultAnswer)
      return
    }
    let xValuesAsList = commaSeparatedToList(xValues)
    let yValuesAsList = commaSeparatedToList(yValues)
    let modulusAsNumber = parseInt(modulus.trim())

    const axoisInstance = axios.create({ baseURL: `${BACKEND_URL}` })

    try {
      const response = await axoisInstance.post('/lagrange_interpolation/', {
        x_values: xValuesAsList,
        y_values: yValuesAsList,
        field: modulusAsNumber,
      })
      let answer = arrayToLatexPoly(response.data.coefficients)
      let steps = getLagrangeInterpolationSteps(response.data.steps)
      setSteps(steps)
      setAnswer(`$${answer}$`)
      return
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (xValuesIsValid && yValuesIsValid) {
    }
  }, [xValues, yValues, xValuesIsValid, yValuesIsValid])

  return (
    <div className=" bg-gray-100 flex flex-col min-h-screen text-xs">
      <Navbar />
      <main className="flex-grow flex ">
        <section className="w-full md:w-1/4 p-4"></section>
        <section className="w-full md:w-1/2 p-4">
          <div className="container mx-auto">
            <p className="font-bold underline text-lg mb-5">
              Univariate Lagrange Interpolation Over Finite Field
            </p>
            <form className="mb-5" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Y VALUES
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  value={yValues}
                  onChange={(e) => handleYValuesChange(e, setYValues)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    yValuesError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {yValuesError && (
                  <p className="text-red-500 text-sm mt-2">{yValuesError}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  X VALUES
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  value={xValues}
                  onChange={(e) => handleXValuesChange(e, setXValues)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    xValuesError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {xValuesError && (
                  <p className="text-red-500 text-sm mt-2">{xValuesError}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  PRIME MODULUS
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={modulus}
                  onChange={(e) => handleModulusChange(e, setModulus)}
                  className={`mt-1 block px-3 py-2 border ${
                    modulusError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {modulusError && (
                  <p className="text-red-500 text-sm mt-2">{modulusError}</p>
                )}
              </div>
              {xValuesIsValid && yValuesIsValid ? (
                <div className="mb-4">
                  {xValuesAndYValuesIsValid ? (
                    <p>{input}</p>
                  ) : (
                    <p className="text-red-500 text-sm mt-2">
                      length of <b>X VALUES</b> and <b>Y VALUES</b> should be
                      equal
                    </p>
                  )}
                </div>
              ) : (
                ''
              )}
              <div>
                <button
                  disabled={
                    !formValid || isSubmitting || !xValuesAndYValuesIsValid
                  }
                  type="submit"
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    formValid
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Compute
                </button>
              </div>
            </form>
            <div className="mb-5">
              <p className="font-bold underline text-base mb-1">Answer</p>
              <Latex>{answer}</Latex>
            </div>
            <div className="mb-5">
              <p className="font-bold underline text-base mb-1">
                Step by Step Solution
              </p>
              <p className="font-bold text-base mt-1">General Form</p>
              <Latex>{lagrangeBasisFormala}</Latex>
              <Latex>{generalForm}</Latex>

              <p className="font-bold text-base mt-1">
                Finding the Lagrange Polynomials
              </p>
              {steps.lagrange_polynomial_steps.map((value, index) => (
                <div key={index} className="mt-10">
                  <Latex>{value.step_1}</Latex>
                  <Latex>{value.step_2}</Latex>
                  <Latex>{value.step_3}</Latex>
                  <Latex>{value.step_4}</Latex>
                </div>
              ))}
              <p className="font-bold text-base mt-1">
                Get the final Polynomial
              </p>
              <div className="mt-10">
                <Latex>{steps.final_form.step_1}</Latex>
                <Latex>{steps.final_form.step_2}</Latex>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/4 p-4"></section>
      </main>
      <Footer />
    </div>
  )
}
