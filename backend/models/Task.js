const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String, required: true, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    projectId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    priority:{ type: String, required: true, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate:{ type: Date  }
}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);