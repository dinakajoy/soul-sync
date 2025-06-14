import { Router } from "express";
import {
  chatController,
  createCheckInController,
  createJournalController,
  createSyncController,
  deleteDataController,
  getAllController,
  getCheckInController,
  getCountsController,
  getCurrentUserController,
  getJournalController,
  getSyncController,
  storeSyncController,
} from "./controllers";
import {
  checkinValidation,
  journalValidation,
  storeSyncValidation,
  syncValidation,
  validate,
} from "./validations";
import { isAuthenticated } from "./middlewares";

const router = Router();

router.get("/current-user", isAuthenticated, getCurrentUserController);

router.post(
  "/check-in",
  checkinValidation(),
  validate,
  createCheckInController
);

router.get("/check-in", isAuthenticated, getCheckInController);

router.post(
  "/journal",
  isAuthenticated,
  journalValidation(),
  validate,
  createJournalController
);

router.get("/journal", isAuthenticated, getJournalController);

router.post(
  "/sync",
  isAuthenticated,
  syncValidation(),
  validate,
  createSyncController
);

router.post(
  "/track-sync",
  isAuthenticated,
  storeSyncValidation(),
  validate,
  storeSyncController
);
router.get("/sync", isAuthenticated, getSyncController);

router.delete("/deete-data/:type", isAuthenticated, deleteDataController);

router.post("/chat", isAuthenticated, chatController);

router.get("/counts", isAuthenticated, getCountsController);
router.get("/get-all", isAuthenticated, getAllController);

export default router;
