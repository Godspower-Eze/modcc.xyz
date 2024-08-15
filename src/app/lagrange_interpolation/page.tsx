'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'
import axios from 'axios'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

import { Navbar } from '../components/navbar'
import { BACKEND_URL } from '../constants'
import { arrayToLatexPoly } from '../utils/latex'

export default function Home() {
  const [yValues, setYValues] = useState<Array<number>>([])
  const [xValues, setXValues] = useState<Array<number>>([])
  const [modulus, setModulus] = useState<number>(0)
  const [answer, setAnswer] = useState<string>('')

  const handleYValuesChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<Array<number>>>,
  ) => {
    console.log(e)
  }

  const handleXValuesChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<Array<number>>>,
  ) => {
    console.log(e)
  }

  const handleModulusChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    console.log(e)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let xValues = [0, 1, 2, 3]
    let yValues = [3, 1, 2, 4]
    let modulus = 11

    const axoisInstance = axios.create({ baseURL: `${BACKEND_URL}` })

    try {
      const response = await axoisInstance.post('/lf/', {
        x_values: xValues,
        y_values: yValues,
        field: modulus,
      })
      let answer = arrayToLatexPoly(response.data)
      setAnswer(answer)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="h-lvh font-mono">
      <Navbar />
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
              type="text"
              id="name"
              name="name"
              placeholder="[3, 2, 5, 7, 9]"
              onChange={(e) => handleYValuesChange(e, setYValues)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              X VALUES
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="[0, 1, 2, 3, 4]"
              onChange={(e) => handleXValuesChange(e, setXValues)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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
              placeholder="17"
              onChange={(e) => handleModulusChange(e, setModulus)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Compute
            </button>
          </div>
        </form>
        <div className="mb-5">
          <p className="font-bold underline text-base mb-1">Answer</p>
          <Latex>{answer}</Latex>
        </div>
      </div>
    </main>
  )
}
