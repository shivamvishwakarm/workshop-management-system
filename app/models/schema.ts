import mongoose, { Document, Model, Schema } from 'mongoose';

// Define TypeScript interfaces for strong typing
interface ICompany extends Document {
    name: string;
    phoneNumber?: string;
    works: mongoose.Types.ObjectId[]; // References to 'Works' documents
}

interface IWork extends Document {
    description: string;
    amount: number;
    // rate: number;
    quantity: number;
    status: 'Pending' | 'Paid';
}

interface IWorks extends Document {
    company: mongoose.Types.ObjectId; // Reference to a 'Company'
    vehicleNo: string;
    date: Date;
    imageId?: string;
    work: mongoose.Types.ObjectId[]; // References to 'Work' documents
}

// Company Schema
const CompanySchema: Schema<ICompany> = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Company name is required'],
            trim: true,
        },
        phoneNumber: {
            type: String,
            validate: {
                validator: function (v: string) {
                    return /^\d{10}$/.test(v); // Example validation for 10-digit phone numbers
                },
                message: (props: { value: string }) => `${props.value} is not a valid phone number!`,
            },
        },
        works: [{ type: Schema.Types.ObjectId, ref: 'Works' }], // Reference to 'Works'
    },
    { timestamps: true, collection: 'companies' } // Explicit collection name
);

// Work Schema
const WorkSchema: Schema<IWork> = new Schema(
    {
        description: { type: String, required: [true, 'Description is required'], trim: true },
        amount: { type: Number, required: true, min: 0 },

        quantity: { type: Number, required: true, min: 1 },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Partial'],
            default: 'Pending',
        },
    },
    { timestamps: true, collection: 'work' } // Explicit collection name
);

// Works Schema
const WorksSchema: Schema<IWorks> = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
        vehicleNo: {
            type: String,
            required: [true, 'Vehicle number is required'],
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        imageId: {
            type: String,
            trim: true,
        },
        work: [{ type: Schema.Types.ObjectId, ref: 'Work' }], // References to 'Work'
    },
    { timestamps: true, collection: 'works' } // Explicit collection name
);

// Create Models with TypeScript types
export const Company: Model<ICompany> =
    mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export const Work: Model<IWork> =
    mongoose.models.Work || mongoose.model<IWork>('Work', WorkSchema);

export const Works: Model<IWorks> =
    mongoose.models.Works || mongoose.model<IWorks>('Works', WorksSchema);