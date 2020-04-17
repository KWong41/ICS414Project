import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField} from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Events, EventSchema } from '/imports/api/event/Event';

const formSchema = new SimpleSchema({
    summary: String,
    start_month: Number,
    start_day: Number,
    start_year: Number,
    end_month: Number,
    end_day: Number,
    end_year: Number,
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
    const { summary, start_month, start_day, start_year, end_month, end_day,
            end_year, access_class, priority, location, resources,
            people } = data;
    const start = new Date(start_year, start_month - 1, start_day);
    const end = new Date(end_year, end_month - 1, end_day);
    const geolocation = this.geo_lat && this.geo_long ? this.geo_lat + ";" + this.geo_long : null;
    const rsvp = people ? people.trim().split(",") : [];

    if (data.start_month < 1 || data.start_month > 12) {
        swal('Error', 'Start month out of range', 'error');
    }

    if (data.start_day < 1 || data.start_day > 31) {

        swal ('Error', 'Start day out of range', 'error');
    }

    if (data.end_month < 1 || data.end_month > 12) {
        swal('Error', 'End month out of range', 'error');
    }

    if (data.end_day < 1 || data.end_day > 31) {
        swal ('Error', 'End day out of range', 'error');
    }

    if (start > end) {
        swal ('Error', 'Start must come before end date', 'error');
    } else {
        const owner = Meteor.user().username;
        const organizer = Meteor.user().username;
        Events.insert({ summary, start, end, access_class, geolocation, priority,
                        location, resources, rsvp, organizer, owner },
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
                <NumField name='start_month'/>
                <NumField name='start_day'/>
                <NumField name='start_year'/>
                <NumField name='end_month'/>
                <NumField name='end_day'/>
                <NumField name='end_year'/>
                <NumField name='priority'/>
                <TextField name='location'/>
                <TextField name='resources'/>
                <TextField name='people'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddAppointment;
