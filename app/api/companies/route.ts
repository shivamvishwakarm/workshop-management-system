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
export async function GET(req: Request) {
    await dbConnect();

    try {
        const url = new URL(req.url);

        const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
        const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 10)));
        const skip = (page - 1) * limit;

        /**
         * 1️⃣ Fetch paginated companies (+1 to detect hasMore)
         */
        const companies = await Company
            .find({}, { name: 1 })
            .skip(skip)
            .limit(limit + 1)
            .lean();

        const hasMore = companies.length > limit;
        if (hasMore) companies.pop(); // remove extra record

        if (companies.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                pagination: {
                    currentPage: page,
                    limit,
                    hasMore: false
                }
            });
        }

        /**
         * 2️⃣ Aggregate ONLY for returned companies
         */
        const companyIds = companies.map(c => c._id);

        const pendingTotals = await Work.aggregate([
            {
                $match: {
                    status: "Pending",
                    company: { $in: companyIds }
                }
            },
            {
                $group: {
                    _id: "$company",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        /**
         * 3️⃣ O(1) merge
         */
        const totalsMap = new Map(
            pendingTotals.map(item => [
                item._id.toString(),
                item.totalAmount
            ])
        );

        const data = companies.map(company => ({
            _id: company._id,
            name: company.name,
            totalAmount: totalsMap.get(String(company._id).toString()) ?? 0
        }));

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                currentPage: page,
                limit,
                hasMore
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch companies" },
            { status: 500 }
        );
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