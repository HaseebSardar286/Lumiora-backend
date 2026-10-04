import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validateAdmin } from "../lib/auth";

const router = Router();

// On Vercel/serverless only /tmp is writable; locally use ./uploads
export const UPLOADS_ROOT = process.env.VERCEL
  ? path.join("/tmp", "8bitfield-uploads")
  : path.join(process.cwd(), "uploads");

const PROJECTS_UPLOAD_DIR = path.join(UPLOADS_ROOT, "projects");

function ensureDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error("⚠️ Could not create upload directory:", dir, error);
  }
}

// Lazy init — never crash the whole API at import time on serverless
ensureDir(PROJECTS_UPLOAD_DIR);

function slugifyFolder(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    try {
      const folder = slugifyFolder(String(req.body.folder || req.query.folder || "project"));
      const dest = path.join(PROJECTS_UPLOAD_DIR, folder);
      ensureDir(dest);
      cb(null, dest);
    } catch (error: any) {
      cb(error, "");
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed."));
    }
    cb(null, true);
  },
});

// POST /api/uploads/projects — admin image upload
router.post("/projects", (req: Request, res: Response) => {
  if (process.env.VERCEL) {
    return res.status(503).json({
      error:
        "Image uploads are not available on the serverless API host. Use image URLs, or run the API on a host with persistent disk.",
    });
  }

  upload.array("images", 12)(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message || "Upload failed." });
      }

      const email = req.body.email;
      const password = req.body.password;
      const isValid = await validateAdmin(email, password);
      if (!isValid) {
        const files = (req.files as Express.Multer.File[]) || [];
        for (const file of files) {
          try {
            fs.unlinkSync(file.path);
          } catch {
            /* ignore */
          }
        }
        return res.status(401).json({ error: "Unauthorized" });
      }

      const files = (req.files as Express.Multer.File[]) || [];
      if (files.length === 0) {
        return res.status(400).json({ error: "No images uploaded." });
      }

      const folder = slugifyFolder(String(req.body.folder || "project"));
      const urls = files.map((file) => `/uploads/projects/${folder}/${file.filename}`);

      return res.status(201).json({ urls });
    } catch (error: any) {
      console.error("Error uploading project images:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

export default router;
