import React from 'react';
import { List, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/Calendar.jsx. */
class Event extends React.Component {
  render() {
    return (
      <List selection>
        <List.Item>
          <Label color='blue' horizontal>
            1:00-3:00
            {/*{this.props.event.startTime}-{this.props.event.endTime}*/}
          </Label>
            Event Name
            {/*{this.props.event.name}*/}
        </List.Item>
      </List>
    );
  }
}

/** Require a document to be passed to this component. */
Event.propTypes = {
  event: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);
