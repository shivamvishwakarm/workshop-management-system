"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

type WorkRow = {
  description: string;
  quantity: string;
  amount: number;
  status: string;
};

type FormData = {
  company: string;
  vehicleNo: string;
  date: string;
  workRows: WorkRow[];
  image: File | null;
};

const WorkRowComponent = ({
  index,
  register,
}: {
  index: number;
  register: any;
  workRow: WorkRow;
}) => {
  return (
    <tr className="bg-white border-b">
      <td className="p-2">
        <textarea
          {...register(`workRows.${index}.description`)}
          className="border border-gray-300 p-2 rounded w-full min-h-[60px]"
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
          placeholder="Total amount"
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
          <option value="Completed">Completed</option>
        </select>
      </td>
    </tr>
  );
};

const AddWorkForm = () => {
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>(
    []
  );
  const { register, handleSubmit, watch, control, setValue } =
    useForm<FormData>({
      defaultValues: {
        company: "",
        vehicleNo: "",
        date: "",
        workRows: [{ description: "", quantity: "", amount: 0, status: "" }],
        image: null,
      },
    });
  const [customInput, setCustomInput] = useState(false);

  const { fields, append } = useFieldArray({
    control,
    name: "workRows",
  });

  const workRows = watch("workRows");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    let total = 0;
    workRows.forEach((workRow) => {
      console.log("workRow.amount", workRow.amount);
      total += Number(workRow.amount);
    });
    setTotalAmount(total);
  }, [workRows]);

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    const response = await axios.post("/api/jobs", data);
    console.log(response.data);
  };

  useEffect(() => {
    const c = async () => {
      try {
        const data = await axios.get("/api/companies");
        console.log("data.data.data", data.data.data);
        setCompanies(data.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    c();
  }, []);

  useEffect(() => {
    console.log("companies", companies);
  }, [setCompanies, companies]);

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

        <input
          type="text"
          placeholder="Vehicle No."
          {...register("vehicleNo")}
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="date"
          {...register("date")}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Work Rows Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">Work Description</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <WorkRowComponent
                key={field.id}
                index={index}
                register={register}
                workRow={workRows[index]}
              />
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          <button
            type="button"
            onClick={() =>
              append({ description: "", quantity: "", amount: 0, status: "" })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Row
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-medium mb-1">Upload Image</label>
        <input
          multiple
          type="file"
          accept="image/*"
          {...register("image")}
          className="block w-full border border-gray-300 p-2 rounded"
        />
        <input
          className="border border-gray-300 p-2 rounded"
          type="text"
          value={totalAmount}
          disabled
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
