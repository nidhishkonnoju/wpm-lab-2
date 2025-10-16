import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mean_marketing_demo';
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoUri, { autoIndex: true });
}


