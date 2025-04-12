import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { Company, Works } from '@/app/models/schema';
import util from 'util';



export async function GET(req: Request) {
    await dbConnect();

    const url = new URL(req.url);
    const name = url.searchParams.get('name'); // Filter by company name
    const status = url.searchParams.get('status'); // Filter by work status

    try {
        // Build query object for Company
        const companyQuery: any = {};
        if (name) companyQuery.name = name;

        console.log("companyquery", companyQuery);
        console.log(await Company.find({}).populate({
            path: 'works'
        }));

        // Fetch companies with optional name filter
        const companies = await Company.find(companyQuery)
            .populate({
                path: 'works', // Populate 'works' from the Works schema
                populate: {
                    path: 'work', // Populate 'work' from the Work schema
                    model: 'Work',
                    match: status ? { status } : {}, // Apply status filter if provided
                },
            })
            .lean();

        // Attach additional works data under each company
        const data = await Promise.all(
            companies.map(async (company) => {
                // Fetch works specifically associated with the company
                const works = await Works.find({ company: company._id }).populate({
                    path: 'work',
                    model: 'Work',
                    match: status ? { status } : {}, // Apply status filter if provided
                });

                // Format the result with company and its works
                return {
                    ...company,
                    works: works.map((work) => ({
                        vehicleNo: work.vehicleNo,
                        date: work.date,
                        workDetails: work.work.map((details: any) => ({
                            description: details.description,
                            quantity: details.quantity,
                            status: details.status,
                            amount: details.amount,
                        })),
                    })),
                };
            })
        );


        console.log(util.inspect(data, { showHidden: true, depth: null, colors: true }));


        const sendData: { id: string; name: string; date: string; amount: number }[] = [];
        data.map((d) => {
            const o = { id: d._id, name: d.name, amount: 0, date: "" };
            let latestDate: Date | null = null; // Explicitly type as Date | null

            let totalAmount = 0;
            d.works.map((w) => {

                w.workDetails.map((k) => {
                    totalAmount += k.amount;
                });

                // Compare dates to get the latest date
                const currentWorkDate = new Date(w.date);
                if (!latestDate || currentWorkDate > latestDate) {
                    latestDate = currentWorkDate;
                }
                o.amount = totalAmount;
            });



            // Format the date as a readable string (e.g., YYYY-MM-DD)
            o.date = latestDate ? latestDate.toISOString().split("T")[0] : ""; // Default to ISO date format
            sendData.push(o);
        });


        // console.log("senddata", sendData);





        // console.log(util.inspect(data, { depth: null, colors: false }));
        return NextResponse.json({ success: true, sendData });
    } catch (error) {
        console.error('Error fetching companies with works:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch companies with works', error },
            { status: 500 }
        );
    }
}


