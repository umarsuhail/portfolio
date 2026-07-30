import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dashboard";

let cachedClient: MongoClient | null = null;

if (!uri) {
  throw new Error("MONGODB_URI must be defined in environment variables.");
}

export async function getMongoClient() {
  if (cachedClient && cachedClient.topology?.isConnected()) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(dbName);
}
