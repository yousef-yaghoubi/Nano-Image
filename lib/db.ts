import mongoose from 'mongoose';

// تعریف تایپ برای DATABASE_URL
const MONGODB_URI: string = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  console.log('DB Url', process.env.DATABASE_URL);
  throw new Error('لطفا DATABASE_URL رو در فایل .env.local تعریف کنید');
}

// تعریف تایپ برای cached object
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// اضافه کردن تایپ به global
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('connect succsessfuly');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
