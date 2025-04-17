import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-center mx-2 fixed bottom-0 left-0 w-full text-center bg-white py-3 shadow-md">
      {/* <Link
        href={"/company"}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Total company
      </Link> */}
      <Link
        href={"/add-work"}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Add
      </Link>
      {/* <Link
        href={"#"}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Total works
      </Link> */}
    </nav>
  );
};

export default Navbar;
