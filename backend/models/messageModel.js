const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    group: { type: Types.ObjectId, ref: 'groups', required: true },
    sender: { type: Types.ObjectId, ref: 'users', required: true },
    content: { type: String },
    fileUrl: { type: String },
    mentions: [{ type: Types.ObjectId, ref: 'users' }]
}, { timestamps: true });

module.exports = model('messages', mySchema);
