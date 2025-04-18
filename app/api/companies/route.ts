import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { Company, Work } from '@/app/models/schema';


export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json(); // Parse the request body
        console.log(body);
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
        // Fetch companies and their works in one step using population
        const companies = await Company.find({})
            .populate({
                path: 'works',
                match: { status: 'Pending' }, // Only include works with status 'Pending'
                select: 'amount status' // Fetch only necessary fields
            })
            .lean();

        // Calculate total amount for each company
        const updatedCompanies = companies.map((company) => {
            const totalAmount: number = company.works.reduce((sum: number, work: { amount: number }) => sum + work.amount, 0);
            return { ...company, totalAmount };
        });




        return NextResponse.json({ success: true, data: updatedCompanies });
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
    console.log(`body: ${req}`)
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


        console.log(`deletedCompany: ${deletedCompany}`)
        return NextResponse.json({ success: true, data: deletedCompany });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete company' }, { status: 500 });
    }
}