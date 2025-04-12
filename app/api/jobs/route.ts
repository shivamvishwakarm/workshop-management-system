import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Company from '@/app/models/Company';
import mongoose from 'mongoose';
import { Work, Works } from '@/app/models/schema';


export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const { company, vehicleNo, date, workRows, imageId } = body;

        // Validate required fields
        if (!company || !vehicleNo || !Array.isArray(workRows) || workRows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Missing or invalid required fields" },
                { status: 400 }
            );
        }

        // Check if the company exists by name
        let companyRecord = await Company.findOne({ name: company });
        console.log("company Record", companyRecord)
        // If the company doesn't exist, create a new one
        if (!companyRecord) {
            companyRecord = await Company.create({ name: company });
            console.log("Company created:", companyRecord);
        }

        // Validate and create Work documents for each work item
        const workIds: mongoose.Types.ObjectId[] = [];
        for (const workRow of workRows) {
            const { description, amount, quantity, status } = workRow;

            // Ensure required fields are provided for each work item
            if (!description || amount == null || quantity == null) {
                return NextResponse.json(
                    { success: false, message: "Invalid work item data" },
                    { status: 400 }
                );
            }

            const work = await Work.create({
                description,
                amount,

                quantity,
                status: status || "Pending", // Default to "Pending" if status is not provided
            }) as mongoose.Document & { _id: mongoose.Types.ObjectId };

            console.log("Work created:", work);
            workIds.push(work._id);
        }

        // Prepare the Works document
        const worksData = {
            company: companyRecord._id,
            vehicleNo,
            date: date || new Date(),
            imageId: imageId || "",
            work: workIds, // Reference to the created Work documents
        };

        // Create a new Works record
        const worksRecord = await Works.create(worksData);

        return NextResponse.json({ success: true, data: worksRecord });
    } catch (error) {
        console.error("Error creating works record:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create works record", error },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    await dbConnect();

    try {
        console.log("req>>", req);
        const url = new URL(req.url);
        const companyId = url.searchParams.get('companyId');
        const works = await Works.find({ company: companyId }).lean();
        return NextResponse.json({ success: true, data: works });
    } catch (error) {
        console.error("Error fetching works:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch works", error },
            { status: 500 }
        );
    }
}

