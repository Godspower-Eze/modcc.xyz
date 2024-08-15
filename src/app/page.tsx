import { Navbar } from './components/navbar'

export default function Home() {
  return (
    <main className="h-lvh font-mono">
      <Navbar />
      <div className="container mx-auto text-sm">
        <ul className="list-disc list-outside space-y-5">
          <li>
            <a className="hover:text-blue-400" href="/lagrange_interpolation">
              <p>Univariate Lagrange Interpolation Over Finite Field</p>
            </a>
          </li>
          <li>
            <a className="hover:text-blue-400">
              <p>Multivariate Lagrange Interpolation Over Finite Field</p>
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}
