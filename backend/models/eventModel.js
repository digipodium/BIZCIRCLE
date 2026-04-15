const { Schema, model, Types } = require('../connection');

const mySchema = new Schema({
    targetId: { type: Types.ObjectId, required: true, refPath: 'targetModel' },
    targetModel: { type: String, required: true, enum: ['Group', 'Circle'] },
    title: { type: String, required: true },
    description: { type: String },
    dateTime: { type: Date, required: true },
    meetingLink: { type: String },
    createdBy: { type: Types.ObjectId, ref: 'User' },
    rsvp: [{
        user: { type: Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Attending', 'Maybe', 'Not Attending'], default: 'Attending' }
    }]
}, { timestamps: true });

module.exports = model('Event', mySchema); // Changed from 'events' to 'Event' for consistency
