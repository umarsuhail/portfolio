import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

type CallbackRequest = {
  name: string;
  phone: string;
  email?: string;
  preferredTime?: string;
  message?: string;
};

type ResponseData = {
  success: boolean;
  error?: string;
};

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dashboard";
const collectionName = process.env.MONGODB_CALLBACK_COLLECTION || "callback_requests";

let cachedClient: MongoClient | null = null;

async function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: "Method not allowed." });
    return;
  }

  const body = req.body as CallbackRequest;
  if (!body?.name || !body?.phone) {
    res.status(400).json({ success: false, error: "Name and phone are required." });
    return;
  }

  try {
    const client = await getClient();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne({
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      preferredTime: body.preferredTime || null,
      message: body.message || null,
      createdAt: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Callback request error:", error);
    res.status(500).json({ success: false, error: "Failed to save callback request." });
  }
}
