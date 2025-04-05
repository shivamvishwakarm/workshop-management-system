import React from "react";

const RecentWork = () => {
  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h4>Recent work data</h4>
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
              <option value="vehicle">vehicle</option>
              <option value="company">company</option>
              <option value="date">date</option>
              <option value="description">description</option>
            </select>
          </div>
        </div>
      </div>

      {/* recent work table with date, company, vehicle, description, status, amount*/}

      <table className="w-full table-auto border-separate border-spacing-0 text-left">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr className="text-gray-600 uppercase text-sm font-medium [&>th:not(:last-child)]:border-r [&>th]:border-gray-300">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Amount</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
          <tr className="divide-x divide-gray-200">
            <td className="px-4 py-3">2023-01-01</td>
            <td className="px-4 py-3">Company A</td>
            <td className="px-4 py-3">Vehicle A</td>
            <td className="px-4 py-3">Description A</td>
            <td className="px-4 py-3 text-green-600 font-semibold">Paid</td>
            <td className="px-4 py-3">$5,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentWork;
