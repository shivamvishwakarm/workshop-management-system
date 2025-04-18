import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-center mx-2 fixed bottom-0 left-0 w-full text-center bg-white py-3 shadow-md ">
      <Link
        href={"/add-work"}
        className="font-bold px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition md:w-auto w-full">
        Add Work
      </Link>
    </nav>
  );
};

export default Navbar;
