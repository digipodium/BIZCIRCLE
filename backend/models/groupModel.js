const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    title: { type: String, required: true },
    admin: { type: Types.ObjectId, ref: 'users', unique: true },
    bio: { type: String },
}, { timestamps: true });

module.exports = model('groups', mySchema);