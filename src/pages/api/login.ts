import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";

const JWT_SECRET = process.env.LOGIN_JWT_SECRET || "dev_secret_key";

type LoginRequest = {
  email: string;
  password: string;
};

type ResponseData = {
  success: boolean;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: "Method not allowed." });
    return;
  }

  const { email, password } = req.body as LoginRequest;
  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required." });
    return;
  }

  try {
    const db = await getDatabase();
    const account = await db.collection("account").findOne({ email });
    if (!account || typeof account.password !== "string") {
      res.status(401).json({ success: false, error: "Invalid email or password." });
      return;
    }

    const passwordMatches = await compare(password, account.password);
    if (!passwordMatches) {
      res.status(401).json({ success: false, error: "Invalid email or password." });
      return;
    }

    const token = sign({ email: account.email, userId: account._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieValue = `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
    res.setHeader("Set-Cookie", cookieValue);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Login failed." });
  }
}
