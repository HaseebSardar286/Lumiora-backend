import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  slug: string;
  title: string;
  category: string;
  status: string;
  desc: string;
  longDesc: string;
  tags: string[];
  metrics: string;
  image: string;
  liveUrl?: string;
  screenshots: string[];
  features: string[];
  techStack: string[];
  problem?: string;
  solution?: string;
  contribution?: string;
  outcome?: string;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  desc: { type: String, required: true },
  longDesc: { type: String, required: true },
  tags: { type: [String], required: true },
  metrics: { type: String, required: true },
  image: { type: String, required: true },
  liveUrl: { type: String },
  screenshots: { type: [String], required: true },
  features: { type: [String], required: true },
  techStack: { type: [String], required: true },
  problem: { type: String, default: "" },
  solution: { type: String, default: "" },
  contribution: { type: String, default: "" },
  outcome: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
