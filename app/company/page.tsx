"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CompanyJob {
  id: number;
  companyName: string;
  totalJobs: number;
  paymentStatus: "Pending" | "Partial" | "Done";
  paidAmount?: number;
  totalPendingAmount: number;
}

export default function AddWorkForm() {
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState("companyName");
  const router = useRouter();
  const [jobs, setJobs] = useState<CompanyJob[]>([
    {
      id: 1,
      companyName: "Company A",
      totalJobs: 5,
      paymentStatus: "Partial",
      paidAmount: 300,
      totalPendingAmount: 200,
    },
    {
      id: 2,
      companyName: "Company B",
      totalJobs: 3,
      paymentStatus: "Pending",
      totalPendingAmount: 500,
    },
    {
      id: 3,
      companyName: "Company C",
      totalJobs: 7,
      paymentStatus: "Done",
      totalPendingAmount: 0,
    },
  ]);

  const filteredJobs = jobs.filter((job) => {
    const term = search.toLowerCase();
    const value = job[searchFilter as keyof CompanyJob];
    return typeof value === "string" && value.toLowerCase().includes(term);
  });

  const handleCompanyClick = (id: number) => {
    router.push(`/company/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full md:w-1/2"
          />
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full md:w-1/4">
            <option value="companyName">Company Name</option>
            <option value="paymentStatus">Payment Status</option>
          </select>
        </div>

        <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">Company Name</th>
              <th className="p-2">Total Jobs</th>
              <th className="p-2">Payment Status</th>
              <th className="p-2">Paid Amount</th>
              <th className="p-2">Total Pending Amount</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr
                onClick={() => handleCompanyClick(job.id)}
                key={job.id}
                className="bg-white border-b hover:bg-gray-100">
                <td className="p-2">{job.companyName}</td>
                <td className="p-2">{job.totalJobs}</td>
                <td className="p-2">{job.paymentStatus}</td>
                <td className="p-2">
                  {job.paymentStatus === "Partial" ? (
                    <input
                      type="number"
                      value={job.paidAmount || ""}
                      onChange={(e) => {
                        const newJobs = jobs.map((j) =>
                          j.id === job.id
                            ? { ...j, paidAmount: parseFloat(e.target.value) }
                            : j
                        );
                        setJobs(newJobs);
                      }}
                      className="border border-gray-300 p-1 rounded w-24"
                    />
                  ) : job.paymentStatus === "Done" ? (
                    "—"
                  ) : (
                    "0"
                  )}
                </td>
                <td className="p-2">{job.totalPendingAmount}</td>
                <td className="p-2 space-x-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
