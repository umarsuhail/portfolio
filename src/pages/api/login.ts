import type { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { getLoginJwtSecret } from "@/lib/auth";

type LoginRequest = {
  username: string;
  password: string;
};

type ResponseData = {
  success: boolean;
  error?: string;
  user?: {
    email: string;
    userId: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: "Method not allowed." });
    return;
  }

  const { username, password } = req.body as LoginRequest;
  const identifier = typeof username === "string" ? username.trim() : "";

  if (!identifier || typeof password !== "string" || !password) {
    res.status(400).json({ success: false, error: "Username and password are required." });
    return;
  }

  if (!process.env.MONGODB_URI) {
    res.status(503).json({
      success: false,
      error: "Login is not configured. Please contact the site owner.",
    });
    return;
  }

  try {
    const { getDatabase } = await import("@/lib/mongodb");
    const db = await getDatabase();
    const account = await db.collection("account").findOne({
      $or: [
        { username: identifier },
        { email: identifier.toLowerCase() },
      ],
    });
    if (!account || typeof account.password !== "string") {
      res.status(401).json({ success: false, error: "Invalid username or password." });
      return;
    }

    const passwordMatches = await compare(password, account.password);
    if (!passwordMatches) {
      res.status(401).json({ success: false, error: "Invalid username or password." });
      return;
    }

    if (typeof account.email !== "string") {
      res.status(500).json({ success: false, error: "Account configuration is invalid." });
      return;
    }

    const token = sign({ email: account.email, userId: account._id.toString() }, getLoginJwtSecret(), {
      expiresIn: "7d",
    });

    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookieValue = `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`;
    res.setHeader("Set-Cookie", cookieValue);
    res.status(200).json({
      success: true,
      user: { email: account.email, userId: account._id.toString() },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Login failed." });
  }
}
