import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

const greets = ["hi", "Hi", "Hello", "hello"];
const questions = ["how are you?", "what is your name?", "tell me a joke", "tell me about umar"];

export default async function chat(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (greets.includes(message)) {
      res.status(200).json({ message: "Hello there, how you doing?" });
    } else if (questions.includes(message.toLowerCase())) {
      switch (message.toLowerCase()) {
        case "how are you?":
          res
            .status(200)
            .json({ message: "I am doing great, thanks for asking!" });
          break;
        case "what is your name?":
          res.status(200).json({ message: "I am your friendly chatbot!" });
          break;
        case "tell me a joke":
          res
            .status(200)
            .json({
              message:
                "Why don’t skeletons fight each other? They don’t have the guts!",
            });
          break;
        case "tell me about umar":
          res
            .status(200)
            .json({
              message:
                "Passionate web developer with a knack for creating user-friendly and responsive applications. Experienced in React, Next.js, and frontend technologies, always eager to learn and build innovative solutions. When I'm not coding, you will find me enjoying cricket, photography, or exploring new ideas!!",
            });
          break;
        default:
          res
            .status(400)
            .json({
              message:
                'This chat is under development, may not respond to all your question, try asking "tell me about umar"',
            });
      }
    } else {
      res
        .status(400)
        .json({
          message:
            'This chat is under development, may not respond to all your question, try asking "tell me about umar"',
        });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
