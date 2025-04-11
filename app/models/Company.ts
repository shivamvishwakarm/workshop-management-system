// models/Company.ts
import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
