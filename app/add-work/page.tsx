"use client";
import { useState } from "react";

interface WorkRow {
  description: string;
  rate: string;
  quantity: string;
  amount: string;
  status: string;
}

export default function AddWorkForm() {
  const [company, setCompany] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [date, setDate] = useState("");
  const [workRows, setWorkRows] = useState<WorkRow[]>([
    {
      description: "",
      rate: "",
      quantity: "",
      amount: "",
      status: "",
    },
  ]);
  const [image, setImage] = useState<File | null>(null);

  const handleAddRow = () => {
    setWorkRows([
      ...workRows,
      { description: "", rate: "", quantity: "", amount: "", status: "" },
    ]);
  };

  const handleWorkChange = (
    index: number,
    field: keyof WorkRow,
    value: string
  ) => {
    const updatedRows = [...workRows];
    updatedRows[index][field] = value;
    if (field === "rate" || field === "quantity") {
      const rate = parseFloat(updatedRows[index].rate) || 0;
      const quantity = parseFloat(updatedRows[index].quantity) || 0;
      updatedRows[index].amount = (rate * quantity).toFixed(2);
    }
    setWorkRows(updatedRows);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-center">Form for Adding Work</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          className="border border-gray-300 p-2 rounded"
          value={company}
          onChange={(e) => setCompany(e.target.value)}>
          <option value="">Select Company</option>
          <option value="Company A">Company A</option>
          <option value="Company B">Company B</option>
          <option value="Company C">Company C</option>
        </select>

        <input
          type="text"
          placeholder="Vehicle No."
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">Work Description</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {workRows.map((row, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="p-2">
                  <textarea
                    value={row.description}
                    onChange={(e) =>
                      handleWorkChange(index, "description", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full min-h-[60px]"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleWorkChange(index, "rate", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleWorkChange(index, "quantity", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.amount}
                    disabled
                    className="border border-gray-200 bg-gray-100 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      handleWorkChange(index, "status", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full">
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Row
          </button>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full border border-gray-300 p-2 rounded"
        />
        {image && (
          <p className="text-sm text-gray-600 mt-2">Selected: {image.name}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit
        </button>
      </div>
    </form>
  );
}
