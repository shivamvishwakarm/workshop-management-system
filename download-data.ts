
import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import dbConnect from './app/lib/dbConnect';
import { Company, Work } from './app/models/schema';

async function downloadData() {
    console.log('📦 Starting data download...');

    try {
        await dbConnect();
        console.log('✅ Connected to DB');

        // Fetch all Companies
        const companies = await Company.find({}).lean();
        console.log(`Fetched ${companies.length} companies`);

        // Fetch all Works and populate company details
        const works = await Work.find({}).populate('company', 'name phoneNumber').lean();
        console.log(`Fetched ${works.length} works`);

        // Prepare Data for Excel

        // Sheet 1: Works (Detailed)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const worksData = works.map((work: any) => ({
            Description: work.description,
            Amount: work.amount,
            Quantity: work.quantity,
            Status: work.status,
            Date: work.date ? new Date(work.date).toISOString().split('T')[0] : '',
            VehicleNo: work.vehicleNo,
            CompanyName: work.company?.name || 'N/A',
            CompanyPhone: work.company?.phoneNumber || 'N/A',
            CreatedAt: work.createdAt ? new Date(work.createdAt).toISOString() : ''
        }));

        // Sheet 2: Companies (Summary)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const companiesData = companies.map((comp: any) => ({
            Name: comp.name,
            PhoneNumber: comp.phoneNumber,
            TotalAmount: comp.totalAmount,
            WorkCount: comp.works?.length || 0,
            CreatedAt: comp.createdAt ? new Date(comp.createdAt).toISOString() : ''
        }));

        // Create Workbook
        const workbook = XLSX.utils.book_new();

        // Add Works Sheet
        const worksSheet = XLSX.utils.json_to_sheet(worksData);
        XLSX.utils.book_append_sheet(workbook, worksSheet, 'Works');

        // Add Companies Sheet
        const companiesSheet = XLSX.utils.json_to_sheet(companiesData);
        XLSX.utils.book_append_sheet(workbook, companiesSheet, 'Companies');

        // Write to file
        const fileName = 'workshop_data.xlsx';
        XLSX.writeFile(workbook, fileName);

        console.log(`\n🎉 Successfully Downloaded Data to ${fileName}`);
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Download failed:', error);
        process.exit(1);
    }
}

downloadData();
