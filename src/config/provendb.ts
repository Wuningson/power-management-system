import { ObjectId } from 'mongodb';
import getEnvVariables from './env';
import { provendbClient } from './database';
import { Database as ProvenDB } from '@southbanksoftware/provendb-node-driver';

export default class BlockchainHelper {
  public static getProvenDbConnection() {
    const { provenDbService } = getEnvVariables();

    if (provendbClient) {
      const databaseObject = provendbClient.db(provenDbService);
      const provendb = new ProvenDB(databaseObject);

      return { provendb, databaseObject };
    } else throw Error('Proven db wahala');
  }

  public static async storeAsset<T extends Record<string, any>>(
    data: T,
    model: string
  ) {
    const { provendb } = this.getProvenDbConnection();
    const collection = provendb.collection(model);
    const test: { insertedId: string } = await collection.insertOne(data);
    await provendb.submitProof();

    return test;
  }

  public static async fetchAssets<T>(
    filter: Record<string, any>,
    model: string
  ): Promise<T[]> {
    const { databaseObject } = this.getProvenDbConnection();

    const result: T[] = await databaseObject
      .collection(model)
      .find(filter)
      .toArray();

    return result;
  }

  public static async getProofStatus(id: string, model: string) {
    const { provendb } = this.getProvenDbConnection();
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
    const { databaseObject } = this.getProvenDbConnection();

    await databaseObject.collection(model).updateOne(filter, { $set: body });
    const res: GetVersionResponse = await databaseObject.command({
      getVersion: 1,
    });

    databaseObject.command({ submitProof: res.version });
  }
}
