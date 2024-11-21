import type { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  message: string;
};

type ResponseData = {
  message: string;
};

const greets = ["hi", "Hi", "Hello", "hello"];
const responsePatterns = [
  { keywords: ["hobbies"], response: "I enjoy playing cricket, photography, listening to music, and exploring new ideas!" },
  { keywords: ["education", "studies", "degree"], response: "I pursued a B.Tech degree from MG University, Kottayam, although I haven't completed it yet. I've learned a lot through both my education and self-study." },
  { keywords: ["experience", "work", "professional"], response: "I have over 5 years of experience as a front-end developer, specializing in React, Next.js, Redux, Angular, and building full-stack solutions." },
  { keywords: ["name", "who are you", "tell me about yourself"], response: "I’m a passionate web developer focused on creating user-friendly and responsive web applications. My name is Umar, and I’m always excited to learn and innovate." },
];

const genericReplies = [
  { question: "how are you?", answers: ["fine", "good", "great", "okay"], response: "Awesome! Glad to hear that!" },
  { question: "what's up?", answers: ["nothing", "not much", "just chilling"], response: "Cool! Just taking it easy, huh?" },
  { question: "how's the weather?", answers: ["sunny", "rainy", "cloudy", "cold"], response: "Sounds like a perfect day!" },
  { question: "feeling good?", answers: ["yes", "absolutely", "totally"], response: "That's what I like to hear!" },
  { question: "how's life?", answers: ["good", "going well", "fine"], response: "Life's good, huh? Keep it that way!" },
  { question: "are you okay?", answers: ["yes", "I'm okay", "all good"], response: "Glad to hear it! Take care!" },
];

export default async function chat(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (greets.includes(message.toLowerCase())) {
      res.status(200).json({ message: "Hello there, how you doing?" });
    } else {
      let foundResponse = false;

      for (const pattern of responsePatterns) {
        const lowerMessage = message.toLowerCase();
        if (pattern.keywords.some((keyword) => lowerMessage.includes(keyword))) {
          res.status(200).json({ message: pattern.response });
          foundResponse = true;
          break;
        }
      }

      if (!foundResponse) {
        for (const reply of genericReplies) {
          const lowerMessage = message.toLowerCase();
          if (lowerMessage.includes(reply.question)) {
            for (const answer of reply.answers) {
              if (lowerMessage.includes(answer)) {
                res.status(200).json({ message: reply.response });
                foundResponse = true;
                break;
              }
            }
          }
        }
      }

      if (!foundResponse) {
        res.status(400).json({
          message:
            'This chat is under development, and may not respond to all your questions. Try asking about my hobbies, education, experience, or who I am.',
        });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
