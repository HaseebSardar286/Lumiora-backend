import { Router, Request, Response } from "express";
import Project from "../models/Project";
import { validateAdmin } from "../lib/auth";

const router = Router();

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProjectPayload(body: Record<string, unknown>) {
  const title = String(body.title || "").trim();
  let slug = String(body.slug || "").trim();
  if (!slug && title) {
    slug = slugify(title);
  } else if (slug) {
    slug = slugify(slug);
  }

  const image = String(body.image || "").trim();
  let screenshots = parseStringList(body.screenshots);
  if (screenshots.length === 0 && image) {
    screenshots = [image];
  }

  const liveUrlRaw = String(body.liveUrl || "").trim();

  return {
    slug,
    title,
    category: String(body.category || "").trim(),
    status: String(body.status || "Live").trim(),
    desc: String(body.desc || "").trim(),
    longDesc: String(body.longDesc || "").trim(),
    tags: parseStringList(body.tags),
    metrics: String(body.metrics || "").trim(),
    image,
    liveUrl: liveUrlRaw || undefined,
    screenshots,
    features: parseStringList(body.features),
    techStack: parseStringList(body.techStack),
    problem: String(body.problem || "").trim(),
    solution: String(body.solution || "").trim(),
    contribution: String(body.contribution || "").trim(),
    outcome: String(body.outcome || "").trim(),
  };
}

function validateProjectPayload(payload: ReturnType<typeof buildProjectPayload>): string | null {
  if (!payload.slug) return "Slug is required (or provide a title to auto-generate one).";
  if (!payload.title) return "Title is required.";
  if (!payload.category) return "Category is required.";
  if (!payload.status) return "Status is required.";
  if (!payload.desc) return "Short description is required.";
  if (!payload.longDesc) return "Long description is required.";
  if (!payload.metrics) return "Metrics / focus label is required.";
  if (!payload.image) return "Cover image is required.";
  return null;
}

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

// POST create project (admin)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;
    const isValid = await validateAdmin(email, password);
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = buildProjectPayload(rest);
    const validationError = validateProjectPayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existing = await Project.findOne({ slug: payload.slug });
    if (existing) {
      return res.status(409).json({ error: "A project with this slug already exists." });
    }

    const project = await Project.create(payload);
    return res.status(201).json({ project });
  } catch (error: any) {
    console.error("Error creating project:", error);
    if (error?.code === 11000) {
      return res.status(409).json({ error: "A project with this slug already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update project by slug (admin)
router.patch("/:slug", async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;
    const isValid = await validateAdmin(email, password);
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.params;
    const existing = await Project.findOne({ slug });
    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    const payload = buildProjectPayload({ ...existing.toObject(), ...rest, slug: rest.slug ?? slug });
    const validationError = validateProjectPayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (payload.slug !== slug) {
      const slugTaken = await Project.findOne({ slug: payload.slug });
      if (slugTaken) {
        return res.status(409).json({ error: "A project with this slug already exists." });
      }
    }

    const project = await Project.findOneAndUpdate({ slug }, { $set: payload }, { new: true });
    return res.json({ project });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE project by slug (admin)
router.delete("/:slug", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isValid = await validateAdmin(email, password);
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.params;
    const project = await Project.findOneAndDelete({ slug });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json({ success: true, slug });
  } catch (error: any) {
    console.error("Error deleting project:", error);
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
