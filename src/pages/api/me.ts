import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import { getLoginJwtSecret } from "@/lib/auth";

type ResponseData = {
  user?: {
    email: string;
    userId: string;
  };
};

function getTokenFromCookies(cookies: string | undefined) {
  if (!cookies) return null;
  const tokenCookie = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end();
    return;
  }

  const token = getTokenFromCookies(req.headers.cookie);
  if (!token) {
    res.status(401).json({});
    return;
  }

  try {
    const decoded = verify(token, getLoginJwtSecret());
    if (typeof decoded === "object" && decoded && "email" in decoded && "userId" in decoded) {
      res.status(200).json({
        user: {
          email: decoded.email as string,
          userId: decoded.userId as string,
        },
      });
      return;
    }
  } catch (error) {
    console.error("Invalid session token", error);
  }

  res.status(401).json({});
}
