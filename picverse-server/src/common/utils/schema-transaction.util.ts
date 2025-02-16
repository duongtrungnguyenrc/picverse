import { ClientSession, Model, Document } from "mongoose";

export async function withMutateTransaction<T extends Document, K = T>(model: Model<T>, callback: (session: ClientSession) => Promise<K> | K): Promise<K> {
  const session: ClientSession = await model.db.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
