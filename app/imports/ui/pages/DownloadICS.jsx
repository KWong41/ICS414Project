import React from 'react';
import { Loader, Button } from 'semantic-ui-react';
import { Events, EventSchema } from '/imports/api/event/Event';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

class DownloadICS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            ignore: ["BEGIN:VCALENDAR", "END:VCALENDAR"],
        }
    }

    download() {
        let fileDownload = require('react-file-download');
        let result = "BEGIN:VCALENDAR\n";
        result += "VERSION:2.0\n";
        result += "START:VTIMEZONE\n"
        result += "TZID:"
        result += /\((.*)\)/.exec(new Date().toString())[1] + "\n";
        result += "END:VTIMEZONE\n"

        for (let my_event of this.props.events) {
            console.log(my_event);
            result += "BEGIN:VEVENT\n";
            result += "SUMMARY:" + my_event.summary + "\n";
            result += "DTSTART:" + my_event.start + "\n";
            result += "DTEND:" + my_event.end + "\n";
            result += "CLASS:" + my_event.access_class + "\n";
            result += my_event.geolocation ?
                      ("GEO:" + my_event.geolocation + "\n") : "";
            result += "PRIORITY:" + my_event.priority + "\n"; 
            result += my_event.location ?
                      "LOCATION:" + my_event.location + "\n" : "";
            result += my_event.resources ? 
                      "RESOURCES:" + my_event.resources + "\n" : "";
            result += "ATTENDEE;RSVP=";
            result += my_event.rsvp.length ?
                      "TRUE:mailto:" + my_event.rsvp + "\n" : "FALSE\n"
                      
            result += "END:VEVENT\n";
        }
        result += "END:VCALENDAR";
        fileDownload(result, 'events.ics');
    }

    render() {
        return (this.props.ready) ? this.renderPage() : 
            <Loader active>Getting data</Loader>;
    }

    renderPage() {
        return (
            <div onSubmit={this.onFormSubmit}>
                <h1>React js File Upload Tutorial</h1>
                <Button onClick={() => this.download(this)}>Click Me!</Button>
            </div>
        )
    }

}

DownloadICS.propTypes = {
    events: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired,
}

export default withTracker(() => {
    const events_subscription = Meteor.subscribe('Events');
    return {
        events: Events.find({}).fetch(),
        ready: events_subscription.ready(),
    };
})(DownloadICS);
