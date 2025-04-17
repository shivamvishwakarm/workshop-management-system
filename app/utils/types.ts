export interface WorkRow {
    _id: string;
    date: string;
    description: string;
    amount: number | null;
    quantity: string | number; // Allow both string and number
    status: string;
    vehicleNo: string;
}

