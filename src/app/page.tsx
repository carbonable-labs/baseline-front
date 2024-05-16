import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: 'url(/background.jpg)' }}>
      <header className="text-center mb-8 bg-white bg-opacity-80 w-full max-w-4xl mx-auto py-4 shadow-md rounded-lg">
        <Link href="/">
          <span className="text-4xl font-bold text-green-900 hover:underline cursor-pointer">Baseline Calculator</span>
        </Link>
        <p className="text-xl text-gray-600">by Carbonable</p>
      </header>
      <main className="grid lg:grid-cols-2 grid-flow-row w-full max-w-7xl gap-4">
        <Link href="/form?role=project-funder" className="relative flex-1 h-80 lg:h-[80vh] overflow-hidden group rounded-lg shadow-lg">
          <div className="relative w-full h-full">
            <Image
              src="/project-funder.jpg"
              alt="Project Funder"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out transform group-hover:scale-110 rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-opacity duration-500 rounded-lg"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <span className="text-white text-3xl font-bold">Project Funder</span>
            </div>
          </div>
        </Link>
        <Link href="/form?role=project-holder" className="relative flex-1 h-80 lg:h-[80vh] overflow-hidden group rounded-lg shadow-lg">
          <div className="relative w-full h-full">
            <Image
              src="/project-holder.png"
              alt="Project Holder"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out transform group-hover:scale-110 rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-opacity duration-500 rounded-lg"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <span className="text-white text-3xl font-bold">Project Holder</span>
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
}
