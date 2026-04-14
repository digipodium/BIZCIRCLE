const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true }, // The user who receives it
    message: { type: String, required: true },
    type: { type: String, enum: ['Mention', 'Join', 'Event', 'System'], default: 'System' },
    isRead: { type: Boolean, default: false },
    linkTo: { type: String } // optional URL or ID to redirect
}, { timestamps: true });

module.exports = model('notifications', mySchema);
