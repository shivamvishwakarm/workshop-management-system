import React from "react";
import Link from "next/link";

const AddWorkButton = () => {
  return (
    <Link
      href={"/add-work"}
      className="md:px-4 px-3 md:py-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-500 font-semi-bold  shadow-lg shadow-blue-500/50 hover:shadow-none transition-all duration-300 ease-in-out md:text-xl ">
      Add Work
    </Link>
  );
};

export default AddWorkButton;
