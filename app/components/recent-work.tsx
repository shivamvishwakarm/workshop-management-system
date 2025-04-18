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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCompanies, setFilteredCompanies] = useState<Job[] | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get("/api/companies");
        setCompanies(data.data);
        setFilteredCompanies(data.data);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = companies?.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered || []);
    } else {
      setFilteredCompanies(companies);
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
    <div className="mb-32   max-h-[400px] mx-auto overflow-y-auto ">
      <div>
        <div className="flex justify-between">
          <h4 className="font-bold text-2xl px-2 pb-2">Company Summary: </h4>
          <div className="space-x-2">
            <input
              className="border-2 border-black mx-2 px-2 py-1 rounded-md"
              type="text"
              placeholder="Search By Company Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <table className="w-full table-auto border-separate border-spacing-0 text-left overflow-x-auto">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr className="text-gray-600 uppercase text-sm font-medium [&>th:not(:last-child)]:border-r [&>th]:border-gray-300">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Total Pending Amount</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies &&
            filteredCompanies.map((company) => (
              <tr
                onClick={() => handleRowClick(company._id)}
                key={company._id}
                className="divide-x divide-gray-200 cursor-pointer hover:bg-gray-100">
                <td className="px-4 py-3">
                  {editingCompanyId === company._id ? (
                    <input
                      className="border border-gray-300 rounded-md px-2 py-1"
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
                    <div className="space-x-2">
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
                    <div className="space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(company._id, company.name);
                        }}>
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(company._id);
                        }}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentWork;
