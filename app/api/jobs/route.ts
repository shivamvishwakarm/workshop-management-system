
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
            const works = await Work.create({ description, amount, quantity, status, date, vehicleNo, company: companyDoc._id });
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