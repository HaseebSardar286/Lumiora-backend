import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  name: string;
  email: string;
  company: string;
  notes: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  status: "Pending" | "Approved" | "Rejected" | "Rescheduled";
  meetingLink?: string;
  rescheduledDate?: string; // YYYY-MM-DD
  rescheduledTime?: string; // e.g. "10:00 AM"
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: "" },
  notes: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Rescheduled"], default: "Pending" },
  meetingLink: { type: String },
  rescheduledDate: { type: String },
  rescheduledTime: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
