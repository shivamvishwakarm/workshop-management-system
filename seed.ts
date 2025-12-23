
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dbConnect from './app/lib/dbConnect';
import { Company, Work } from './app/models/schema';

// Number of entries to seed
const NUM_ENTRIES = 40;

async function seed() {
    console.log('🌱 Starting seed...');

    try {
        await dbConnect();
        console.log('✅ Connected to DB');

        // Optional: Clear existing data
        // await Company.deleteMany({});
        // await Work.deleteMany({});
        // console.log('🧹 Cleared existing data');

        let createdWorks = 0;

        for (let i = 0; i < NUM_ENTRIES; i++) {
            // Create a Company
            const companyName = faker.company.name();
            // Ensure unique company name locally or handle potential duplicate error?
            // For simplicity in seeding, we'll try-catch or just uniqueness is managed by faker usually not repeating fast.
            // But Schema says unique: true. So we need to be careful or upsert.

            // Upsert Company
            let company = await Company.findOne({ name: companyName });
            if (!company) {
                company = await Company.create({
                    name: companyName,
                    phoneNumber: faker.phone.number(),
                    totalAmount: 0 // Will be updated
                });
            }

            // Create Work
            const amount = parseFloat(faker.commerce.price({ min: 100, max: 10000 }));

            const work = await Work.create({
                description: faker.lorem.sentence(),
                amount: amount,
                quantity: faker.number.int({ min: 1, max: 10 }),
                status: faker.helpers.arrayElement(['Paid', 'Pending', 'Billed']),
                date: faker.date.past(),
                vehicleNo: faker.vehicle.vrm(),
                company: company._id
            });

            // Update Company totalAmount and works array
            await Company.findByIdAndUpdate(company._id, {
                $inc: { totalAmount: amount },
                $push: { works: work._id }
            });

            createdWorks++;
            process.stdout.write(`\rGenerated ${createdWorks}/${NUM_ENTRIES}`);
        }

        console.log('\n✅ Seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
