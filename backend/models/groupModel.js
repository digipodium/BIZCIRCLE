const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    domain: { type: String, default: 'General' },
    location: { type: String, default: 'Global' },
    icon: { type: String, default: '💻' },
    color: { type: String, default: 'from-blue-500 to-blue-700' },
    category: { type: String, default: 'General' },
    logo: { type: String, default: '' },
    rules: { type: String, default: '' },
    isPrivate: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = model('groups', mySchema);