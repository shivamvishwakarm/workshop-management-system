import mongoose, { Document } from 'mongoose';



export interface Companies extends Document {
    name: string;
    phoneNumber: string;
    totalAmount: number;
    works: mongoose.Schema.Types.ObjectId[];
}
export interface Works extends Document {
    description: string;
    amount: number;
    quantity: {
        type: number | null,
        optional: true,
    },
    status: string;
    date: Date;
    vehicleNo: string;
    company: mongoose.Schema.Types.ObjectId;
}


const CompanySchema = new mongoose.Schema<Companies>({
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    totalAmount: { type: Number, default: 0 },
    works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }],
}, { timestamps: true });

const WorkSchema = new mongoose.Schema<Works>({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Billed'],
        default: 'Pending',
        index: true
    },
    date: { type: Date, default: Date.now, index: true },
    vehicleNo: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
}, { timestamps: true });

export const Company = mongoose.models.Company || mongoose.model<Companies>('Company', CompanySchema);
export const Work = mongoose.models.Work || mongoose.model<Works>('Work', WorkSchema);
