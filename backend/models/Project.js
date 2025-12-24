const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String, required: true, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);