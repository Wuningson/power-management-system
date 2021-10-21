import mongoose from 'mongoose';

export default class Database {
  private url: string;
  constructor(databaseUrl: string) {
    this.url = databaseUrl;
  }
  public async connect() {
    try {
      console.log('Connecting to database');

      await mongoose.connect(this.url, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      });

      console.log(`Connected to database`);

      mongoose.connection.on('disconnected', this.connect);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
