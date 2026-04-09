const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    group: { type: Types.ObjectId, ref: 'groups', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    status: { type: String, enum: ['Pending', 'Approved', 'Banned'], default: 'Approved' }
}, { timestamps: true });

module.exports = model('groupMembers', mySchema);
