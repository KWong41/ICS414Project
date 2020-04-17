import React from 'react';
import { List, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import ModalWindow from "../components/ModalWindow";

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

const App = ({ children }) => (

    <Container style={{ margin: 10 }}>
      {children}
    </Container>
);

/** Renders a single row in the List Stuff table. See pages/Calendar.jsx. */
class Event extends React.Component {
  render() {
    let events = [];
    let event_start;
    let event_end;
    let event_name;
    for (const event_element of this.props.events) {
        event_start = event_element.start;
        event_end = event_element.end;
        event_start = `${event_start.getHours().pad()}:${event_start.getMinutes().pad()}`;
        event_end = `${event_end.getHours().pad()}:${event_end.getMinutes().pad()}`;
        event_name = event_element.summary;
        events.push([event_start, event_end, event_name]);
    }

    return (
      <App>
        {events.length ? <ModalWindow event_info_array={events}/> : null}
      </App>
    );
  }
}

/** Require a document to be passed to this component. */
Event.propTypes = {
  events: PropTypes.array,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);
