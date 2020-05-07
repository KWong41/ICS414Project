import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, RadioField, TextField} from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Events, EventSchema } from '/imports/api/event/Event';
import { withTracker } from 'meteor/react-meteor-data';

const formSchema = new SimpleSchema({
    summary: String,
    start_time: String,
    end_time: String,
    frequency: {
        type: String,
        allowedValues: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        optional: true,
        defaultValue: null,
    },
    repeat_occurences: {
        type: Number,
        optional: true,
        defaultValue: null,
    },
    location: {
        type: String,
        optional: true,
    },
    priority: {
        type: Number,
        defaultValue: 0,
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
    people: {
        type: String,
        optional: true,
    },
});

class AddAppointment extends React.Component {

  geo_lat = null;
  geo_long = null;

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { summary, start_time, end_time, access_class,
            priority, location, resources, people,
            frequency, repeat_occurences} = data;

    let decode_start_time = start_time.split(":");
    decode_start_time[0] = parseInt(decode_start_time[0]);
    decode_start_time[1] = parseInt(decode_start_time[1]);

    let decode_end_time = end_time.split(":");
    decode_end_time[0] = parseInt(decode_end_time[0]);
    decode_end_time[1] = parseInt(decode_end_time[1]);

    const event_month = this.props.day.substring(0, 2);
    const event_day = this.props.day.substring(3, 5);
    const event_year = this.props.day.substring(6);

    let start = new Date(event_year, event_month - 1, event_day, decode_start_time[0], decode_start_time[1]);
    let end = new Date(event_year, event_month - 1, event_day, decode_end_time[0], decode_end_time[1]);
    const geolocation = this.geo_lat && this.geo_long ? this.geo_lat + ";" + this.geo_long : null;
    const rsvp = people ? people.trim().split(",") : [];

    if (!(/^\d{2}:\d{2}$/.test(start_time))) {
        swal ('Error', 'Start time must be in 24-hour time hh:mm format, such as 09:00', 'error');
    } else if (decode_start_time[0] < 0 || decode_start_time[0] > 24) {
        swal ('Error', 'Start time must be in 24-hour time hh:mm format, such as 15:00', 'error');
    } else if (decode_start_time[1] < 0 || decode_start_time[1] > 59) {
        swal ('Error', 'Start time must be in 24-hour time hh:mm format, such as 15:00', 'error');
    } else if (!(/^\d{2}:\d{2}$/.test(end_time))) {
        swal ('Error', 'End time must be in 24-hour time hh:mm format, such as 09:00', 'error');
    } else if (decode_end_time[0] < 0 || decode_end_time[0] > 24) {
        swal ('Error', 'End time must be in 24-hour time hh:mm format, such as 15:00', 'error');
    } else if (decode_end_time[1] < 0 || decode_end_time[1] > 59) {
        swal ('Error', 'End time must be in 24-hour time hh:mm format, such as 15:00', 'error');
    } else if (start > end) {
        swal ('Error', 'Start must come before end date', 'error');
    } else if (frequency == null && repeat_occurences != null) {
        swal ('Error', 'Please select a frequency', 'error');
    } else if (frequency != null && repeat_occurences == null) {
        swal ('Error', 'Please add a number of times the event repeats', 'error');
    } else {
        const owner = Meteor.user().username;
        const organizer = Meteor.user().username;
        let events = [];
        if (repeat_occurences && frequency == "DAILY") {
            for (let i = 0; i < repeat_occurences; i++) {
                start = new Date(event_year, event_month - 1, event_day + i, decode_start_time[0], decode_start_time[1]);
                end = new Date(event_year, event_month - 1, event_day + i, decode_end_time[0], decode_end_time[1]); 
                events.push({summary, start, end, access_class, geolocation, priority,
                             location, resources, rsvp, organizer, owner});
            }
        } else if (repeat_occurences && frequency == "WEEKLY") {
            for (let i = 0; i < repeat_occurences; i++) {
                start = new Date(event_year, event_month - 1, event_day + (7 * i), decode_start_time[0], decode_start_time[1]);
                end = new Date(event_year, event_month - 1, event_day + (7 * i), decode_end_time[0], decode_end_time[1]); 
                events.push({summary, start, end, access_class, geolcation, priority,
                             location, resources, rsvp, organizer, owner});
            }
        } else if (repeat_occurences && frequency == "MONTHLY") {
            for (let i = 0; i < repeat_occurences; i++) {
                start = new Date(event_year, event_month - 1 + i, event_day, decode_start_time[0], decode_start_time[1]);
                end = new Date(event_year, event_month - 1 + i, event_day, decode_end_time[0], decode_end_time[1]); 
                events.push({summary, start, end, access_class, geolcation, priority,
                             location, resources, rsvp, organizer, owner});
            }
        } else if (repeat_occurences && frequency == "YEARLY") {
            for (let i = 0; i < repeat_occurences; i++) {
                start = new Date(event_year + i, event_month - 1, event_day, decode_start_time[0], decode_start_time[1]);
                end = new Date(event_year + i, event_month - 1, event_day, decode_end_time[0], decode_end_time[1]);
                events.push({summary, start, end, access_class, geolcation, priority,
                             location, resources, rsvp, organizer, owner});
            }
        } else {
            events.push({summary, start, end, access_class, geolocation, priority,
                         location, resources, rsvp, organizer, owner});
        }

        if (repeat_occurences) {
            for (let i = 0; i < repeat_occurences; i++) {
                console.log(events[i]);
                Events.insert(events[i],
                  (error) => {
                    if (error) {
                      swal('Error', error.message, 'error');
                    } else {
                      swal('Success', 'Item added successfully', 'success');
                      formRef.reset();
                    }
                  });
                }
        } else {
           Events.insert(events[0],
                  (error) => {
                    if (error) {
                      swal('Error', error.message, 'error');
                    } else {
                      swal('Success', 'Item added successfully', 'success');
                      formRef.reset();
                    }
                  });
                }
        }
    }

  render() {
      return this.renderPage();
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    let fRef = null;
    const geolocation_finder = require('geolocation');
    geolocation_finder.getCurrentPosition((err, position) => {
        if (err) throw err;
        this.geo_lat = position.coords.latitude;
        this.geo_long = position.coords.longitude;
    });
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Create Appointment</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='summary'/>
                <TextField name='start_time'/>
                <TextField name='end_time'/>
                <NumField name='priority'/>
                <TextField name='location'/>
                <TextField name='resources'/>
                <TextField name='people'/>
                <RadioField name='frequency'/>
                <NumField name='repeat_occurences'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default withTracker(({ match }) => {
    return {
        day: match.params.day,
    };
})(AddAppointment);
