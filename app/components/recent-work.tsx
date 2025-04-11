"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentWork = () => {
  interface Job {
    _id: string;
    date: string;
    name: string;
    amount: number;
    // vehicleNo: string;
    // work: { description: string }[];
  }

  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    const getAllJobs = async () => {
      try {
        const data = await axios.get("/api/companies/summary");

        console.log("data.data.data", data.data.sendData);

        setJobs(data.data.sendData);
      } catch (error) {
        console.log(error);
      }
    };

    getAllJobs();
  }, []);

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h4 className="font-bold text-2xl px-2 pb-2">Recent work data: </h4>
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
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Company</th>

            {/* <th className="px-4 py-3">Status</th> */}
            {/* <th className="px-4 py-3">Due</th> */}
            <th className="px-4 py-3">Total Amount</th>
          </tr>
        </thead>

        {jobs &&
          jobs?.map((job) => (
            <tbody
              key={job._id}
              className="text-sm text-gray-700 divide-y divide-gray-200">
              <tr className="divide-x divide-gray-200">
                <td className="px-4 py-3">{job.date}</td>
                <td className="px-4 py-3">{job.name}</td>

                {/* <td className="px-4 py-3 text-green-600 font-semibold">
                <select
                  className="border border-green-600 px-2 py-1 rounded-md"
                  name="status"
                  id="status">
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="Pending">Pending</option>
                </select>
              </td> */}
                {/* <td className="px-4 py-3">$5,000</td> */}
                <td className="px-4 py-3"> ₹{job.amount}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default RecentWork;
