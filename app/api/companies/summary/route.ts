import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { Company, Work } from '@/app/models/schema';
import { WorkRow } from '@/app/utils/types';

export async function GET() {
    await dbConnect();


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



        // Removed the side-effect map that was updating every work item on every read.
        // If this logic is needed, it should be in a separate migration script or mutation endpoint.

        const companiesWithWorks = companies;







        return NextResponse.json({ success: true, companiesWithWorks });
    } catch (error) {
        console.error('Error fetching companies with works:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch companies with works', error },
            { status: 500 }
        );
    }
}
