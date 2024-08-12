import Image from 'next/image'

export default function Home() {
  return (
    <main className="container mx-auto px-4 h-lvh font-mono">
      <div className="mb-10 mt-10 pt-6 pb-6 pl-1">
        <p>MODCC - Modern Cryptography Calculator</p>
      </div>
      <div>
        <ul className="list-disc list-outside space-y-5">
          <li>
            <a href="/lagrange_interpolation">
              <p>Lagrange Interpolation Over Finite Field</p>
            </a>
          </li>
          <li>
            <p>Lagrange Interpolation Over Finite Field</p>
          </li>
        </ul>
      </div>
    </main>
  )
}
