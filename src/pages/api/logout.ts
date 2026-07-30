import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: boolean;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.setHeader(
    "Set-Cookie",
    "token=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  res.status(200).json({ success: true });
}
