import React from 'react'
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Button, Header, Modal, List, Label } from 'semantic-ui-react'

class ModalWindow extends React.Component {
  render() {
      return (
        <Modal trigger={<Button>Details</Button>}>
          <Modal.Header>Appointment Details</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>Details of Appointment</Header>
              <List selection>
                {this.props.event_info_array.map((event_element, index) =>
                    <List.Item>
                        <Label color='blue' horizontal>
                            {event_element[0]} - {event_element[1]}
                        </Label>
                        {event_element[2]}
                    </List.Item>)}
              </List>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      );
  }
}

ModalWindow.propTypes = {
    event_info_array: PropTypes.array.isRequired,
};

export default withRouter(ModalWindow);
