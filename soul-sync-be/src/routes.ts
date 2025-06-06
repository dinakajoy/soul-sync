import { Router } from "express";
import { createCheckInController } from "./controllers";
import { checkinValidation, validate } from "./validations";

const router = Router();

router.post(
  "/check-in",
  checkinValidation(),
  validate,
  createCheckInController
);

export default router;
