import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const checkinValidation = () => [
  body("moodEmoji").isLength({ min: 1, max: 1 }).trim(),
  body("emotion").isLength({ min: 3 }).trim(),
  body("reflection").isLength({ min: 1 }).trim(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: any = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(422).json({
    status: "error",
    errors: errors.array().map((err: any) => ({
      field: err.path,
      message: err.msg,
    })),
  });
  return;
};
