// models/subschemas/ServiceItem.ts
import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true }, // rate * quantity
    status: {
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Pending'
    }
}, { _id: false });

export default ServiceItemSchema;
