import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const url = `mongodb://${process.env.MONGO_DB_URL}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE}`;

mongoose.connect(url, {
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PASSWORD,
  socketTimeoutMS: 300000,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected To MongoDB');
});

db.on('error', (error) => {
  console.log(error);
});

export default mongoose;
