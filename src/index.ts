import cron from 'node-cron';
import mongoose from 'mongoose';
import User from './user'; // Ensure you have the user.ts file in the same directory

// // Note: Replace 'DB_URI' with your actual MongoDB URI.
const DB_URI: string = 'mongodb+srv://anurag:verfu9-peqmeQ-segtiz@cluster0.kmxdpar.mongodb.net/?retryWrites=true&w=majority';

// MongoDB connection
mongoose.connect(DB_URI)
.then(() => console.log("Database connected"))
.catch((error: Error) => {
    console.error("Database connection error:", error);
    process.exit(1);
});

mongoose.connection.on('connected', () => console.log('Mongoose default connection open'));
mongoose.connection.on('error', (err: Error) => console.error('Mongoose default connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose default connection disconnected'));

// Schedule a cron job to reset the deployment count at midnight (00:00) on the first day of every month
cron.schedule('0 0 1 * *', async () => {
    console.log('Running a job at 01:00 at the 01st of every month');

    try {
        await User.updateMany({}, { deployment: 0 });
        console.log('Reset deployment count for all users');
    } catch (error: any) {  // Use 'any' type here if the error structure is unknown
        console.error('Error resetting deployment count:', error);
    }
});
