import 'dotenv/config';
import mongoose from 'mongoose';
import { connectToDatabase } from './src/config/db.js';
import Customer from './src/models/Customer.js';
import Event from './src/models/Event.js';
import Segment from './src/models/Segment.js';
import Template from './src/models/Template.js';
import Campaign from './src/models/Campaign.js';
import Delivery from './src/models/Delivery.js';

async function main() {
  await connectToDatabase();
  await Promise.all([
    Customer.deleteMany({}),
    Event.deleteMany({}),
    Segment.deleteMany({}),
    Template.deleteMany({}),
    Campaign.deleteMany({}),
    Delivery.deleteMany({}),
  ]);

  // Create customers matching frontend mock data
  const customers = await Customer.insertMany([
    { name: 'John Doe', email: 'john@example.com', locale: 'en-US', traits: { tier: 'gold' }, preferences: { channels: ['email'] } },
    { name: 'Jane Smith', email: 'jane@example.com', locale: 'en-US', traits: { tier: 'silver' }, preferences: { channels: ['email'] } },
    { name: 'Mike Johnson', email: 'mike@example.com', locale: 'en-US', traits: { tier: 'standard' }, preferences: { channels: ['email'] } },
    { name: 'Sarah Williams', email: 'sarah@example.com', locale: 'en-US', traits: { tier: 'standard' }, preferences: { channels: ['email'] } },
    { name: 'Tom Brown', email: 'tom@example.com', locale: 'en-US', traits: { tier: 'platinum' }, preferences: { channels: ['email'] } },
  ]);

  // Some historical events
  await Event.insertMany([
    { customerId: customers[0]._id, type: 'view', props: { page: 'deals' }, timestamp: new Date() },
    { customerId: customers[1]._id, type: 'view', props: { page: 'destinations' }, timestamp: new Date() },
    { customerId: customers[2]._id, type: 'view', props: { page: 'home' }, timestamp: new Date() },
  ]);

  // Create segments matching frontend mock data
  const segments = await Segment.insertMany([
    {
      name: 'High Value',
      rules: [{ field: 'traits.tier', op: 'in', value: ['gold', 'platinum'] }],
      daysLookback: 90,
    },
    {
      name: 'Frequent Traveler',
      rules: [{ field: 'traits.tier', op: 'in', value: ['silver', 'gold'] }],
      daysLookback: 90,
    },
    {
      name: 'New Customer',
      rules: [{ field: 'traits.tier', op: 'eq', value: 'standard' }],
      daysLookback: 30,
    },
    {
      name: 'At Risk',
      rules: [{ field: 'traits.tier', op: 'eq', value: 'standard' }],
      daysLookback: 90,
    },
  ]);

  // Create templates
  const templates = await Template.insertMany([
    { name: 'Summer Beach Getaway', channel: 'email', subject: 'Summer Beach Getaway - Special Offer', body: 'Dear {{name}}, enjoy our summer beach getaway deals!' },
    { name: 'Weekend Flash Sale', channel: 'email', subject: 'Weekend Flash Sale - Limited Time', body: 'Hi {{name}}, don\'t miss our weekend flash sale!' },
    { name: 'Luxury Cruise Promotion', channel: 'email', subject: 'Luxury Cruise - Premium Experience', body: 'Dear {{name}}, experience luxury cruising with us!' },
    { name: 'Family Vacation Package', channel: 'email', subject: 'Family Vacation Package - Perfect for All', body: 'Hello {{name}}, create memories with our family packages!' },
  ]);

  // Create campaigns matching frontend mock data
  const campaigns = await Campaign.insertMany([
    {
      name: 'Summer Beach Getaway',
      channel: 'email',
      segmentId: segments[0]._id, // High Value
      variants: [{ key: 'A', templateId: templates[0]._id, weight: 1.0 }],
      status: 'launched',
    },
    {
      name: 'Weekend Flash Sale',
      channel: 'email',
      segmentId: segments[1]._id, // Frequent Traveler
      variants: [{ key: 'A', templateId: templates[1]._id, weight: 1.0 }],
      status: 'launched',
    },
    {
      name: 'Luxury Cruise Promotion',
      channel: 'email',
      segmentId: segments[0]._id, // High Value
      variants: [{ key: 'A', templateId: templates[2]._id, weight: 1.0 }],
      status: 'launched',
    },
    {
      name: 'Family Vacation Package',
      channel: 'email',
      segmentId: segments[2]._id, // New Customer
      variants: [{ key: 'A', templateId: templates[3]._id, weight: 1.0 }],
      status: 'draft',
    },
  ]);

  // Create deliveries with realistic metrics matching frontend mock data
  const deliveries = [];
  
  // Summer Beach Getaway campaign (2340 sent, 1520 opened, 890 clicked, 145 conversions)
  const summerDeliveries = [];
  for (let i = 0; i < 2340; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const opened = i < 1520 ? 1 : 0;
    const clicked = opened && i < 890 ? 1 : 0;
    const converted = clicked && i < 145 ? 1 : 0;
    
    summerDeliveries.push({
      campaignId: campaigns[0]._id,
      customerId: customer._id,
      variant: 'A',
      status: 'sent',
      events: { open: opened, click: clicked, convert: converted },
    });
  }
  deliveries.push(...summerDeliveries);

  // Weekend Flash Sale campaign (5600 sent, 3200 opened, 1800 clicked, 320 conversions)
  const weekendDeliveries = [];
  for (let i = 0; i < 5600; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const opened = i < 3200 ? 1 : 0;
    const clicked = opened && i < 1800 ? 1 : 0;
    const converted = clicked && i < 320 ? 1 : 0;
    
    weekendDeliveries.push({
      campaignId: campaigns[1]._id,
      customerId: customer._id,
      variant: 'A',
      status: 'sent',
      events: { open: opened, click: clicked, convert: converted },
    });
  }
  deliveries.push(...weekendDeliveries);

  // Luxury Cruise campaign (1200 sent, 840 opened, 420 clicked, 89 conversions)
  const cruiseDeliveries = [];
  for (let i = 0; i < 1200; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const opened = i < 840 ? 1 : 0;
    const clicked = opened && i < 420 ? 1 : 0;
    const converted = clicked && i < 89 ? 1 : 0;
    
    cruiseDeliveries.push({
      campaignId: campaigns[2]._id,
      customerId: customer._id,
      variant: 'A',
      status: 'sent',
      events: { open: opened, click: clicked, convert: converted },
    });
  }
  deliveries.push(...cruiseDeliveries);

  await Delivery.insertMany(deliveries);

  // Close
  await mongoose.connection.close();
  // eslint-disable-next-line no-console
  console.log('Seed complete');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

