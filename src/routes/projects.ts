import { Router, Request, Response } from "express";
import Project from "../models/Project";

const router = Router();

// GET all projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    return res.json({ projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET single project by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.json({ project });
  } catch (error: any) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
