import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import ServiceRecordSchema from '@/app/models/ServiceRecord';

export async function GET() {
    await dbConnect();

    try {
        const total = await ServiceRecordSchema.countDocuments();
        const paid = await ServiceRecordSchema.countDocuments({ paymentStatus: 'Paid' });
        const unpaid = await ServiceRecordSchema.countDocuments({ paymentStatus: 'Unpaid' });
        const partiallyPaid = await ServiceRecordSchema.countDocuments({ paymentStatus: 'Partially Paid' });

        return NextResponse.json({
            success: true,
            data: {
                total,
                paid,
                unpaid,
                partiallyPaid,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}