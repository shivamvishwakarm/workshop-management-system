import axios from "axios";
import { useForm } from "react-hook-form";
import { WorkRow } from "../utils/types";
import { FC } from "react";
import { toast } from "sonner";


interface ModalProps {
  closeModal: () => void;
  currentWork: WorkRow;
}

const Modal: FC<ModalProps> = ({ closeModal, currentWork }) => {
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
        toast.success("Work updated successfully");
        closeModal();
      }
    } catch (error) {
      toast.error("Failed to update work");
      console.error("Error during API call:", error);
    }
  };

  const onSubmit = (data: WorkRow) => {
    sendData(data);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content mx-4"
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Edit Work Entry</h2>
          <button className="modal-close" onClick={closeModal}>
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Date Field */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="input"
              />
              {errors.date && (
                <p className="form-error">{errors.date.message?.toString()}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 100,
                    message: "Description cannot exceed 100 characters",
                  },
                })}
                className="textarea min-h-[80px]"
                placeholder="Enter work description"
              />
              {errors.description && (
                <p className="form-error">
                  {errors.description.message?.toString()}
                </p>
              )}
            </div>

            {/* Amount and Quantity Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  {...register("amount", {
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Amount must be greater than 0" },
                  })}
                  className="input font-mono"
                  placeholder="0"
                />
                {errors.amount && (
                  <p className="form-error">
                    {errors.amount.message?.toString()}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  {...register("quantity")}
                  className="input"
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="form-error">
                    {errors.quantity?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            {/* Status Field */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select {...register("status", { required: "Status is required" })} className="select">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Billed">Billed</option>
              </select>
              {errors.status && (
                <p className="form-error">
                  {errors.status.message?.toString()}
                </p>
              )}
            </div>

            {/* Vehicle No Field */}
            <div className="form-group">
              <label className="form-label">Vehicle Number</label>
              <input
                type="text"
                {...register("vehicleNo", {
                  required: "Vehicle number is required",
                  pattern: {
                    value: /^[A-Za-z0-9\s-]+$/,
                    message: "Invalid vehicle number format",
                  },
                })}
                className="input uppercase"
                placeholder="MH12AB1234"
              />
              {errors.vehicleNo && (
                <p className="form-error">
                  {errors.vehicleNo.message?.toString()}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn btn-primary flex-1">
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
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Save Changes
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
