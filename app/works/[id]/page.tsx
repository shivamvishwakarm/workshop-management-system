"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/app/components/modal";
import { WorkRow } from "@/app/utils/types";
import axios from "axios";
import { toast } from "sonner";


const Page = () => {
  const router = useParams();
  const route = useRouter();
  const { id } = router;
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [currentWork, setCurrentWork] = useState<WorkRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);

  const getAllWorksById = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/?company=${id}`);
      const data = await response.json();
      setWorks(data.data);
    } catch (error) {
      toast.error("Failed to fetch works");
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    getAllWorksById();
  }, [id, isModalOpen, currentWork, getAllWorksById]);

  useEffect(() => {
    let total = 0;
    works.forEach((work) => {
      if (work.status.toLowerCase() === "pending") {
        total += work.amount ?? 0;
      }
    });
    setTotalPendingAmount(total);
  }, [works]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  function handleEdit(work: WorkRow): void {
    setCurrentWork(work);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string): Promise<void> {
    if (!id) {
      toast.error("Work id is required");
      return;
    }
    const confirmm = confirm("Are you sure you want to delete this work?");
    if (!confirmm) {
      return;
    }
    try {
      const response = await axios.delete(`/api/jobs/?id=${id}`);

      if (response.data.success) {
        toast.success("Work deleted successfully");
        route.push("/");
      }
    } catch (error) {
      toast.error("Failed to delete work");
      console.log(error);
    }
  }

  const getStatusPillClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "status-pill status-paid";
      case "pending":
        return "status-pill status-pending";
      case "billed":
        return "status-pill status-billed";
      default:
        return "status-pill bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
        <button onClick={() => route.back()} className="back-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Page Content */}
      <div className="px-4 md:px-6 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Work Details
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage work entries for this company
          </p>
        </div>

        {/* Stats Card */}
        <div className="stat-card max-w-sm mb-6">
          <p className="stat-card-label">Total Pending Amount</p>
          <p className="stat-card-value">
            ₹{totalPendingAmount.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Works Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Status</th>
                  <th>Vehicle No</th>
                  <th className="text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {works.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="text-slate-500 font-medium">
                          No work entries found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  works.map((work: WorkRow) => (
                    <tr
                      key={work._id}
                      className={work.status === "Paid" ? "row-paid" : ""}>
                      <td className="whitespace-nowrap">
                        {formatDate(work.date)}
                      </td>
                      <td className="max-w-xs">
                        <span className="line-clamp-2">{work.description}</span>
                      </td>
                      <td className="col-amount whitespace-nowrap">
                        ₹{work.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="text-center">{work.quantity}</td>
                      <td className="text-center">
                        <span className={getStatusPillClass(work.status)}>
                          {work.status}
                        </span>
                      </td>
                      <td className="uppercase font-mono text-xs">
                        {work.vehicleNo}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            disabled={work.status === "Paid"}
                            onClick={() => handleEdit(work)}
                            className={`btn-icon ${work.status === "Paid"
                              ? "opacity-30 cursor-not-allowed"
                              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                            title="Edit work">
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
                            disabled={work.status === "Paid"}
                            onClick={() => handleDelete(work._id)}
                            className={`btn-icon ${work.status === "Paid"
                              ? "opacity-30 cursor-not-allowed"
                              : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                              }`}
                            title="Delete work">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {currentWork && isModalOpen && (
        <Modal closeModal={toggleModal} currentWork={currentWork} />
      )}
    </div>
  );
};

export default Page;
