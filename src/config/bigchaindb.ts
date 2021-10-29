import getEnvVariables from './env';
import BaseError from '../global/error';
import { Connection, Ed25519Keypair, Transaction } from 'bigchaindb-driver';
import {
  CreateTransaction,
  TransactionCommonSigned,
  TransactionOperations,
} from 'bigchaindb-driver/types/transaction';
// const driver = require('bigchaindb-driver');

export default class BigChainDb {
  private connection: Connection;
  constructor(bigchainNodeUrl?: string) {
    this.connection = new Connection(
      bigchainNodeUrl || getEnvVariables().bigChainDbUrl
    );
  }

  public static getKeyPair() {
    return new Ed25519Keypair();
  }

  public createTransaction<
    A extends Record<string, any>,
    M extends Record<string, any>
  >(asset: A, { publicKey }: Ed25519Keypair, meta: M) {
    return Transaction.makeCreateTransaction(
      asset,
      meta,
      [Transaction.makeOutput(Transaction.makeEd25519Condition(publicKey))],
      publicKey
    );
  }

  public async signTransaction<
    A extends Record<string, any>,
    M extends Record<string, any>
  >(transaction: CreateTransaction<A, M>, { privateKey }: Ed25519Keypair) {
    return Transaction.signTransaction(transaction, privateKey);
  }

  public async commitTransaction<
    A extends Record<string, any>,
    M extends Record<string, any>
  >(
    transaction: TransactionCommonSigned<TransactionOperations.CREATE, A, M>
  ): Promise<CreateTransaction<A, M>> {
    return await this.connection.postTransaction<
      TransactionOperations.CREATE,
      A,
      M
    >(transaction);
  }

  public async searchAssets(id: string) {
    return await this.connection.searchAssets(id);
  }

  public async getTransaction<
    A extends Record<string, any>,
    M extends Record<string, any>
  >(id: string) {
    const response = await this.connection.getTransaction(id);
    return {
      id: response.id,
      asset: response.asset as unknown as A,
      meta: response.metadata as unknown as M,
    };
  }
}
