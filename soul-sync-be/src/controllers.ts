import { Request, Response, NextFunction } from "express";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import config from "config";
import Sentiment from "sentiment";

import logger from "./utils/logger";
import { Checkin } from "./models/checkin.model";
import { Journal } from "./models/journal.model";
import { Sync } from "./models/sync.model";
import { User } from "./models/user.model";
import {
  IUser,
  OpenAICheckinResponse,
  OpenAIJournalResponse,
  OpenAISyncResponse,
} from "./types";

const apiKey = config.get("environment.apiKey") as string;

const openai = new OpenAI({ apiKey });
const sentiment = new Sentiment();

export const getUserId = (req: Request) => {
  const user = req.user as IUser;

  if (!user?._id) {
    return undefined;
  }

  return user._id.toString();
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserId(req);
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  res.status(201).json(user);
  return;
};

export const createCheckInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
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
        You are a kind, empathetic AI focused on emotional well-being. Given a short emotional check-in (which may include an emoji, emotion label, and a sentence or two of reflection), identify the user's emotional state and respond with a friendly, supportive message.
    
        Return your response strictly in JSON format like this:
        {
          "emotion": string,             // one-word core emotion (e.g., "anxious", "hopeful", "exhausted")
          "response": string,            // 2–3 sentence empathetic response
          "affirmations": string[]       // 2–4 short affirmations, e.g., "I am grounded", "This feeling will pass"
        }
    
        If the input is not emotional, do not answer. Instead, return:
        {
          "emotion": null,
          "response": "I'm here to support emotional reflections. Let's focus on how you're feeling.",
          "affirmations": []
        }
      `,
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

    const newCheckIn = await Checkin.create({
      userId,
      emotion: moodEmotion,
      moodEmoji: moodEmoji,
    });

    await newCheckIn.save();

    const content = response.choices[0].message.content;
    const {
      emotion,
      response: message,
      affirmations,
    } = JSON.parse(content || "") as OpenAICheckinResponse;

    res.status(201).json({ emotion, message, affirmations });
    return;
  } catch (error: any) {
    logger.error("createCheckInController error:", error);
    res.status(500).json({
      error:
        "We are having trouble processing your reflection. Please try again shortly.",
    });
    return;
  }
};

export const getCheckInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const checkins = await Checkin.find({
      userId,
    }).sort({ date: -1 });

    if (!checkins || checkins.length === 0) {
      res.status(404).json({ message: "No check-ins found" });
      return;
    }

    res.status(200).json({ checkins });
    return;
  } catch (error) {
    next(error);
  }
};

export const createJournalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const { entry } = req.body;

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
    if (forbiddenKeywords.some((kw) => entry.toLowerCase().includes(kw))) {
      res.status(400).json({
        error:
          "This chatbot is for emotional support only. Technical requests are not allowed.",
      });
      return;
    }

    const prompt = `
    You are a compassionate AI mental health companion helping a user reflect on their private journal entry.

    Your job is to read the following journal text and do two things:
    1. Write a short, kind reflection in the second person (talk directly to "you") — as if gently responding to the user. Keep it empathetic and validating (2–3 sentences).
    2. Extract up to 3 key emotional or psychological themes the user is expressing. These can be emotions, inner struggles, or recurring patterns.

    Only respond in this strict JSON format:
    {
      "summary": "Your short reflective message here, written in second person.",
      "themes": ["Theme1", "Theme2", "Theme3"],
      "mood": "Capitalize first word e.g., 'Anxious', 'Hopeful'"
    }

    If the entry is empty or not emotional in nature, return:
    {
      "summary": "I'm here whenever you're ready to share what’s on your mind.",
      "themes": []
    }

    Journal Entry:
    """${entry}"""
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const moderationRes = await openai.moderations.create({
      input: entry,
    });
    const [results] = moderationRes.results;

    if (results.flagged) {
      res.status(400).json({
        error:
          "Your message was flagged as inappropriate or unsafe. Please rephrase it.",
      });
      return;
    }

    const jsonText = completion.choices[0].message.content?.trim();

    const { summary, themes, mood } = JSON.parse(
      jsonText || ""
    ) as OpenAIJournalResponse;

    // Save to DB
    const newJournal = await Journal.create({
      userId,
      entry,
      mood,
      reflection: summary,
      themes,
    });
    await newJournal.save();

    res.status(201).json({ summary, themes, mood });
    return;
  } catch (error: any) {
    logger.error("createJournalController error:", error);
    res.status(500).json({
      error:
        "We are having trouble processing your journal. Please try again shortly.",
    });
    return;
  }
};

export const getJournalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const journals = await Journal.find({
      userId,
    }).sort({ date: -1 });

    if (!journals || journals.length === 0) {
      res.status(404).json({ message: "No journals found" });
      return;
    }

    res.status(200).json({ journals });
    return;
  } catch (error) {
    next(error);
  }
};

export const createSyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { theme, currentQuestion, userResponse } = req.body;

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
    if (
      forbiddenKeywords.some((kw) => userResponse.toLowerCase().includes(kw))
    ) {
      res.status(400).json({
        error:
          "This chatbot is for emotional support only. Technical requests are not allowed.",
      });
      return;
    }

    const prompt = `
    You are a warm, wise, and supportive emotional coach guiding a user through a self-reflection session on the topic of "${theme}".

    The user just answered the reflection prompt:
    "${currentQuestion}"

    Their answer:
    "${userResponse}"

    Now, respond as a compassionate coach. Your response should:
    1. Gently validate their feeling or thought.
    2. Offer one follow-up insight, question, or affirmation to help them reflect further, but keep it light and supportive.

    Your tone is soft, kind, encouraging.
    Return your response strictly in JSON format like this:
        {
          "question": string,      // one-sentence follow-up insight or question
          "response": string,      // 2–3 sentence compassionate and empathetic response
        }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const moderationRes = await openai.moderations.create({
      input: userResponse,
    });
    const [results] = moderationRes.results;

    if (results.flagged) {
      res.status(400).json({
        error:
          "Your message was flagged as inappropriate or unsafe. Please rephrase it.",
      });
      return;
    }

    const jsonText = completion.choices[0].message.content?.trim();

    const { question, response } = JSON.parse(
      jsonText || ""
    ) as OpenAISyncResponse;

    res.status(201).json({ question, response });
    return;
  } catch (error: any) {
    logger.error("createSyncController error:", error);
    res.status(500).json({
      error:
        "We are having trouble processing your sync session. Please try again shortly.",
    });
    return;
  }
};

export const storeSyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const { theme } = req.body;

    // Save to DB
    const newSync = await Sync.create({
      userId,
      theme,
    });
    await newSync.save();

    return;
  } catch (error: any) {
    logger.error("storeSyncController error:", error);
    res.status(500).json({
      error:
        "We are having trouble processing your sync. Please try again shortly.",
    });
    res.status(204).end();
    return;
  }
};

export const getSyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const syncs = await Sync.find({
      userId,
    }).sort({ date: -1 });

    if (!syncs || syncs.length === 0) {
      res.status(404).json({ message: "No syncs found" });
      return;
    }

    res.status(200).json({ syncs });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.params;
    const userId = getUserId(req);
    if (type === "all") {
      await Checkin.deleteMany({ userId });
      await Journal.deleteMany({ userId });
      await Sync.deleteMany({ userId });
      res.status(200).json({ message: "All data deleted successfully." });
      return;
    } else if (type === "checkin") {
      await Checkin.deleteMany({ userId });
      res.status(200).json({ message: "All check-ins deleted successfully." });
      return;
    } else if (type === "journal") {
      await Journal.deleteMany({ userId });
      res
        .status(200)
        .json({ message: "All journal entries deleted successfully." });
      return;
    } else if (type === "sync") {
      await Sync.deleteMany({ userId });
      res
        .status(200)
        .json({ message: "All sync entries deleted successfully." });
      return;
    } else {
      res.status(400).json({ error: "Invalid data type specified." });
      return;
    }
  } catch (error) {
    logger.error("deleteDataController error:", error);
    res.status(500).json({
      error:
        "We are having trouble processing your request. Please try again shortly.",
    });
    return;
  }
};

export const chatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Valid message is required" });
      return;
    }

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
    if (forbiddenKeywords.some((kw) => message.toLowerCase().includes(kw))) {
      res.status(400).json({
        error:
          "This chatbot is for emotional support only. Technical requests are not allowed.",
      });
      return;
    }

    const sentimentResult = sentiment.analyze(message);
    const tone =
      sentimentResult.score > 0
        ? "positive"
        : sentimentResult.score < 0
        ? "negative"
        : "neutral";

    const systemMessage = {
      role: "system",
      content: `
        You are TheraBot, a compassionate, supportive AI therapist. 
        Your role is to provide emotional support, active listening, and mental health guidance.
        Do not generate code, answer technical questions, or discuss topics outside emotional well-being.
        If a message asks for anything outside mental support, kindly redirect or decline respectfully.`,
    };

    const userMessage = {
      role: "user",
      content: `Tone: ${tone}. Message: ${message}`,
    };

    const moderationRes = await openai.moderations.create({ input: message });
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
      messages: [systemMessage, ...history, userMessage],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.status(200).json({ reply: response.choices[0].message.content });
    return;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      logger.error("chatController SyntaxError:", error);
    } else {
      logger.error("deleteDataController error:", error);
    }
    res.status(500).json({
      error:
        "We are having trouble processing your request. Please try again shortly.",
    });
    return;
  }
};

export const getCountsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const [journalCount, checkInCount, syncSessionCount] = await Promise.all([
      Journal.countDocuments({ userId }),
      Checkin.countDocuments({ userId }),
      Sync.countDocuments({ userId }),
    ]);

    res.json({
      journalCount,
      checkInCount,
      syncSessionCount,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const [journals, checkins, syncSessions] = await Promise.all([
      Journal.find({
        userId,
      }).sort({ date: -1 }),
      Checkin.find({
        userId,
      }).sort({ date: -1 }),
      Sync.find({
        userId,
      }).sort({ date: -1 }),
    ]);

    res.json({
      journals,
      checkins,
      syncSessions,
    });
    return;
  } catch (error) {
    next(error);
  }
};
