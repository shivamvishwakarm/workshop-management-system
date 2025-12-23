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
        // Parse pagination params (defaults: page=1, limit=10)
        const url = new URL(req.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10)));
        const skip = (page - 1) * limit;

        // Run all queries in parallel for maximum speed
        const [pendingTotals, paginatedCompanies, totalCount] = await Promise.all([
            // Query 1: Aggregate pending work amounts grouped by company
            Work.aggregate([
                { $match: { status: "Pending" } },
                { $group: { _id: "$company", totalAmount: { $sum: "$amount" } } }
            ]),
            // Query 2: Fetch paginated company names
            Company.find({}, { name: 1 }).skip(skip).limit(limit).lean(),
            // Query 3: Get total count for pagination metadata
            Company.countDocuments()
        ]);

        // Build a map for O(1) lookup of pending totals
        const totalsMap = new Map(
            pendingTotals.map((item: { _id: string; totalAmount: number }) => [
                item._id.toString(),
                item.totalAmount
            ])
        );

        // Merge results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const companies = paginatedCompanies.map((company: any) => ({
            _id: company._id,
            name: company.name,
            totalAmount: totalsMap.get(company._id.toString()) || 0
        }));

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: companies,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasMore: page < totalPages
            }
        });
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