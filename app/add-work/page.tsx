"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";

const AddWorkForm = () => {
  const [companies, setCompanies] = useState([]);
  const [customInput, setCustomInput] = useState(false);
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      company: "",
      workRows: [
        {
          description: "",
          quantity: "",
          amount: 0,
          status: "",
          date: Date,
          vehicleNo: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workRows",
  });

  // Watch all rows or specific fields
  const workRows = watch("workRows");

  // Calculate total dynamically by watching `amount` fields
  const totalAmount = workRows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const response = await axios.post("/api/jobs", data);
    console.log(response.data);
  };

  const handleAddRow = () => {
    const lastRow = workRows[workRows.length - 1];
    if (
      lastRow.description.trim() === "" ||
      !lastRow.quantity ||
      !lastRow.amount
    ) {
      alert(
        "Please fill in all fields of the last row before adding a new row."
      );
      return;
    }
    append({
      description: "",
      quantity: "",
      amount: 0,
      status: "",
      date: Date,
      vehicleNo: "",
    });
  };

  const handleRemoveRow = (index) => {
    if (fields.length === 1) {
      alert("At least one work row is required.");
      return;
    }
    remove(index);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await axios.get("/api/companies");
        setCompanies(data.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-center">Form for Adding Work</h2>

      {/* Company Field */}
      <div className="grid md:grid-cols-2 gap-4">
        {!customInput ? (
          <select
            {...register("company")}
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustomInput(true);
                setValue("company", ""); // Clear the field
              }
            }}>
            <option value="">Select Existing Company</option>
            <option className="text-blue-500" value="custom">
              Add New Company
            </option>
            {companies.map((company) => (
              <option key={company._id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              {...register("company")}
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Enter company name"
            />
            <button
              type="button"
              onClick={() => setCustomInput(false)}
              className="text-blue-500 underline">
              Back to Select
            </button>
          </div>
        )}
      </div>

      {/* Work Rows Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">Work Description</th>

              <th className="p-2">Vehicle NO.</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>

              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="bg-white border-b">
                <td className="p-2">
                  <textarea
                    {...register(`workRows.${index}.description`)}
                    className="border border-gray-300 p-2 rounded w-full min-h-[60px]"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Vehicle No."
                    type="text"
                    {...register(`workRows.${index}.vehicleNo`)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Quantity"
                    type="number"
                    {...register(`workRows.${index}.quantity`)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    placeholder="Amount"
                    type="number"
                    {...register(`workRows.${index}.amount`)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <select
                    {...register(`workRows.${index}.status`)}
                    className="border border-gray-300 p-2 rounded w-full">
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>

                <td className="p-2">
                  <input
                    type="date"
                    {...register(`workRows.${index}.date`)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-600 underline">
                    Delete
                  </button>
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

      {/* Total Amount */}
      <div className="mt-4">
        <label className="block font-medium mb-1">Total Amount</label>
        <input
          type="text"
          value={totalAmount}
          disabled
          className="border border-gray-300 p-2 rounded w-full bg-gray-200"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddWorkForm;
