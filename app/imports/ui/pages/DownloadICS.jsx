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
        for (let my_event of this.props.events) {
            result += "BEGIN:VEVENT\n";
            result += my_event.summary ? ("SUMMARY:" + my_event.summary + "\n") : "";
            result += my_event.start ? ("DSTART:" + my_event.start + "\n") : "";
            result += my_event.end ? ("DTEND:" + my_event.end + "\n") : "";
            result += my_event.access_class ? ("CLASS:" + my_event.access_class + "\n") : "";
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
                <Button onClick={this.download}>Click Me!</Button>
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
