import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Company from '@/app/models/Company';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json(); // Parse the request body
        console.log(body);
        const company = await Company.create(body); // Create the company in the database
        return NextResponse.json({ success: true, data: company });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to create company' }, { status: 500 });
    }
}