
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { Company, Work } from '@/app/models/schema';


export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json(); // Parse the request body
        console.log(body);
        const { company, workRows } = body;

        console.log("company", company);
        console.log("workRows", workRows);


        let companyDoc = await Company.findOne({ name: company });

        if (!companyDoc) {
            companyDoc = await Company.create({ name: company });
        }

        console.log("companyDoc", companyDoc);
        const worksId = []
        const workAmounts = [];
        for (const workRow of workRows) {
            console.log("workRow", workRow);
            const { description, amount, quantity, status, date, vehicleNo } = workRow;
            const works = await Work.create({ description, amount, quantity: !quantity ? 0 : quantity, status, date, vehicleNo, company: companyDoc._id });
            worksId.push(works._id);
            console.log("works", works.amount);
            workAmounts.push(works.amount);
        }
        companyDoc.totalAmount += workAmounts.map(amount => amount).reduce((a, b) => a + b, 0);
        companyDoc.works.push(...worksId);
        await companyDoc.save();


        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to create company' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    await dbConnect();

    const url = new URL(req.url);
    const company = url.searchParams.get('company');

    try {
        console.log(url.searchParams.get('company'));
        console.log("company", company);


        const isCompanyExist = await Company.findOne({ _id: company });
        if (!isCompanyExist) {
            return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
        }

        console.log(`isCompanyExist: ${isCompanyExist}`)


        const companies = await Work.find({ company: isCompanyExist._id }).lean();
        console.log(companies);
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
    console.log(`body: ${req}`)
    try {
        const updatedWork = await Work.findByIdAndUpdate(id, body, { new: true });
        if (!updatedWork) {
            return NextResponse.json({ success: false, message: 'Work not found' }, { status: 600 });
        }
        return NextResponse.json({ success: true, data: updatedWork });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to update work' }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    try {
        const deletedWork = await Work.findByIdAndDelete(id);
        if (!deletedWork) {
            return NextResponse.json({ success: false, message: 'Work not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: deletedWork });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete work' }, { status: 500 });
    }
}