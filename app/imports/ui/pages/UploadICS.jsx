import React from 'react';
import { Loader } from 'semantic-ui-react';
import { Events, EventSchema } from '/imports/api/event/Event';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

class UploadICS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            ignore: ["BEGIN:VCALENDAR", "END:VCALENDAR"],
            events: []
        }
    }

    onChange(e) {
        let files = e.target.files;
        let reader = new FileReader();
        let result;
        reader.readAsDataURL(files[0]);

        reader.onload = (e) => {
            this.setState({file: atob(e.target.result.substr(26))});
            this.process_ics_file(this.state.file);
        }
    }

    process_ics_file(information) {
        let result = [];
        let temp_event;
        const owner = Meteor.user().username;
        information = information.split("\n");
        for (var event_string of information) {
            if (event_string == "BEGIN:VEVENT") {
                temp_event = {};
            } else if (event_string.substr(0, 8) == "SUMMARY:") {
                temp_event.summary = event_string.substr(8);
            } else if (event_string.substr(0, 8) == "DTSTART:") {
                temp_event.start = event_string.substr(8);
            } else if (event_string.substr(0, 6) == "DTEND:") {
                temp_event.end = event_string.substr(6);
            } else if (event_string.substr(0, 6) == "CLASS:") {
                temp_event.access_class = event_string.substr(6);
            } else if (event_string.substr(0, 4) == "GEO:") {
                temp_event.geolocation = event_string.substr(4);
            } else if (event_string.substr(0, 9) == "PRIORITY:") {
                temp_event.priority = parseInt(event_string.substr(9));
            } else if (event_string.substr(0, 9) == "LOCATION:") {
                temp_event.location = event_string.substr(9);
            } else if (event_string == "END:VEVENT") {
                result.push(temp_event);
            } else if (event_string.substr(0, 8) == "VERSION:") {
                continue;
            } else if (this.state.ignore.includes(event_string)) {
                continue;
            } else {
                console.log(event_string);
                console.warn("Error, incorrect event format");
                break;
            }
        }
        
        for (var my_event of result) {
            console.log(my_event);
            Events.insert({"summary" : my_event.summary, "start" : my_event.start,
                           "end" : my_event.end,
                           "access_class" : my_event.access_class,
                           "geolocation": my_event.geolocation ? my_event.geolocation : "null",
                           "priority" : my_event.priority,
                           "location" : my_event.location,
                           "owner" : owner});
        }
    }

    render() {
        return (this.props.ready) ? this.renderPage() : 
            <Loader active>Getting data</Loader>;
    }

    renderPage() {
        return (
            <div onSubmit={this.onFormSubmit}>
                <h1>React js File Upload Tutorial</h1>
                <input type="file" name="file" onChange = {(e) => this.onChange(e)}/>
            </div>
        )
    }

}

UploadICS.propTypes = {
    events: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired,
}

export default withTracker(() => {
    const events_subscription = Meteor.subscribe('Events');
    return {
        events: Events.find({}).fetch(),
        ready: events_subscription.ready(),
    };
})(UploadICS);
