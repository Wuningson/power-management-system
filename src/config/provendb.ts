import getEnvVariables from './env';
import { MongoClient, ObjectId } from 'mongodb';
import { Database as ProvenDB } from '@southbanksoftware/provendb-node-driver';

export default class BlockchainHelper {
  public static async getProvenDbConnection() {
    const { provenDbUrl, provenDbService } = getEnvVariables();

    const client = await MongoClient.connect(provenDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const databaseObject = client.db(provenDbService);
    const provendb = new ProvenDB(databaseObject);

    return provendb;
  }

  public static async storeAsset<T extends Record<string, any>>(
    data: T,
    model: string
  ) {
    const provendb = await this.getProvenDbConnection();
    const collection = provendb.collection(model);
    const test = await collection.insertOne(data);
    await provendb.submitProof();

    return test;
  }

  public static async fetchAssets(
    filter: Record<string, string | number | Date>,
    model: string
  ) {
    const provendb = await this.getProvenDbConnection();
    const collection = provendb.collection(model);
    const result = (await collection.find(filter)).toArray();

    return result;
  }

  public static async getProofStatus(id: string, model: string) {
    const provendb = await this.getProvenDbConnection();
    const { version } = await provendb.getVersion();
    const { proofs } = await provendb.getDocumentProof(
      model,
      { _id: ObjectId(id) },
      version
    );

    return proofs[0].status;
  }
}
