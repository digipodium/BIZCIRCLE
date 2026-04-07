const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    logo: { type: String, default: '' },
    rules: { type: String, default: '' },
    isPrivate: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });

module.exports = model('groups', mySchema);