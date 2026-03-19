import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
    title:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String, required: true, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    projectId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    priority:{ type: String, required: true, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate:{ type: Date },
    owner: { type: String, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);