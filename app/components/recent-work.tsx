"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCompanies, setFilteredCompanies] = useState<Job[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/companies");
        setCompanies(data.data);
        setFilteredCompanies(data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        alert(error);
        console.error(error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      const filtered = companies?.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered || []);
      setIsLoading(false);
    } else {
      setFilteredCompanies(companies);
      setIsLoading(false);
    }
  }, [searchQuery, companies]);

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
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setEditingCompanyId(null);
    setEditedName("");
  };

  const handleDeleteClick = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this company?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/api/companies/?id=${id}`);
      setCompanies((prevCompanies) =>
        prevCompanies
          ? prevCompanies.filter((company) => company._id !== id)
          : null
      );
    } catch (error) {
      alert("Failed to delete company.");
      console.error(error);
    }
  };

  const handleRowClick = (id: string) => {
    if (editingCompanyId !== id) {
      router.push(`/works/${id}`);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto    border border-gray-400/50 m-2   rounded-md  md:p-10 mx-4">
      <div>
        <div className="flex flex-row items-center justify-between w-full  p-2">
          <h4 className="font-bold text-sm md:text-2xl text-center md:text-left pb-2">
            Company Summary:
          </h4>

          <input
            className="border-2 border-black px-2 py-1 rounded-md md:w-1/5  w-1/2 "
            type="text"
            placeholder="Search By Company Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full table-auto table-fixed border-collapse  border-separate border-spacing-0 text-left ">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr className="text-gray-600 uppercase text-sm font-medium [&>th:not(:last-child)]:border-r [&>th]:border-gray-300">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Total Pending Amount</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <div className="flex justify-center items-center">Loading...</div>
          ) : (
            filteredCompanies &&
            filteredCompanies.map((company) => (
              <tr
                onClick={() => handleRowClick(company._id)}
                key={company._id}
                className="divide-x divide-gray-200 cursor-pointer hover:bg-gray-100">
                <td className="px-4 py-3">
                  {editingCompanyId === company._id ? (
                    <input
                      className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    company.name
                  )}
                </td>
                <td className="px-4 py-3 font-bold">
                  <span className="font-bold">₹</span> {company.totalAmount}
                </td>
                <td className="px-4 py-3">
                  {editingCompanyId === company._id ? (
                    <div className="space-x-2 space-y-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveClick(company._id);
                        }}>
                        Save
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelClick();
                        }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="md:space-x-2 md:text-left text-center">
                      <button
                        className=" md:px-3 md:py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(company._id, company.name);
                        }}>
                        <Image
                          src="icons/edit.svg"
                          alt="Edit"
                          width={20}
                          height={20}
                        />
                      </button>
                      <button
                        className=" text-white px-3 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(company._id);
                        }}>
                        <Image
                          src="icons/delete.svg"
                          alt="Edit"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentWork;
