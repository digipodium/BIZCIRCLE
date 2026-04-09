const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    group: { type: Types.ObjectId, ref: 'groups', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    options: [{
        text: { type: String, required: true },
        votes: [{ type: Types.ObjectId, ref: 'User' }] // stores userIds who voted for this option
    }]
}, { timestamps: true });

module.exports = model('polls', mySchema);
