"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./modal";

const RecentWork = () => {
  interface Job {
    id: string;
    date: string;
    name: string;
    totalAmount: number;
  }

  const [companies, setCompanies] = useState<Job[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [compnayId, setCompanyId] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await axios.get("/api/companies");
        console.log(data.data.data);
        setCompanies(data.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanies();
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRowClick = (id: string) => {
    console.log(id);
    setCompanyId(id);
    setShowModal(true);
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h4 className="font-bold text-2xl px-2 pb-2">Company summary: </h4>
          <div className="space-x-2">
            <input
              className="border border-black "
              type="text"
              name=""
              id=""
              placeholder="Search data"
            />
            <select className="border border-black" name="select" id="select">
              <option value="" disabled>
                {" "}
                select
              </option>
              <option value="company">company</option>
              <option value="date">date</option>
              <option value="status">status</option>
            </select>
          </div>
        </div>
      </div>

      {/* recent work table with date, company, vehicle, description, status, amount*/}

      <table className="w-full table-auto border-separate border-spacing-0 text-left overflow-x-auto">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr className="text-gray-600 uppercase text-sm font-medium [&>th:not(:last-child)]:border-r [&>th]:border-gray-300">
            <th className="px-4 py-3">Company</th>

            {/* <th className="px-4 py-3">Status</th> */}
            {/* <th className="px-4 py-3">Due</th> */}
            <th className="px-4 py-3">Total Amount</th>
          </tr>
        </thead>

        {companies &&
          companies?.map((job, idx) => (
            <tbody
              onClick={() => handleRowClick(job.id)}
              key={idx}
              className="text-sm text-gray-700 divide-y divide-gray-200">
              <tr className="divide-x divide-gray-200">
                <td className="px-4 py-3">{job.name}</td>
                <td className="px-4 py-3 font-bold">
                  <span className="font-bold">₹</span> {job.totalAmount}
                </td>
              </tr>
            </tbody>
          ))}
      </table>
      {showModal && <Modal companyId={compnayId} closeModal={closeModal} />}
    </div>
  );
};

export default RecentWork;
