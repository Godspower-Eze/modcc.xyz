'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import {
  BACKEND_URL,
  UNIVARIATE_LAGRANGE_DEFAULT_STEPS,
  MODULUS_PLACEHOLDER,
  X_VALUES_PLACEHOLDER_FOR_MULTIVARIATE,
  Y_VALUES_PLACEHOLDER_FOR_MULTIVARIATE,
  MULTIVARIATE_INTERPOLATION_DEFAULT_ANSWER,
} from '../constants'
import {
  arrayToLatexPolyforMultivariate,
  LagrangeInterpolationSteps,
} from '../utils/latex'
import {
  commaSeparatedToList,
  commaSeparatedToListForEvaluationPair,
  getNumberOfVars,
  isPrime,
} from '../utils/validation'

export default function Home() {
  const [yValues, setYValues] = useState<string>(
    Y_VALUES_PLACEHOLDER_FOR_MULTIVARIATE,
  )
  const [yValuesError, setYValuesError] = useState<string>('')
  const [yValuesIsValid, setYValuesIsValid] = useState<boolean>(true)

  const [xValues, setXValues] = useState<string>(
    X_VALUES_PLACEHOLDER_FOR_MULTIVARIATE,
  )
  const [xValuesError, setXValuesError] = useState<string>('')
  const [xValuesIsValid, setXValuesIsValid] = useState<boolean>(true)

  const [modulus, setModulus] = useState<string>(MODULUS_PLACEHOLDER)
  const [modulusError, setModulusError] = useState<string>('')
  const [modulusIsValid, setModulusIsValid] = useState<boolean>(true)

  const [xValuesAndYValuesIsValid, setXValuesAndYValuesIsValid] = useState<
    boolean
  >(true)

  const [answer, setAnswer] = useState<string>(
    MULTIVARIATE_INTERPOLATION_DEFAULT_ANSWER,
  )
  // const [steps, setSteps] = useState<LagrangeInterpolationSteps>(
  //   UNIVARIATE_LAGRANGE_DEFAULT_STEPS,
  // )
  const [formValid, setFormValid] = useState<boolean>(true)

  const [loading, setLoading] = useState<boolean>(false)

  const commaSeperatedNumbersRegex = /^\s*(,\s*)?(0|[1-9]\d*)\s*(,\s*(0|[1-9]\d*)\s*)*(,\s*)?$/
  const evaluationsPairRegex = /^\(\d+( \d+)+\)(?:,\s*\(\d+( \d+)+\))*$/
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
    if (!evaluationsPairRegex.test(e.target.value)) {
      setXValuesError('invalid format. use format, e.g: (1 2), (3 4), (5 6)')
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
    setLoading(true)
    if (
      xValues == X_VALUES_PLACEHOLDER_FOR_MULTIVARIATE &&
      yValues == Y_VALUES_PLACEHOLDER_FOR_MULTIVARIATE &&
      modulus == MODULUS_PLACEHOLDER
    ) {
      setAnswer(MULTIVARIATE_INTERPOLATION_DEFAULT_ANSWER)
      setLoading(false)
      return
    }
    let evaluation_points = commaSeparatedToListForEvaluationPair(xValues)
    let numOfVars = getNumberOfVars(evaluation_points)
    let yValuesAsList = commaSeparatedToList(yValues)
    let modulusAsNumber = parseInt(modulus.trim())

    const axoisInstance = axios.create({ baseURL: `${BACKEND_URL}` })

    try {
      const response = await axoisInstance.post(
        '/multivariate_interpolation_over_finite_field/',
        {
          num_of_vars: numOfVars,
          evaluation_points,
          y_values: yValuesAsList,
          field: modulusAsNumber,
        },
      )
      let terms = response.data.terms
      let answer = arrayToLatexPolyforMultivariate(terms, numOfVars)
      // let steps = getLagrangeInterpolationSteps(response.data.steps)
      // setSteps(steps)
      setAnswer(`${answer}`)
      setLoading(false)
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
              Multivariate Lagrange Interpolation Over Finite Field
            </p>
            <form className="mb-5" onSubmit={handleSubmit}>
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
              <div>
                <button
                  disabled={!formValid || !xValuesAndYValuesIsValid || loading}
                  type="submit"
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    formValid
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-4 w-12 mr-2 ml-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <circle
                        className="opacity-75"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeDasharray="60"
                        strokeDashoffset="10"
                        strokeWidth="4"
                      />
                    </svg>
                  ) : (
                    'Compute'
                  )}
                </button>
              </div>
            </form>
            <div className="mb-5">
              <p className="font-bold underline text-base mb-1">Answer</p>
              <div className="overflow-x-auto">
                <div className="whitespace-nowrap">
                  <Latex>{answer}</Latex>
                </div>
              </div>
            </div>
            {/* <div className="mb-5">
              <p className="font-bold underline text-base mb-1">
                Step by Step Solution
              </p>
              <p className="font-bold text-base mt-1">General Form</p>
              <Latex>{UNIVARIATE_LAGRANGE_GENERAL_FORM}</Latex>
              <Latex>{LAGRANGE_BASIS_FORMULA}</Latex> */}

            {/* <p className="font-bold text-base mt-1">
                Finding the Lagrange Polynomials
              </p> */}
            {/* <div>
                {steps.lagrange_polynomial_steps.map((value, index) => (
                  <div key={index} className="mt-10">
                    <div className="overflow-x-auto">
                      <Latex>{value.step_1}</Latex>
                    </div>
                    <div className="overflow-x-auto">
                      <Latex>{value.step_2}</Latex>
                    </div>
                    <div className="overflow-x-auto">
                      <Latex>{value.step_3}</Latex>
                    </div>
                    <div className="overflow-x-auto">
                      <Latex>{value.step_4}</Latex>
                    </div>
                  </div>
                ))}
              </div> */}
            {/* <p className="font-bold text-base mt-1">
                Get the Final Polynomial
              </p>
              <div className="mt-4">
                <div className="overflow-x-auto mb-2">
                  <div className="whitespace-nowrap">
                    <Latex>{steps.final_form.step_1}</Latex>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="whitespace-nowrap">
                    <Latex>{steps.final_form.step_2}</Latex>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </section>

        <section className="w-full md:w-1/4 p-4"></section>
      </main>
      <Footer />
    </div>
  )
}
