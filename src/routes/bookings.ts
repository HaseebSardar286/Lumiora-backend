import { Router, Request, Response } from "express";
import Booking from "../models/Booking";
import AdminConfig from "../models/AdminConfig";
import {
  sendEmail,
  getAdminNotificationEmail,
  getUserPendingEmail,
  getUserApprovedEmail,
  getUserRejectedEmail,
  getUserRescheduledEmail
} from "../lib/mail";
import { validateAdmin } from "../lib/auth";

const router = Router();

// GET all bookings (admin protected)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.query;
    const isValid = await validateAdmin(email, password);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Map database values to camelCase properties for frontend compatibility
    const formattedBookings = bookings.map((b) => ({
      id: b.bookingId,
      name: b.name,
      email: b.email,
      company: b.company,
      notes: b.notes,
      date: b.date,
      time: b.time,
      status: b.status,
      meetingLink: b.meetingLink,
      rescheduledDate: b.rescheduledDate,
      rescheduledTime: b.rescheduledTime,
      createdAt: b.createdAt
    }));

    return res.json({ bookings: formattedBookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET available slots for a date
router.get("/available-slots", async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== "string") {
      return res.status(400).json({ error: "date parameter is required in YYYY-MM-DD format" });
    }

    const config = await AdminConfig.findOne({ key: "global_config" });
    const slots = config ? config.slots : [];
    const blockedDates = config ? config.blockedDates : [];

    // If date is fully blocked, return no slots
    if (blockedDates.includes(date)) {
      return res.json({ slots: [] });
    }

    // Find all active bookings on this date (Pending, Approved, Rescheduled)
    const activeBookings = await Booking.find({
      date,
      status: { $in: ["Pending", "Approved", "Rescheduled"] }
    });

    const bookedSlots = activeBookings.map((b) => b.time);

    // Filter out already booked slots
    let availableSlots = slots.filter((slot: string) => !bookedSlots.includes(slot));

    // If looking at today, disable past time slots
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      availableSlots = availableSlots.filter((slot: string) => {
        // Parse "HH:MM AM/PM"
        const matches = slot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        if (!matches) return true;

        let hours = parseInt(matches[1]);
        const minutes = parseInt(matches[2]);
        const ampm = matches[3].toUpperCase();

        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        if (hours > currentHours) return true;
        if (hours === currentHours && minutes > currentMinutes) return true;
        return false;
      });
    }

    return res.json({ slots: availableSlots });
  } catch (error: any) {
    console.error("Error checking available slots:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST submit a new booking
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, company, notes, date, time } = req.body;

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Double check availability
    const config = await AdminConfig.findOne({ key: "global_config" });
    if (config && config.blockedDates.includes(date)) {
      return res.status(400).json({ error: "Selected date is blocked" });
    }

    const doubleBooked = await Booking.findOne({
      date,
      time,
      status: { $in: ["Pending", "Approved", "Rescheduled"] }
    });

    if (doubleBooked) {
      return res.status(400).json({ error: "This time slot is already booked" });
    }

    const bookingId = "8BF-B-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Verify email can be sent successfully before saving to database
    // This matches the validation requirement of showing success ONLY after successful email transfer
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `[Admin] New Booking Request from ${name}`,
        html: getAdminNotificationEmail({
          id: bookingId,
          name,
          email,
          company: company || "",
          date,
          time,
          notes: notes || "",
          baseUrl
        })
      });
    }

    await sendEmail({
      to: email,
      subject: "Consultation Request Received - 8BitField",
      html: getUserPendingEmail({
        name,
        date,
        time,
        id: bookingId,
        baseUrl
      })
    });

    // Save to MongoDB
    const newBooking = new Booking({
      bookingId,
      name,
      email,
      company: company || "",
      notes: notes || "",
      date,
      time,
      status: "Pending"
    });

    await newBooking.save();

    return res.json({ success: true, booking: { id: bookingId } });
  } catch (error: any) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: error.message || "Failed to process booking request." });
  }
});

// GET single booking detail by custom ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ bookingId: id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.json({
      booking: {
        id: booking.bookingId,
        name: booking.name,
        email: booking.email,
        company: booking.company,
        notes: booking.notes,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        meetingLink: booking.meetingLink,
        rescheduledDate: booking.rescheduledDate,
        rescheduledTime: booking.rescheduledTime,
        createdAt: booking.createdAt
      }
    });
  } catch (error: any) {
    console.error("Error reading booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST update booking status (admin action)
router.post("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, meetingLink, rescheduledDate, rescheduledTime, email, password } = req.body;

    const isValid = await validateAdmin(email, password);
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const booking = await Booking.findOne({ bookingId: id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    if (action === "approve") {
      if (!meetingLink || !meetingLink.trim()) {
        return res.status(400).json({ error: "Meeting link is required for approval" });
      }

      // Check if slot is taken by another approved booking (excluding current one)
      const doubleBooked = await Booking.findOne({
        bookingId: { $ne: id },
        date: booking.date,
        time: booking.time,
        status: "Approved"
      });

      if (doubleBooked) {
        return res.status(400).json({ error: "This slot is already approved for another booking" });
      }

      await sendEmail({
        to: booking.email,
        subject: "Consultation Approved & Meeting Details - 8BitField",
        html: getUserApprovedEmail({
          name: booking.name,
          date: booking.date,
          time: booking.time,
          meetingLink
        })
      });

      booking.status = "Approved";
      booking.meetingLink = meetingLink;
      await booking.save();
    } else if (action === "decline") {
      await sendEmail({
        to: booking.email,
        subject: "Consultation Request Declined - 8BitField",
        html: getUserRejectedEmail({
          name: booking.name,
          date: booking.date,
          time: booking.time,
          baseUrl
        })
      });

      booking.status = "Rejected";
      await booking.save();
    } else if (action === "reschedule") {
      if (!rescheduledDate || !rescheduledTime) {
        return res.status(400).json({ error: "New date and time are required for rescheduling" });
      }

      await sendEmail({
        to: booking.email,
        subject: "Consultation Suggested Reschedule Time - 8BitField",
        html: getUserRescheduledEmail({
          name: booking.name,
          originalDate: booking.date,
          originalTime: booking.time,
          suggestedDate: rescheduledDate,
          suggestedTime: rescheduledTime,
          id: booking.bookingId,
          baseUrl
        })
      });

      booking.status = "Rescheduled";
      booking.rescheduledDate = rescheduledDate;
      booking.rescheduledTime = rescheduledTime;
      await booking.save();
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    return res.json({
      success: true,
      booking: {
        id: booking.bookingId,
        status: booking.status,
        meetingLink: booking.meetingLink
      }
    });
  } catch (error: any) {
    console.error("Status update error:", error);
    return res.status(500).json({ error: error.message || "Failed to update booking status." });
  }
});

// POST respond to rescheduling proposal (user action)
router.post("/:id/respond", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { response } = req.body; // "accept" | "decline"

    if (!response || (response !== "accept" && response !== "decline")) {
      return res.status(400).json({ error: "response must be either 'accept' or 'decline'" });
    }

    const booking = await Booking.findOne({ bookingId: id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "Rescheduled") {
      return res.status(400).json({ error: "Booking is not in Rescheduled state" });
    }

    if (response === "accept") {
      const newDate = booking.rescheduledDate;
      const newTime = booking.rescheduledTime;

      if (!newDate || !newTime) {
        return res.status(500).json({ error: "Suggested reschedule values are missing" });
      }

      // Check if slot has since been taken
      const doubleBooked = await Booking.findOne({
        bookingId: { $ne: id },
        date: newDate,
        time: newTime,
        status: "Approved"
      });

      if (doubleBooked) {
        return res.status(400).json({ error: "Suggested slot has since been taken. Request reschedule again." });
      }

      const meetingLink = `https://meet.google.com/lumi-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;

      await sendEmail({
        to: booking.email,
        subject: "Consultation Approved & Meeting Details - 8BitField",
        html: getUserApprovedEmail({
          name: booking.name,
          date: newDate,
          time: newTime,
          meetingLink
        })
      });

      // Send admin alert
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      if (adminEmail) {
        try {
          await sendEmail({
            to: adminEmail,
            subject: `[Admin] Client Accepted Reschedule: ${booking.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #10b981; margin-top: 0;">Reschedule Suggestion Accepted</h2>
                <p>Client ${booking.name} has accepted the proposed time slot:</p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                  <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                  <p><strong>Confirmed Date:</strong> ${newDate}</p>
                  <p><strong>Confirmed Time:</strong> ${newTime}</p>
                  <p><strong>Auto Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
                </div>
              </div>
            `
          });
        } catch (err) {
          console.error("⚠️ Failed to email reschedule accept to admin:", err);
        }
      }

      booking.date = newDate;
      booking.time = newTime;
      booking.status = "Approved";
      booking.meetingLink = meetingLink;
      booking.rescheduledDate = undefined;
      booking.rescheduledTime = undefined;
      await booking.save();
    } else {
      // client declined reschedule proposal
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      if (adminEmail) {
        try {
          await sendEmail({
            to: adminEmail,
            subject: `[Admin] Client Declined Reschedule: ${booking.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #ef4444; margin-top: 0;">Reschedule Suggestion Declined</h2>
                <p>Client ${booking.name} has declined the proposed rescheduled time slot.</p>
                <p>The booking status is now Rejected/Declined.</p>
              </div>
            `
          });
        } catch (err) {
          console.error("⚠️ Failed to email reschedule decline to admin:", err);
        }
      }

      booking.status = "Rejected";
      await booking.save();
    }

    return res.json({ success: true, booking: { id: booking.bookingId, status: booking.status } });
  } catch (error: any) {
    console.error("Reschedule response error:", error);
    return res.status(500).json({ error: error.message || "Failed to submit response." });
  }
});

export default router;
