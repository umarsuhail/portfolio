import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dashboard";

let cachedClient: MongoClient | null = null;

if (!uri) {
  throw new Error("MONGODB_URI must be defined in environment variables.");
}

const mongoUri = uri;

export async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8_000,
    connectTimeoutMS: 8_000,
  });

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    await client.close();
    throw error;
  }
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(dbName);
}
