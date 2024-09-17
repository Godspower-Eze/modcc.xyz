import Image from 'next/image'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="flex justify-center items-center h-24">
      <Link href="/" passHref>
        <Image src="/logo.png" alt="Logo" width={200} height={50} />
      </Link>
    </nav>
  )
}
