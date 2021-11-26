import mongoose from 'mongoose';
import getEnvVariables from './env';
import { MongoClient } from 'mongodb';

export let provendbClient: MongoClient | null = null;

export default class Database {
  public async connect() {
    const { provenDbUrl } = getEnvVariables();
    MongoClient.connect(
      provenDbUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, res) => {
        if (err) {
          throw err;
        }
        console.log('Connected to proven database');
        provendbClient = res;
      }
    );
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
