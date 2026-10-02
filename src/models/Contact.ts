import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  contactId: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  notes: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  contactId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: "" },
  projectType: { type: String, default: "" },
  budget: { type: String, default: "" },
  notes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
