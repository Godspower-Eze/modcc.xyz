'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import {
  BACKEND_URL,
  LAGRANGE_BASIS_FORMULA,
  MULTILINEAR_LAGRANGE_GENERAL_FORM,
  MULTILINEAR_LAGRANGE_BASIS_FORMULA,
} from '../constants'
import {
  arrayToLatexPoly,
  coefficientsToLatexPoly,
  getLagrangeInterpolationSteps,
  LagrangeInterpolationSteps,
} from '../utils/latex'
import {
  commaSeparatedToList,
  isPrime,
  listsToString,
} from '../utils/validation'

const yValuesPlaceHolder = '3, 2, 5, 7, 9'
const modulusPlaceHolder = '17'
const defaultAnswer = '$13x^4 + 9x^3 + 3x^2 + 8x + 3$'

export default function Home() {
  const [yValues, setYValues] = useState<string>(yValuesPlaceHolder)
  const [yValuesError, setYValuesError] = useState<string>('')
  const [yValuesIsValid, setYValuesIsValid] = useState<boolean>(true)

  const [modulus, setModulus] = useState<string>(modulusPlaceHolder)
  const [modulusError, setModulusError] = useState<string>('')
  const [modulusIsValid, setModulusIsValid] = useState<boolean>(true)

  const [answer, setAnswer] = useState<string>(defaultAnswer)
  // const [steps, setSteps] = useState<LagrangeInterpolationSteps>(defaultSteps)

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
    setFormValid(modulusIsValid && true)
    if (!commaSeperatedNumbersRegex.test(e.target.value)) {
      setYValuesError('invalid format. use format, e.g: 1, 2, 3, 4')
      setYValuesIsValid(false)
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // if (yValues == yValuesPlaceHolder && modulus == modulusPlaceHolder) {
    //   setAnswer(defaultAnswer)
    //   return
    // }
    let yValuesAsList = commaSeparatedToList(yValues)
    console.log(yValuesAsList)
    let modulusAsNumber = parseInt(modulus.trim())
    console.log(modulusAsNumber)

    const axoisInstance = axios.create({ baseURL: `${BACKEND_URL}` })

    try {
      const response = await axoisInstance.post(
        '/multilinear_interpolation_over_boolean_hypercube/',
        {
          y_values: yValuesAsList,
          field: modulusAsNumber,
        },
      )
      let answer = coefficientsToLatexPoly(response.data['coefficients'])
      console.log(response.data)
      // let steps = getLagrangeInterpolationSteps(response.data.steps)
      // setSteps(steps)
      setAnswer(`$${answer}$`)
      return
    } catch (error) {
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
      <main className="flex-grow flex ">
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
                  disabled={!formValid || isSubmitting}
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
              <Latex>
                {MULTILINEAR_LAGRANGE_GENERAL_FORM} where, for any $w = (w_1,
                ..., w_v)$
              </Latex>
              <Latex>{MULTILINEAR_LAGRANGE_BASIS_FORMULA}</Latex>
              <Latex>
                {LAGRANGE_BASIS_FORMULA} where $L_0 = (1 - x)$ and $L_1 = x$
              </Latex>

              <p className="font-bold text-base mt-3">
                Finding the Lagrange Polynomials
              </p>
              {/* {steps.lagrange_polynomial_steps.map((value, index) => (
                <div key={index} className="mt-10">
                  <Latex>{value.step_1}</Latex>
                  <Latex>{value.step_2}</Latex>
                  <Latex>{value.step_3}</Latex>
                  <Latex>{value.step_4}</Latex>
                </div>
              ))} */}
              {/* <p className="font-bold text-base mt-1">
                Get the final Polynomial
              </p>
              <div className="mt-10">
                <Latex>{steps.final_form.step_1}</Latex>
                <Latex>{steps.final_form.step_2}</Latex>
              </div> */}
            </div>
          </div>
        </section>
        <section className="w-full md:w-1/4 p-4"></section>
      </main>
      <Footer />
    </div>
  )
}
