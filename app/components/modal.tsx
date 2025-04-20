import axios from "axios";
import { useForm } from "react-hook-form";
import { WorkRow } from "../utils/types";
import { FC } from "react";

interface ModalProps {
  closeModal: () => void;
  currentWork: WorkRow;
}

const Modal: FC<ModalProps> = ({ closeModal, currentWork }) => {
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _id: currentWork._id,
      date: currentWork?.date ? currentWork.date.split("T")[0] : "",
      description: currentWork.description || "",
      amount:
        typeof currentWork.amount === "number" ? currentWork.amount : null,
      quantity: currentWork.quantity || 0,
      status: currentWork.status || "Pending",
      vehicleNo: currentWork.vehicleNo || "",
    },
  });

  const sendData = async (data: WorkRow) => {
    try {
      const response = await axios.put(`/api/jobs/?id=${currentWork._id}`, {
        ...data,
        _id: currentWork._id,
      });
      if (response.data.success) {
        closeModal();
      }
      console.log("Response from API:", response.data);
      console.log(data);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  // Handle form submission

  const onSubmit = (data: WorkRow) => {
    sendData(data);
  };

  return (
    <div className=" fixed inset-0 flex items-center justify-center backdrop-blur-[4px] bg-opacity-50">
      <div className="md:w-[60%] w-[80%] md:h-[70%] h-[50%] bg-white p-6 rounded-md shadow-md overflow-y-scroll pt-18">
        <div className="fixed flex justify-between items-center text-center bg-blue-500 text-white md:w-[60%] w-[80%] top-[25%] md:top-[10%] left-1/2 -translate-x-1/2 px-2 py-3 rounded-md shadow-blue-200 shadow-lg">
          <h2 className="text-2xl font-bold ">Edit Work</h2>
          <button
            className="z-[100] text-white hover:text-gray-800 cursor-pointer"
            onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">
                {errors.date.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Description
            </label>
            <input
              type="text"
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 100,
                  message: "Description cannot exceed 100 characters",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Amount
            </label>
            <input
              type="number"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">
                {errors.amount.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Quantity
            </label>
            <input
              type="number"
              {...register("quantity")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">
                {errors.quantity?.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full p-2 border border-gray-300 rounded-md">
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">
                {errors.status.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Vehicle No
            </label>
            <input
              type="text"
              {...register("vehicleNo", {
                required: "Vehicle number is required",
                pattern: {
                  value: /^[A-Za-z0-9\s-]+$/,
                  message: "Invalid vehicle number format",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.vehicleNo && (
              <p className="text-red-500 text-sm">
                {errors.vehicleNo.message?.toString()}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
