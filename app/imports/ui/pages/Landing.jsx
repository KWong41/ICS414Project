import React from "react";
import dateFns from "date-fns";
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import Event from "../components/Event";
import PropTypes from 'prop-types';
import ModalWindow from "../components/ModalWindow";
import { Events, EventSchema } from '/imports/api/event/Event';
import { withTracker } from 'meteor/react-meteor-data';

class Landing extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
        <div className="header row flex-middle">
          <div className="col col-start">
            <div className="icon" onClick={this.prevMonth}>
              chevron_left
            </div>
          </div>
          <div className="col col-center">
            <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
          </div>
          <div className="col col-end" onClick={this.nextMonth}>
            <div className="icon">chevron_right</div>
          </div>
        </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
          <div className="col col-center" key={i}>
            {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    /* Allows program to search through events by date */
    let events_date = [];
    for (const event_element of this.props.events) {
        const event_month = String(event_element.start.getMonth());
        const event_year = String(event_element.start.getYear());
        const event_day = String(event_element.start.getDate());
        events_date.push(`${event_month}-${event_day}-${event_year}`); 
    }

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        const event_month = String(day.getMonth());
        const event_year = String(day.getYear());
        const event_day = String(day.getDate());
        let index_of_events = this.getAllIndexes(events_date,`${event_month}-${event_day}-${event_year}`);
        let events = [];
        for (const i of index_of_events) {
            events.push(this.props.events[i]);
        }

        days.push(
            <div
                className={`col cell ${
                    !dateFns.isSameMonth(day, monthStart)
                        ? "disabled"
                        : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                }`}
                key={day}
                onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
            >
              <span className="number">{formattedDate}</span>
              <span className="bg">{formattedDate}</span>
              <Event events={events}/> 
            </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
          <div className="row" key={day}>
            {days}
          </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
        <div className="calendar">
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
    );
  }

  getAllIndexes(array, val) {
      var indexes = [], i;
      for (i = 0; i < array.length; i++) {
          if (array[i] == val) indexes.push(i);
      }
      return indexes;
  }
}



export default withTracker(() => {
    const events_subscription = Meteor.subscribe('Events');
    return {
        events: Events.find({}).fetch(),
        ready: events_subscription.ready(),
    };
})(Landing);
