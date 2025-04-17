"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RecentWork = () => {
  interface Job {
    _id: string;
    date: string;
    name: string;
    totalAmount: number;
  }

  const [companies, setCompanies] = useState<Job[] | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await axios.get("/api/companies");
        setCompanies(data.data.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    };

    fetchCompanies();
  }, []);

  const handleEditClick = (id: string, currentName: string) => {
    setEditingCompanyId(id);
    setEditedName(currentName);
  };

  const handleSaveClick = async (id: string) => {
    try {
      await axios.put(`/api/companies/?id=${id}`, { name: editedName });
      setCompanies((prevCompanies) =>
        prevCompanies
          ? prevCompanies.map((company) =>
              company._id === id ? { ...company, name: editedName } : company
            )
          : null
      );
      setEditingCompanyId(null);
      setEditedName("");
    } catch (error) {
      alert("Failed to update company name.");
      console.log(error);
    }
  };

  const handleCancelClick = () => {
    setEditingCompanyId(null);
    setEditedName("");
  };

  const handleRowClick = (id: string) => {
    if (editingCompanyId !== id) {
      router.push(`/works/${id}`);
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h4 className="font-bold text-2xl px-2 pb-2">Company summary: </h4>
          <div className="space-x-2">
            <input
              className="border-2 border-black mx-2 px-2 py-1 rounded-md"
              type="text"
              name=""
              id=""
              placeholder="Search By Company Name"
            />
          </div>
        </div>
      </div>

      <table className="w-full table-auto border-separate border-spacing-0 text-left overflow-x-auto overflow-y-auto px-10 rounded max-h-[500px]">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr className="text-gray-600 uppercase text-sm font-medium [&>th:not(:last-child)]:border-r [&>th]:border-gray-300">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Total Pending Amount</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        {companies &&
          companies.map((job) => (
            <tbody
              key={job._id}
              className="text-sm text-gray-700 divide-y divide-gray-200 ">
              <tr className="divide-x divide-gray-200">
                <td className="px-4 py-3">
                  {editingCompanyId === job._id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border px-2 py-1 rounded-md"
                    />
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => handleRowClick(job._id)}>
                      {job.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold">
                  <span className="font-bold">₹</span> {job.totalAmount}
                </td>
                <td className="px-4 py-3">
                  {editingCompanyId === job._id ? (
                    <div className="space-x-2">
                      <button
                        className="text-green-500"
                        onClick={() => handleSaveClick(job._id)}>
                        Save
                      </button>
                      <button
                        className="text-red-500"
                        onClick={handleCancelClick}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="cursor-pointer text-white bg-blue-500 px-3 py-1 text-lg rounded-md"
                      onClick={() => handleEditClick(job._id, job.name)}>
                      Edit Company Name
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default RecentWork;
