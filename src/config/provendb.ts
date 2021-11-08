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

    return { provendb, databaseObject };
  }

  public static async storeAsset<T extends Record<string, any>>(
    data: T,
    model: string
  ) {
    const { provendb } = await this.getProvenDbConnection();
    const collection = provendb.collection(model);
    const test: { insertedId: string } = await collection.insertOne(data);
    await provendb.submitProof();

    return test;
  }

  public static async fetchAssets<T>(
    filter: Record<string, any>,
    model: string
  ): Promise<T[]> {
    const { databaseObject } = await this.getProvenDbConnection();

    const result: T[] = await databaseObject
      .collection(model)
      .find(filter)
      .toArray();

    return result;
  }

  public static async getProofStatus(id: string, model: string) {
    const { provendb } = await this.getProvenDbConnection();
    const { version } = await provendb.getVersion();
    const { proofs }: { proofs: { status: ProofStatus }[] } =
      await provendb.getDocumentProof(model, { _id: ObjectId(id) }, version);

    return proofs[0].status;
  }

  public static async updateAsset(
    filter: Record<string, any>,
    model: string,
    body: Record<string, any>
  ) {
    const { databaseObject } = await this.getProvenDbConnection();

    await databaseObject.collection(model).updateOne(filter, { $set: body });
    const res: GetVersionResponse = await databaseObject.command({
      getVersion: 1,
    });

    databaseObject.command({ submitProof: res.version });
  }
}
