import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { Company } from '@/app/models/schema';

export async function GET(req: Request) {
    await dbConnect();

    const url = new URL(req.url);
    // const name = url.searchParams.get('name');
    // const status = url.searchParams.get('status');

    try {
        // const companyQuery: any = {};
        // if (name) companyQuery.name = name;

        const companies = await Company.find({})
            .populate({
                path: 'works',
                select: 'date vehicleNo description amount quantity status',
            })
            .lean()

        console.log("companies", companies);

        return NextResponse.json({ success: true, companies });
    } catch (error) {
        console.error('Error fetching companies with works:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch companies with works', error },
            { status: 500 }
        );
    }
}
