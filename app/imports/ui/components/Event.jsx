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
    let event_start;
    let event_end;
    let event_name;
    if (this.props.event_element) {
        event_start = this.props.event_element.start;
        event_end = this.props.event_element.end;
        event_start = `${event_start.getHours().pad()}:${event_start.getMinutes().pad()}`;
        event_end = `${event_end.getHours().pad()}:${event_end.getMinutes().pad()}`;
        event_name = this.props.event_element.summary;
    } 

    return (
      <App>
        {this.props.event_element ? <ModalWindow start={event_start} end={event_end} name={event_name}/> : null}
      </App>
    );
  }
}

/** Require a document to be passed to this component. */
Event.propTypes = {
  event_element: PropTypes.object,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);
