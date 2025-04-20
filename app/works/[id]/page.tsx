"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/app/components/modal";
import { WorkRow } from "@/app/utils/types";

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

  return (
    <div className="p-4">
      {/* Page Header */}
      <h1 className="text-2xl md:text-3xl font-bold px-2 md:px-4 py-2 mb-4">
        <span
          className="cursor-pointer text-xl md:text-3xl font-bold px-2 md:px-4 py-1 md:py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition mx-1 md:mx-2 text-center"
          onClick={() => route.back()}>
          ←
        </span>
        Works
      </h1>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 font-semibold">
              <th className="border border-gray-300 px-2 md:px-4 py-2">Date</th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Description
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Amount
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Quantity
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Status
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Vehicle No
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {works.map((work: WorkRow) => (
              <tr
                key={work._id}
                className={`${
                  work.status === "Paid"
                    ? "line-through opacity-50 cursor-not-allowed"
                    : ""
                }`}>
                <td className="border border-gray-300 px-2 md:px-4 py-2">
                  {work.date ? work.date.split("T")[0] : "N/A"}
                </td>
                <td className="border border-gray-300 px-2 md:px-4 py-2">
                  {work.description}
                </td>
                <td className="border border-gray-300 px-2 md:px-4 py-2 font-black">
                  ₹ {work.amount}
                </td>
                <td className="border border-gray-300 px-2 md:px-4 py-2">
                  {work.quantity}
                </td>
                <td
                  className={`border border-gray-300 px-2 md:px-4 py-2 ${
                    work.status === "Paid" ? "bg-green-200" : "bg-red-200"
                  }`}>
                  {work.status}
                </td>
                <td className="border border-gray-300 px-2 md:px-4 py-2 uppercase">
                  {work.vehicleNo}
                </td>
                <td className="border border-gray-300 px-2 md:px-4 py-2">
                  <button
                    onClick={() => handleEdit(work)}
                    className={`px-2 md:px-4 py-1 md:py-2 rounded-md transition bg-blue-400 hover:bg-blue-500`}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Pending Amount */}
      <p className="font-bold pt-4 text-sm md:text-lg">
        Total Pending Amount:{" "}
        <span className="font-black text-base">₹ {totalPendingAmount}</span>
      </p>

      {/* Modal */}
      {currentWork && isModalOpen && (
        <Modal closeModal={toggleModal} currentWork={currentWork} />
      )}
    </div>
  );
};

export default Page;
