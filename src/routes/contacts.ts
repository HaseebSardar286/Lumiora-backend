import { Router, Request, Response } from "express";
import Contact from "../models/Contact";
import { sendEmail } from "../lib/mail";
import { validateAdmin } from "../lib/auth";

const router = Router();

function formatContact(c: {
  contactId: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  notes: string;
  read?: boolean;
  createdAt: Date;
}) {
  return {
    id: c.contactId,
    name: c.name,
    email: c.email,
    company: c.company,
    projectType: c.projectType,
    budget: c.budget,
    notes: c.notes,
    read: Boolean(c.read),
    createdAt: c.createdAt,
  };
}

async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const email = (req.body?.email ?? req.query?.email) as string | undefined;
  const password = (req.body?.password ?? req.query?.password) as string | undefined;
  const isValid = await validateAdmin(email, password);
  if (!isValid) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// GET all contact messages (admin protected)
router.get("/", async (req: Request, res: Response) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({ contacts: contacts.map(formatContact) });
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH mark read / unread (admin protected)
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const { id } = req.params;
    if (typeof req.body.read !== "boolean") {
      return res.status(400).json({ error: "Body must include read: true | false" });
    }

    const contact = await Contact.findOneAndUpdate(
      { contactId: id },
      { read: req.body.read },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.json({ contact: formatContact(contact) });
  } catch (error: any) {
    console.error("Error updating contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE contact message (admin protected)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const { id } = req.params;
    const contact = await Contact.findOneAndDelete({ contactId: id });

    if (!contact) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.json({ success: true, id });
  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST new contact message
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, company, projectType, budget, notes } = req.body;

    if (!name || !email || !notes) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const contactId =
      "8BF-C-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newContact = new Contact({
      contactId,
      name,
      email,
      company: company || "",
      projectType: projectType || "",
      budget: budget || "",
      notes,
      read: false,
    });

    await newContact.save();

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `[Admin] New Project Inquiry: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
              <h2 style="color: #111184; margin-top: 0;">New Project Inquiry</h2>
              <p>A new project inquiry has been submitted:</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                <p><strong>Message ID:</strong> ${contactId}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || "N/A"}</p>
                <p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
                <p><strong>Budget:</strong> ${budget || "N/A"}</p>
                <p><strong>Project Description:</strong><br>${notes}</p>
              </div>
              <p style="font-size: 12px; color: #64748b;">This message was saved to the admin database. Access your dashboard at /admin to manage it.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("⚠️ Failed to send contact email to admin:", err);
      }
    }

    return res.json({ success: true, contact: formatContact(newContact) });
  } catch (error: any) {
    console.error("Contact submit error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to process contact message." });
  }
});

export default router;
