

import dbConnect from '@/app/lib/dbConnect'; // Adjust the path if needed
import { Work } from '@/app/models/schema'; // Adjust this import if your model is in a different location
import { NextResponse } from 'next/server';


export async function GET() {
    await dbConnect();

    try {
        const pendingWorks = await Work.aggregate([
            { $match: { status: 'Pending' } },
            {
                $group: {
                    _id: null,
                    totalPendingAmount: { $sum: "$amount" }
                }
            }
        ]);

        const total = pendingWorks[0]?.totalPendingAmount || 0;

        return NextResponse.json({ totalPendingAmount: total });
    } catch (error) {
        console.error('Error fetching total pending amount:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
