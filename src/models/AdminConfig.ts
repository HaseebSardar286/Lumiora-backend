import mongoose, { Schema, Document } from "mongoose";

export interface IAdminConfig extends Document {
  key: string;
  slots: string[];
  blockedDates: string[];
}

const AdminConfigSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true, default: "global_config" },
  slots: { type: [String], required: true },
  blockedDates: { type: [String], default: [] }
});

export default mongoose.models.AdminConfig || mongoose.model<IAdminConfig>("AdminConfig", AdminConfigSchema);
