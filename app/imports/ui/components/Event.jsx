import React from 'react';
import { List, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import Modal from "../components/Modal";

const App = ({ children }) => (

    <Container style={{ margin: 10 }}>
      {children}
    </Container>
);

/** Renders a single row in the List Stuff table. See pages/Calendar.jsx. */
class Event extends React.Component {
  render() {
    return (
      <App>
        <Modal/>
      </App>
    );
  }
}

/** Require a document to be passed to this component. */
Event.propTypes = {
  event: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);
