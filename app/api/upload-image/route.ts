// upload image to cloudinary


import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const { image } = await req.json();
    } catch (error: any) {
        console.log(error);
    }
}