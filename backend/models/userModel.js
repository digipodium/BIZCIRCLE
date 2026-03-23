const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
}, { timestamps: true });

module.exports = model('users', mySchema);