import { Router, Request, Response } from "express";
import AdminConfig from "../models/AdminConfig";
import { validateAdmin } from "../lib/auth";

const router = Router();

// GET global availability config (admin protected)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.query;
    const isValid = await validateAdmin(email, password);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const config = await AdminConfig.findOne({ key: "global_config" });
    if (!config) {
      return res.status(404).json({ error: "Config not found" });
    }

    return res.json({ config: { slots: config.slots, blockedDates: config.blockedDates } });
  } catch (error: any) {
    console.error("Error reading config:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST update global config
router.post("/", async (req: Request, res: Response) => {
  try {
    const { slots, blockedDates, email, password } = req.body;
    const isValid = await validateAdmin(email, password);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!Array.isArray(slots)) {
      return res.status(400).json({ error: "slots parameter must be an array of strings" });
    }

    const config = await AdminConfig.findOneAndUpdate(
      { key: "global_config" },
      {
        slots,
        blockedDates: Array.isArray(blockedDates) ? blockedDates : []
      },
      { new: true, upsert: true }
    );

    return res.json({ config: { slots: config.slots, blockedDates: config.blockedDates } });
  } catch (error: any) {
    console.error("Error saving config:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
