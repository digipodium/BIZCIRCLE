const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bizcircle'); // or whatever connection string
  
  const circleSchema = new mongoose.Schema({}, { strict: false, collection: 'circles' });
  const Circle = mongoose.model('Circle', circleSchema);
  
  const circles = await Circle.find({});
  console.log('CIRCLES', circles.length);
  
  for (const c of circles) {
    console.log(`Circle: ${c.name}, Domain: ${c.domain}`);
    console.log(`Related: ${c.relatedDomains}`);
    
    // Simulate user domain
    const userDomain = 'Web Development'.toLowerCase();
    const allDomains = [c.domain, ...(c.relatedDomains || [])].map(d => d.toLowerCase());
    
    const isSimilar = allDomains.some(d => d.includes(userDomain.split(' ')[0]) || userDomain.includes(d.split(' ')[0]));
    
    console.log('Is similar?', isSimilar);
    console.log('---');
  }
  process.exit();
}
test();
