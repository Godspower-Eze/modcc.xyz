'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import {
  BACKEND_URL,
  MULTILINEAR_INTERPOLATION_DEFAULT_ANSWER,
  MULTILINEAR_INTERPOLATION_DEFAULT_EVALUATION,
  MULTILINEAR_INTERPOLATION_DEFAULT_EVALUATION_POINTS,
  MULTILINEAR_INTERPOLATION_NUMBER_REGEX
} from '../constants'
import { commaSeparatedToList, isPrime } from '../utils/validation'

const yValuesPlaceHolder = '3, 2, 5, 7, 9'
const modulusPlaceHolder = '17'

export default function Home() {
  const [yValues, setYValues] = useState<string>(yValuesPlaceHolder)
  const [yValuesError, setYValuesError] = useState<string>('')
  const [yValuesIsValid, setYValuesIsValid] = useState<boolean>(true)

  const [modulus, setModulus] = useState<string>(modulusPlaceHolder)
  const [modulusError, setModulusError] = useState<string>('')
  const [modulusIsValid, setModulusIsValid] = useState<boolean>(true)

  const [answer, setAnswer] = useState<string>(
    MULTILINEAR_INTERPOLATION_DEFAULT_ANSWER,
  )

  const [formValid, setFormValid] = useState<boolean>(true)

  const [loading, setLoading] = useState<boolean>(false)

  const [evaluationPoints, setEvaluationPoints] = useState<Array<string>>(MULTILINEAR_INTERPOLATION_DEFAULT_EVALUATION_POINTS)
  const [evaluationPointError, setEvaluationPointError] = useState<string>('')
  const [evaluationPointIsValid, setEvaluationPointIsValid] = useState<boolean>(
      true,
    )
  const [evaluation, setEvaluation] = useState<string>(MULTILINEAR_INTERPOLATION_DEFAULT_EVALUATION)

  const [evaluationLoading, setEvaluationLoading] = useState<boolean>(false)
  const [currentModulus, setCurrentModulus] = useState<number>(
    parseInt(modulusPlaceHolder),
  )

  const commaSeperatedNumbersRegex = /^\s*(,\s*)?(0|[1-9]\d*)\s*(,\s*(0|[1-9]\d*)\s*)*(,\s*)?$/
  const numberRegex = /^\s*[1-9]\d*\s*$/

  const handleYValuesChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(e.target.value)
    setYValuesError('')
    setYValuesIsValid(true)
    setFormValid(modulusIsValid && true)
    if (!commaSeperatedNumbersRegex.test(e.target.value)) {
      setYValuesError('invalid format. use format, e.g: 1, 2, 3, 4')
      setYValuesIsValid(false)
      setFormValid(false)
      return
    }
  }

  const handleChangeEvaluationPoints = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const key = parseInt(e.target.dataset.key!)
    const value = e.target.value
    let evalPoints = [...evaluationPoints]
    evalPoints[key - 1] = value
    setEvaluationPoints(evalPoints)
    setEvaluationPointError('')
    setEvaluationPointIsValid(true)
    if (!MULTILINEAR_INTERPOLATION_NUMBER_REGEX.test(e.target.value)) {
      setEvaluationPointError('invalid format. enter a number')
      setEvaluationPointIsValid(false)
      return
    }
    if (evalPoints.every((value) => value.trim() == "")) {
      setEvaluationPointIsValid(false)
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
    setFormValid(yValuesIsValid && true)
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

  const handleSubmitEvaluation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEvaluationLoading(true)
    const evalPoints = evaluationPoints.map((value, index) => {
      if (value.trim() != "") {
        return [index + 1, parseInt(value.trim())]
      } else {
        return [index + 1, value.trim()]
      }
    }).filter((value) => value[1] !== "");
    const axoisInstance = axios.create({ baseURL: `${BACKEND_URL}` })
    try {
      if (evalPoints.length == evaluationPoints.length) {
        const response = await axoisInstance.post('/full_evaluation/', {
          evaluation_points: evalPoints,
          poly_string: answer.split("$")[1],
          field: currentModulus,
        })
        const evaluation = response.data.evaluation;
        setEvaluation(evaluation)
      } else {
        const response = await axoisInstance.post('/partial_evaluation/', {
          evaluation_points: evalPoints,
          poly_string: answer.split("$")[1],
          field: currentModulus,
        })
        const evaluation = response.data.evaluation;
        setEvaluation(evaluation)
      }
      setEvaluationLoading(false)
      return
    } catch (error) {
      setEvaluationLoading(false)
      console.log(error)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (yValues == yValuesPlaceHolder && modulus == modulusPlaceHolder) {
      setAnswer(MULTILINEAR_INTERPOLATION_DEFAULT_ANSWER)
      setLoading(false)
      return
    }
    let yValuesAsList = commaSeparatedToList(yValues)
    let modulusAsNumber = parseInt(modulus.trim())

    const axoisInstance = axios.create({ baseURL: `${BACKEND_URL}` })

    try {
      const polyResponse = await axoisInstance.post(
        '/multilinear_interpolation_over_boolean_hypercube/',
        {
          y_values: yValuesAsList,
          field: modulusAsNumber,
        },
      )
      const answer = polyResponse.data.poly
      const numOfVars = polyResponse.data.properties.num_of_vars
      const evalPoints =  Array.from({ length: numOfVars }, (_, i) => [(i + 1), i + 1])
      const evalResponse = await axoisInstance.post('/full_evaluation/', {
          evaluation_points: evalPoints,
          poly_string: answer.split("$")[1],
          field: modulusAsNumber,
      })
      setAnswer(polyResponse.data.poly)
      setEvaluation(evalResponse.data.evaluation)
      setEvaluationPoints(Array.from({ length: numOfVars }, (_, i) => `${i + 1}`))
      setLoading(false)
      setCurrentModulus(modulusAsNumber)
      return
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (yValuesIsValid) {
    }
  }, [yValues, yValuesIsValid])

  return (
    <div className=" bg-gray-100 flex flex-col min-h-screen text-xs">
      <Navbar />
      <main className="flex-grow flex lowercase">
        <section className="w-full md:w-1/4 p-4"></section>
        <section className="w-full md:w-1/2 p-4">
          <div className="container mx-auto">
            <p className="font-bold underline text-lg mb-5">
              Multilinear Interpolation Over the Boolean Hypercube
            </p>
            <form className="mb-5" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Evaluations
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
                  Prime Modulus
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
                  disabled={!formValid || loading}
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
            <div className="mb-3">
              <p className="font-bold underline text-base mb-1">Answer</p>
              <div className="overflow-x-auto">
                <div className="whitespace-nowrap">
                  <Latex>{answer}</Latex>
                </div>
              </div>
              <p className="font-bold underline text-sm mb-1 mt-2">
                Evaluations
              </p>
              <div>
                  <form onSubmit={(e) => handleSubmitEvaluation(e)}>
                  <div className="overflow-x-auto">
                    <div className="pt-2 pb-2 whitespace-nowrap">
                      <span>
                        <Latex>$f($</Latex>
                      </span>
                      {evaluationPoints.map((value, index) =>
                      <input
                        key={index + 1}
                        data-key = {index + 1}
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleChangeEvaluationPoints(e)
                        }
                        className="border border-blue-400 text-center w-8 px-1 rounded-md mr-1 ml-1 resize-x"
                      >
                      </input>
                        )}
                      <span>
                        <Latex>$)$</Latex>
                      </span>
                      <span>
                        <Latex>$=$ {evaluation}</Latex>
                      </span>
                    </div>
                  </div>
                    {evaluationPointError && (
                      <p className="text-red-500 text-xs mt-2">
                        {evaluationPointError}
                      </p>
                    )}
                    <div>
                      <button
                        disabled={!evaluationPointIsValid || evaluationLoading}
                        type="submit"
                        className={`inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xm font-light rounded-md text-white items-center ${
                          evaluationPointIsValid
                            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                            : 'bg-gray-400 cursor-not-allowed'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        {evaluationLoading ? (
                          <svg
                            className="animate-spin h-3 w-10 mr-1 ml-1 text-white"
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
                          'evaluate'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
            </div>
            {/* <div className="mb-5">
              <p className="font-bold underline text-base mb-1">
                Step by Step Solution
              </p>
              <p className="font-bold text-base mt-1">General Form</p>
              <Latex>
                {MULTILINEAR_LAGRANGE_GENERAL_FORM} where, for any $w = (w_1,
                ..., w_v)$
              </Latex>
              <Latex>{MULTILINEAR_LAGRANGE_BASIS_FORMULA}</Latex>
              <Latex>
                {LAGRANGE_BASIS_FORMULA} where $L_0 = (1 - x_i)$ and $L_1 = x_i$
              </Latex>
              <div>
                {' '}
                <p className="font-bold text-base mt-3">
                  Finding the Lagrange Polynomials
                </p>
                {steps.multilinear_lagrange_polynomial_steps.map(
                  (value, index) => (
                    <div key={index} className="mt-10">
                      <div className="flex pb-4">
                        <div className="w-1/2 overflow-x-auto">
                          <Latex>{value.step_1.lhs}</Latex>
                        </div>
                        <div className="w-1/3 overflow-x-auto">=</div>
                        <div className="w-1/2 overflow-x-auto">
                          <div className="whitespace-nowrap">
                            <Latex>{value.step_1.rhs}</Latex>
                          </div>
                        </div>
                      </div>
                      <div className="flex pb-4">
                        <div className="w-1/2 overflow-x-auto">
                          <Latex>{value.step_2.lhs}</Latex>
                        </div>
                        <div className="w-1/3 overflow-x-auto">=</div>
                        <div className="w-1/2 overflow-x-auto">
                          <div className="whitespace-nowrap">
                            <Latex>{value.step_2.rhs}</Latex>
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/2 overflow-x-auto">
                          <Latex>{value.step_3.lhs}</Latex>
                        </div>
                        <div className="w-1/3 overflow-x-auto">=</div>
                        <div className="w-1/2 overflow-x-auto">
                          <div className="whitespace-nowrap">
                            <Latex>{value.step_3.rhs}</Latex>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div>
                <p className="font-bold text-base mt-1">
                  Get the final Polynomial
                </p>
                <div className="mt-4">
                  <div className="overflow-x-auto">
                    <div className="whitespace-nowrap">
                      <Latex>{steps.final_form.step_1}</Latex>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="whitespace-nowrap">
                      <Latex>{steps.final_form.step_2}</Latex>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-base mt-3">Evaluations</p>
                {steps.evaluations.map((value: string, index) => (
                  <div key={index} className="mt-1">
                    <div className="overflow-x-auto">
                      <Latex>{value}</Latex>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </section>
        <section className="w-full md:w-1/4 p-4"></section>
      </main>
      <Footer />
    </div>
  )
}
