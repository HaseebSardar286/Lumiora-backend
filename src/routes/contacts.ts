import { Router, Request, Response } from "express";
import Contact from "../models/Contact";
import { sendEmail } from "../lib/mail";
import { validateAdmin } from "../lib/auth";

const router = Router();

// GET all contact messages (admin protected)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.query;
    const isValid = await validateAdmin(email, password);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    const formattedContacts = contacts.map((c) => ({
      id: c.contactId,
      name: c.name,
      email: c.email,
      company: c.company,
      projectType: c.projectType,
      budget: c.budget,
      notes: c.notes,
      createdAt: c.createdAt
    }));

    return res.json({ contacts: formattedContacts });
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
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

    const contactId = "8BF-C-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newContact = new Contact({
      contactId,
      name,
      email,
      company: company || "",
      projectType: projectType || "",
      budget: budget || "",
      notes
    });

    await newContact.save();

    // Send email alert to admin
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
          `
        });
      } catch (err) {
        console.error("⚠️ Failed to send contact email to admin:", err);
      }
    }

    return res.json({ success: true, contact: newContact });
  } catch (error: any) {
    console.error("Contact submit error:", error);
    return res.status(500).json({ error: error.message || "Failed to process contact message." });
  }
});

export default router;
