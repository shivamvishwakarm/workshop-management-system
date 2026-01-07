"use client";
import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSkeleton from "./Loading-skeleton";


const RecentWork = () => {
  interface Job {
    _id: string;
    date: string;
    name: string;
    totalAmount: number;
  }

  interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasMore: boolean;
  }

  const [companies, setCompanies] = useState<Job[]>([]);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCompanies, setFilteredCompanies] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasMore: false
  });
  const router = useRouter();

  const fetchCompanies = useCallback(async (page: number = 1, limit: number = 10, append = false) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/companies?page=${page}&limit=${limit}`);
      if (append) {
        setCompanies((prev) => [...prev, ...data.data]);
        setFilteredCompanies((prev) => [...prev, ...data.data]);
      } else {
        setCompanies(data.data);
        setFilteredCompanies(data.data);
      }
      setPagination(data.pagination);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch companies");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCompanies(1, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      const filtered = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setIsLoading(false);
    } else {
      setFilteredCompanies(companies);
      setIsLoading(false);
    }
  }, [searchQuery, companies]);


  // Infinite scroll fetch next page
  const fetchNext = () => {
    if (pagination.hasMore) {
      fetchCompanies(pagination.currentPage + 1, pagination.limit, true);
    }
  };

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
          : []
      );
      setEditingCompanyId(null);
      setEditedName("");
      toast.success("Company name updated successfully");
    } catch (error) {
      toast.error("Failed to update company name");
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
      // Refresh current page after delete
      fetchCompanies(1, pagination.limit);
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error("Failed to delete company");
      console.error(error);
    }
  };

  const handleRowClick = (id: string) => {
    if (editingCompanyId !== id) {
      router.push(`/works/${id}`);
    }
  };


  // Empty state
  const EmptyState = () => (
    <tr>
      <td colSpan={3} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-slate-500 font-medium">No companies found</p>
          <p className="text-slate-400 text-sm">
            {searchQuery
              ? "Try a different search term"
              : "Add your first work to get started"}
          </p>
        </div>
      </td>
    </tr>
  );



  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Company Summary</h2>

        {/* Search Input */}
        <div className="search-container w-full sm:w-64">
          <svg
            className="search-icon h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


      {/* Table with Infinite Scroll */}
      <div className="overflow-x-auto">
        <InfiniteScroll
          dataLength={filteredCompanies.length}
          next={fetchNext}
          hasMore={pagination.hasMore}
          loader={<> Loading...</> }
          scrollableTarget={undefined}
        >
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="w-1/2">Company</th>
                <th className="text-right">Total Pending</th>
                <th className="text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies && filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr
                    onClick={() => handleRowClick(company._id)}
                    key={company._id}
                    className="cursor-pointer group">
                    <td className="font-medium text-slate-900">
                      {editingCompanyId === company._id ? (
                        <input
                          className="input py-1.5"
                          type="text"
                          value={editedName}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        company.name
                      )}
                    </td>
                    <td className="col-amount">
                      ₹{company.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      {editingCompanyId === company._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="btn btn-primary py-1.5 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveClick(company._id);
                            }}>
                            Save
                          </button>
                          <button
                            className="btn btn-secondary py-1.5 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelClick();
                            }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 ">
                          <button
                            className="btn-icon text-slate-500 hover:text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(company._id, company.name);
                            }}
                            title="Edit company name">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="btn-icon text-slate-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(company._id);
                            }}
                            title="Delete company">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : isLoading ? <LoadingSkeleton/> :  (
                <EmptyState />
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>


    </div>
  );
};

export default RecentWork;


