import mongoose from 'mongoose';
import getEnvVariables from './env';

export default class Database {
  public async connect() {
    try {
      const url = getEnvVariables().databaseUrl;
      console.log('Connecting to database');

      await mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      });

      console.log(`Connected to database`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
