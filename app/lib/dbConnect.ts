// lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('⚠️ Please define the MONGODB_URI in your environment variables.');
}



interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}
// eslint-disable-next-line 
let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };


if (!cached) {
    // eslint-disable-next-line 
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
        };

        if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
            opts.user = process.env.MONGODB_USER;
            opts.pass = process.env.MONGODB_PASSWORD;
            opts.authSource = 'admin';
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
