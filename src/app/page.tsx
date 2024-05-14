import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Baseline Calculator</h1>
        <p className="text-xl text-gray-600">by Carbonable</p>
      </header>
      <main className="flex w-full max-w-6xl">
        <Link href="https://yourtypeformlink.com/project-funder" className="relative flex-1 h-[30rem] overflow-hidden group">
          <Image
            src="/project-funder.jpg"
            alt="Project Funder"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out transform group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-2xl font-semibold">Project Funder</span>
          </div>
        </Link>
        <Link href="https://yourtypeformlink.com/project-holder" className="relative flex-1 h-[30rem] overflow-hidden group">
          <Image
            src="/project-holder.jpg"
            alt="Project Holder"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out transform group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-2xl font-semibold">Project Holder</span>
          </div>
        </Link>
      </main>
    </div>
  );
}
