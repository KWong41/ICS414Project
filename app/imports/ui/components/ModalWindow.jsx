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
                <List.Item>
                  <Label color='blue' horizontal>
                    {this.props.start}  -  {this.props.end}
                  </Label>
                    {this.props.name}
                </List.Item>
              </List>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      );
  }
}

ModalWindow.propTypes = {
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default withRouter(ModalWindow);
