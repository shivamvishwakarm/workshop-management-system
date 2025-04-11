// models/ServiceRecord.ts
import mongoose from 'mongoose';
import ServiceItemSchema from './subschemas/ServiceItem';

const ServiceRecordSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    vehicleNo: { type: String, required: true },
    date: { type: Date, default: Date.now },
    imageUrl: { type: String }, // image of bill or service
    serviceItems: [ServiceItemSchema]
}, { timestamps: true });

export default mongoose.models.ServiceRecord || mongoose.model('ServiceRecord', ServiceRecordSchema);
