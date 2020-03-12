import React from 'react'
import { Button, Header, Modal, List, Label } from 'semantic-ui-react'

const ModalWindow = () => (
    <Modal trigger={<Button>Details</Button>}>
      <Modal.Header>Appointment Details</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Details of Appointments</Header>
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
        </Modal.Description>
      </Modal.Content>
    </Modal>

)

export default ModalWindow
