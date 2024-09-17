import { Footer } from './components/footer'
import { Navbar } from './components/navbar'
import { DM_Sans } from 'next/font/google'

export default function Home() {
  return (
    <div className=" bg-gray-100 flex flex-col min-h-screen text-xs">
      <Navbar />
      <main className="flex-grow flex font-semibold">
        <section className="w-full md:w-1/4 p-4"></section>
        <section className="w-full md:w-1/2 p-4">
          <div className="container mx-auto text-sm">
            <ul className="list-disc list-outside space-y-5">
              <li>
                <a
                  className="hover:text-blue-400"
                  href="/lagrange_interpolation"
                >
                  <p>Univariate Lagrange Interpolation Over Finite Field</p>
                </a>
              </li>
              <li>
                <a
                  className="hover:text-blue-400"
                  href="/multilinear_interpolation_over_bolean_hypercube"
                >
                  <p>Multilinear Interpolation Over the Boolean Hypercube</p>
                </a>
              </li>
              <li>
                <a className="hover:text-blue-400">
                  <p>Multilinear Lagrange Interpolation Over Finite Field</p>
                </a>
              </li>
              <li>
                <a className="hover:text-blue-400">
                  <p>Multivariate Lagrange Interpolation Over Finite Field</p>
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section className="w-full md:w-1/4 p-4"></section>
      </main>
      <Footer />
    </div>
  )
}
