import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Support both MONGODB_URI and DATABASE_URL
    const dbUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    const conn = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
