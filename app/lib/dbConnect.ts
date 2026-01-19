// lib/dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

// Prevent multiple connections in dev (Next.js HMR)
const globalForMongoose = global as unknown as {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

globalForMongoose.mongoose ??= { conn: null, promise: null };

async function dbConnect() {
    if (globalForMongoose.mongoose.conn) {
        return globalForMongoose.mongoose.conn;
    }

    if (!globalForMongoose.mongoose.promise) {
        globalForMongoose.mongoose.promise = mongoose.connect(MONGODB_URI!);
    }

    globalForMongoose.mongoose.conn =
        await globalForMongoose.mongoose.promise;

    return globalForMongoose.mongoose.conn;
}

export default dbConnect;
