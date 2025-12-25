"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";


interface WorkRow {
  description: string;
  quantity: string;
  amount: number | null;
  status: string;
  date: string | null;
  vehicleNo: string;
}

interface FormData {
  company: string;
  workRows: WorkRow[];
}

const AddWorkForm = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [customInput, setCustomInput] = useState(false);
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      company: "",
      workRows: [
        {
          description: "",
          quantity: "",
          amount: null,
          status: "",
          date: null,
          vehicleNo: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workRows",
  });

  const workRows = watch("workRows");

  const totalAmount = workRows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );

  const formDataValidation = (formData: FormData) => {
    if (formData.company === "") {
      toast.error("Please select a company");
      return false;
    }
    formData.workRows.map((row) => {
      if (
        row.amount === null ||
        row.amount <= 0 ||
        !row.description ||
        !row.date ||
        !row.status
      ) {
        toast.error("Please fill in all required fields");
        return false;
      }
    });

    return true;
  };

  const onSubmit = async (formData: FormData) => {
    if (!formDataValidation(formData)) {
      return;
    }

    try {
      const response = await axios.post("/api/jobs", formData);
      if (response.data.success) {
        toast.success("Work added successfully");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to add work");
      console.error(error);
    }
  };

  const handleAddRow = () => {
    const lastRow = workRows[workRows.length - 1];
    if (lastRow.description.trim() === "" || !lastRow.amount) {
      toast.warning("Please fill in the last row before adding a new one");
      return;
    }
    append({
      description: "",
      quantity: "",
      amount: null,
      status: "",
      date: null,
      vehicleNo: "",
    });
  };

  const isSubmitDisabled = workRows.some((row) => {
    const { description, quantity, amount, status, date, vehicleNo } = row;

    const isInvalid =
      !description ||
      description.trim() === "" ||
      !quantity ||
      quantity.trim() === "" ||
      amount === null ||
      amount <= 0 ||
      !status ||
      status.trim() === "" ||
      !vehicleNo ||
      vehicleNo.trim() === "" ||
      !date ||
      isNaN(Date.parse(date));

    return isInvalid;
  });

  const handleRemoveRow = (index: number) => {
    if (fields.length === 1) {
      toast.warning("At least one work row is required");
      return;
    }
    remove(index);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch all companies by setting a high limit to override pagination
        const data = await axios.get("/api/companies?limit=1000");
        setCompanies(data.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
        <Link href="/" className="back-btn">
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
        </Link>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Add New Work
            </h1>
            <p className="text-slate-500 mt-2">
              Create work entries for a company
            </p>
          </div>

          {/* Company Selection Card */}
          <div className="form-card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Company Details
            </h2>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              {!customInput ? (
                <select
                  {...register("company")}
                  className="select"
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setCustomInput(true);
                      setValue("company", "");
                    }
                  }}>
                  <option value="">Select Existing Company</option>
                  <option value="custom" className="text-blue-600 font-medium">
                    + Add New Company
                  </option>
                  {companies.map((company) => (
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    {...register("company")}
                    className="input flex-1"
                    placeholder="Enter company name"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomInput(false)}
                    className="btn btn-secondary whitespace-nowrap">
                    Back to Select
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Work Rows Card */}
          <div className="form-card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Work Entries
            </h2>

            <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
              <table className="table w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider rounded-tl-lg">
                      Description
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">
                      Vehicle No.
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider rounded-tr-lg w-16"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {fields.map((field, index) => (
                    <tr
                      key={field.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3">
                        <textarea
                          {...register(`workRows.${index}.description`)}
                          className="textarea min-h-[60px] text-sm"
                          placeholder="Work description..."
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          placeholder="MH12AB1234"
                          type="text"
                          {...register(`workRows.${index}.vehicleNo`)}
                          className="input text-sm uppercase"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          placeholder="1"
                          type="number"
                          {...register(`workRows.${index}.quantity`)}
                          className="input text-sm w-20"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          placeholder="₹0"
                          type="number"
                          {...register(`workRows.${index}.amount`)}
                          className="input text-sm w-28 font-mono"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <select
                          {...register(`workRows.${index}.status`)}
                          className="select text-sm">
                          <option value="">Select</option>
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Billed">Billed</option>
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <input
                          max={new Date().toISOString().split("T")[0]}
                          type="date"
                          {...register(`workRows.${index}.date`)}
                          className="input text-sm"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="btn-icon text-slate-400 hover:text-red-500 hover:bg-red-50"
                          title="Remove row">
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
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddRow}
                className="btn btn-secondary">
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Row
              </button>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="stat-card">
            <p className="stat-card-label">Total Amount</p>
            <p className="stat-card-value">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              disabled={isSubmitDisabled}
              type="submit"
              className={`btn px-8 py-3 text-base ${isSubmitDisabled
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "btn-success"
                }`}>
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
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Submit Work
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkForm;
