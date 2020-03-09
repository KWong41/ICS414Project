import React from 'react';
import { Stuffs } from '/imports/api/stuff/Stuff';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  AddTitle: String,
  people: Number,
  dates: String,
  importance: {
    type: String,
    allowedValues: ['critical', 'important', 'average', 'routine'],
    defaultValue: 'good',
  },
  description: String,
});

/** Renders the Page for adding a document. */
class AddAppointment extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { AddTitle, people, importance, description, dates } = data;
    const owner = Meteor.user().username;
    Stuffs.insert({ AddTitle, people, importance, description, dates, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Create Appointment</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='AddTitle'/>
                <NumField name='people' decimal={false}/>
                <TextField name='dates'/>
                <SelectField name='importance'/>
                <TextField name='description'/>
                <SubmitField value='Submit'/>
                <SubmitField value='upload'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddAppointment;
