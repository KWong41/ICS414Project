import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Events = new Mongo.Collection('Events');

/** Define a schema to specify the structure of each document in the collection. */
const EventSchema = new SimpleSchema({
  owner: String,
  summary: String,
  start: String,
  end: String,
  geolocation: {
      type: String,
      optional: true,
  },
  priority: {
      type: Number,
      defaultValue: 0,
  },
  location: {
      type: String,
      optional: true,
  },
  access_class: {
    type: String,
    allowedValues: ['PUBLIC', 'PRIVATE', 'CONFIDENTIAL'],
    defaultValue: 'PUBLIC',
  },
  resources: {
      type: String,
      optional: true,
  },
  rsvp : [String] 
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Events.attachSchema(EventSchema);

/** Make the collection and schema available to other code. */
export { Events, EventSchema };
