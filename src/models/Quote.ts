import mongoose, { Schema, Document } from "mongoose";

export interface IQuote extends Document {
  quoteId: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  services: string[];
  budget: string;
  notes: string;
  createdAt: Date;
}

const QuoteSchema: Schema = new Schema({
  quoteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: "" },
  phone: { type: String, default: "" },
  services: { type: [String], required: true },
  budget: { type: String, required: true },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);
