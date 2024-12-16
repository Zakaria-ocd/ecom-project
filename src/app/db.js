import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom';

let cached = global.mongo;

if (!cached) {
    cached = global.mongo = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        }).catch((error) => {
            console.error('Failed to connect to MongoDB', error);
            throw new Error('MongoDB connection error');
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;