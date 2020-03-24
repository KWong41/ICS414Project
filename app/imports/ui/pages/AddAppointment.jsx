import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField} from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { format } from 'date-fns';
import { Events, EventSchema } from '/imports/api/event/Event';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';


const formSchema = new SimpleSchema({
    summary: String,
    start_month: Number,
    start_day: Number,
    start_year: Number,
    end_month: Number,
    end_day: Number,
    end_year: Number,
    access_class: {
        type: String,
        allowedValues: ['PUBLIC', 'PRIVATE', 'CONFIDENTIAL'],
        defaultValue: 'PUBLIC',
    },
});

/** Renders the Page for adding a document. */
/** Test Cases **/
/**
 * Case 1: Start Month = 20
 *         Start Day   = 12
 *         Start Year  = 2020
 *
 * Result 1: Error, start month out of range
 *
 * Case 2: Start Month = -3
 *         Start Day   = 12
 *         Start Year  = 2020
 *
 * Result 2: Error, start month out of range
 *
 * Case 3: Start Month = 3
 *         Start Day   = -12
 *         Start Year  = 2020
 *
 * Result 3: Error, start day out of range
 *
 * Case 4: Start Month = 3
 *         Start Day   = 32 
 *         Start Year  = 2020
 *
 * Result 4: Error, start day out of range
 *
 * Case 5: Start Month = 3
 *         Start Day   = 12
 *         Start Year  = 2020
 *         
 *         End Month   = 4
 *         End Day     = 22
 *         End Year    = 1980
 *
 * Result 5: Error, start date must come before end date
 *
 * Case 6: Start Month = 3
 *         Start Day   = 12
 *         Start Year  = 2020
 *         
 *         End Month   = 4
 *         End Day     = 22
 *         End Year    = 2020 
 *
 * Result 6: Success
*/
class AddAppointment extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { summary, start_month, start_day, start_year, end_month, end_day, end_year, access_class } = data;
    const start = format(new Date(start_year, start_month - 1, start_day), "yyyyMMdd'T'HHmmss'Z'");
    const end = format(new Date(end_year, end_month - 1, end_day), "yyyyMMdd'T'HHmmss'Z'");
    if (start_month < 1 || start_month > 12) {
        swal('Error', 'Start month out of range', 'error');
    } else if (start_day < 1 || start_day > 31) {
        swal ('Error', 'Start day out of range', 'error');
    } else if (end_month < 1 || end_month > 12) {
        swal('Error', 'End month out of range', 'error');
    } else if (end_day < 1 || end_day > 31) {
        swal ('Error', 'End day out of range', 'error');
    } else if (start > end) {
        swal ('Error', 'Start must come before end date', 'error');
    } else {
        const owner = Meteor.user().username;
        Events.insert({ summary, start, end, access_class, owner },
          (error) => {
            if (error) {
              swal('Error', error.message, 'error');
            } else {
              swal('Success', 'Item added successfully', 'success');
              console.log(this.props);
              formRef.reset();
            }
          });
        }
    }

  render() {
      return (this.props.ready) ? this.renderPage() : <Loader active> Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    let fRef = null;
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
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

AddAppointment.propTypes = {
    events: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
    const events_subscription = Meteor.subscribe('Events');
    return {
        events: Events.find({}).fetch(),
        ready: events_subscription.ready(),
    };
})(AddAppointment);
