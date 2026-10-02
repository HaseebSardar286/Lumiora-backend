import { Router, Request, Response } from "express";
import Quote from "../models/Quote";
import { sendEmail } from "../lib/mail";
import { validateAdmin } from "../lib/auth";

const router = Router();

// GET all quotes (admin protected)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.query;
    const isValid = await validateAdmin(email, password);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const quotes = await Quote.find().sort({ createdAt: -1 });
    // Map output to match the format of JSON database structure (camelCase properties)
    const formattedQuotes = quotes.map((q) => ({
      id: q.quoteId,
      name: q.name,
      email: q.email,
      company: q.company,
      phone: q.phone,
      services: q.services,
      budget: q.budget,
      notes: q.notes,
      createdAt: q.createdAt
    }));

    return res.json({ quotes: formattedQuotes });
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST new quote request
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, company, phone, services, budget, notes } = req.body;

    if (!name || !email || !services || services.length === 0 || !budget) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const quoteId = "8BF-Q-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newQuote = new Quote({
      quoteId,
      name,
      email,
      company: company || "",
      phone: phone || "",
      services,
      budget,
      notes: notes || ""
    });

    await newQuote.save();

    // Send email alert to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `[Admin] New Quote Request: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
              <h2 style="color: #3b82f6; margin-top: 0;">New Project Quote Request Received</h2>
              <p>A new request has been submitted with the details below:</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                <p><strong>Quote ID:</strong> ${quoteId}</p>
                <p><strong>Client Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || "N/A"}</p>
                <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                <p><strong>Requested Services:</strong> ${services.join(", ")}</p>
                <p><strong>Est. Budget:</strong> ${budget}</p>
                <p><strong>Project Description:</strong><br>${notes || "None"}</p>
              </div>
              <p style="font-size: 12px; color: #64748b;">This request was saved to the admin database. Access your dashboard at /admin to manage it.</p>
            </div>
          `
        });
      } catch (err) {
        console.error("⚠️ Failed to send quote email to admin:", err);
      }
    }

    return res.json({ success: true, quote: newQuote });
  } catch (error: any) {
    console.error("Quote submit error:", error);
    return res.status(500).json({ error: error.message || "Failed to process quote request." });
  }
});

export default router;
