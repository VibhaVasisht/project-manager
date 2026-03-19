import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
    name:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String, required: true, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    deadline:{ type: Date },
    owner: { type: String, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);