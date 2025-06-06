import { Request, Response, NextFunction } from "express";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import config from "config";
import logger from "./utils/logger";
import { Checkin } from "./models/checkin.model";
import { OpenAIResponse } from "./types";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });

export const getCheckInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Logic to get check-in data
    res.status(200).json({ message: "Check-in data retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

export const createCheckInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // userId,
    const { moodEmoji, emotion: moodEmotion, reflection } = req.body;

    // Basic check to block code-related requests
    const forbiddenKeywords = [
      "code",
      "javascript",
      "python",
      "html",
      "generate",
      "build",
      "script",
    ];
    if (forbiddenKeywords.some((kw) => reflection.toLowerCase().includes(kw))) {
      res.status(400).json({
        error:
          "This chatbot is for emotional support only. Technical requests are not allowed.",
      });
      return;
    }

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `
        You are an empathetic AI therapist. Given a journal entry (an emoji, emotion label, and reflection), extract the user's emotional state and write a supportive, friendly 2–3 sentence message. Also include an array of affirmations.
        Respond strictly in JSON format with: { "emotion": string, "response": string, "affirmations": string[] }
        Do not answer technical questions. Politely decline non-emotional topics.`,
    };

    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: `
        Mood Emoji: ${moodEmoji}
        Detected Emotion: ${moodEmotion}
        Reflection: ${reflection}
      `,
    };

    const moderationRes = await openai.moderations.create({
      input: reflection,
    });
    const [results] = moderationRes.results;

    if (results.flagged) {
      res.status(400).json({
        error:
          "Your message was flagged as inappropriate or unsafe. Please rephrase it.",
      });
      return;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [systemMessage, userMessage],
      temperature: 0.7,
      max_tokens: 500,
    });

    // const newCheckIn = await Checkin.create({
    //   userId,
    //   emotion: moodEmotion,
    // });

    // await newCheckIn.save();

    const content = response.choices[0].message.content;
    const {
      emotion,
      response: message,
      affirmations,
    } = JSON.parse(content || "") as OpenAIResponse;

    res.status(201).json({ emotion, message, affirmations });
    return;
  } catch (error: any) {
    logger.error("createCheckInController error:", error);
    res.status(500).json({
      error:
        "We are having trouble processing your reflection. Please try again shortly.",
    });
  }
};
