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



        const companiesWithWorks = companies.map((company) => {
            const works = company.works;

            works.map((work: WorkRow) => {
                const getWork = Work.findById(work._id);
                getWork.then((work) => {
                    work.company = company._id;
                    work.save();
                });
            })
        });







        return NextResponse.json({ success: true, companiesWithWorks });
    } catch (error) {
        console.error('Error fetching companies with works:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch companies with works', error },
            { status: 500 }
        );
    }
}
