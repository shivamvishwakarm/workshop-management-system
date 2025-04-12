import axios from "axios";
import { useEffect, useState } from "react";

interface Work {
  date: string;
  vehicleNo: string;
}

interface ModalProps {
  closeModal: () => void;
  companyId: string;
}

const Modal: React.FC<ModalProps> = ({ closeModal, companyId }) => {
  const [works, setWorks] = useState<Work[]>([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/jobs", { params: { companyId } });

      console.log("jobs>>", response.data.data);
      console.log("jobs", response.data.data);
      setWorks(response.data.data);
    })();
  }, [companyId]);

  return (
    <div>
      {/* Modal content */}
      <div className="flex justify-between w-full">
        <h1>Modal</h1>
        <p>company id {companyId}</p>
        <button onClick={closeModal}>Close</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Vehicle
            </th>
          </tr>
        </thead>
        <tbody>
          {works &&
            works.map((row, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {row.date}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {row.vehicleNo}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <table></table>
    </div>
  );
};

export default Modal;
