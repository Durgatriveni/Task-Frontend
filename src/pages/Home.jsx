import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-[80vh] text-center">
        <div>
          <h2 className="text-4xl font-bold">Welcome to E-Commerce</h2>
          <p className="text-lg text-gray-600 mt-2">Browse our amazing products!</p>
        </div>
      </div>
    </>
  );
}
