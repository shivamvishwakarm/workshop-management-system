import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { Company, Work } from '@/app/models/schema';


export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json(); // Parse the request body

        const company = await Company.create(body); // Create the company in the database
        return NextResponse.json({ success: true, data: company });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to create company' }, { status: 500 });
    }
}
export async function GET() {
    await dbConnect();
    try {
        const companies = await Company.aggregate([
            {
                $lookup: {
                    from: "works",
                    localField: "_id",
                    foreignField: "company",
                    as: "works",
                    pipeline: [
                        { $match: { status: "Pending" } },
                        { $project: { amount: 1 } }
                    ]
                }
            },
            {
                $addFields: {
                    totalAmount: { $sum: "$works.amount" }
                }
            },
            {
                $project: {
                    name: 1,
                    totalAmount: 1
                }
            }
        ]);

        return NextResponse.json({ success: true, data: companies });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to fetch companies' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json(); // Parse the request body

    try {
        const updatedCompany = await Company.findByIdAndUpdate(id, body, { new: true });
        if (!updatedCompany) {
            return NextResponse.json({ success: false, message: 'Company not found' }, { status: 600 });
        }
        return NextResponse.json({ success: true, data: updatedCompany });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to update company' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    try {
        const deletedCompany = await Company.findByIdAndDelete(id);
        if (!deletedCompany) {
            return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
        }

        deletedCompany.works.forEach(async (workId: string) => {
            await Work.findByIdAndDelete(workId);
        });



        return NextResponse.json({ success: true, data: deletedCompany });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete company' }, { status: 500 });
    }
}