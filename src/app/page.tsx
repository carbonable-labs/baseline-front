import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="text-center mb-8">
        <Link href="/">
          <span className="text-4xl font-bold hover:underline cursor-pointer">Baseline Calculator</span>
        </Link>
        <p className="text-xl text-gray-600">by Carbonable</p>
      </header>
      <main className="flex flex-col lg:flex-row w-full max-w-7xl">
        <Link href="/form?role=project-funder" className="relative flex-1 h-80 lg:h-[80vh] overflow-hidden group">
          <div className="relative w-full h-full">
            <Image
              src="/project-funder.jpg"
              alt="Project Funder"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out transform group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-3xl font-bold">Project Funder</span>
          </div>
        </Link>
        <Link href="/form?role=project-holder" className="relative flex-1 h-80 lg:h-[80vh] overflow-hidden group">
          <div className="relative w-full h-full">
            <Image
              src="/project-holder.jpg"
              alt="Project Holder"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out transform group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-3xl font-bold">Project Holder</span>
          </div>
        </Link>
      </main>
    </div>
  );
}
