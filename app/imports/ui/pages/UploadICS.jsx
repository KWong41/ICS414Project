import React from 'react';
class ICS_Event {
    constructor(event_summary = null, event_start = null, event_end = null, event_class = "PUBLIC") {
        this.summary = event_summary; //Event Name
        this.start = event_start; // Event Start Time
        this.end = event_end; // Event End Time
        this.access_class = event_class; // Event Access Classification (PUBLIC, PRIVATE, CONFIDENTIAL)
    }
}

class UploadICS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            ignore: ["BEGIN:VCALENDAR", "END:VCALENDAR"],
            events: []
        }
    }

    onChange(e) {
        let files = e.target.files;
        let reader = new FileReader();
        let result;
        reader.readAsDataURL(files[0]);

        reader.onload = (e) => {
            this.setState({file: atob(e.target.result.substr(26))});
            this.process_ics_file(this.state.file);
        }
    }

    process_ics_file(information) {
        let result = [];
        let temp_event;
        information = information.split("\n");
        for (var event_string of information) {
            if (event_string == "BEGIN:VEVENT") {
                temp_event = new ICS_Event();
            } else if (event_string.substr(0, 8) == "SUMMARY:") {
                temp_event.summary = event_string.substr(8);
            } else if (event_string.substr(0, 8) == "DTSTART:") {
                temp_event.start = event_string.substr(8);
            } else if (event_string.substr(0, 6) == "DTEND:") {
                temp_event.end = event_string.substr(6);
            } else if (event_string.substr(0, 6) == "CLASS:") {
                temp_event.access_class = event_string.substr(6);
            } else if (event_string == "END:VEVENT") {
                result.push(temp_event);
            } else if (event_string.substr(0, 8) == "VERSION:") {
                continue;
            } else if (this.state.ignore.includes(event_string)) {
                continue;
            } else {
                console.log(event_string);
                console.warn("Error, incorrect event format");
                break;
            }
        }
        console.log(result);
        this.setState({events: result});
    }
    
    render() {
        return (
            <div onSubmit={this.onFormSubmit}>
                <h1>React js File Upload Tutorial</h1>
                <input type="file" name="file" onChange = {(e) => this.onChange(e)}/>
            </div>
        )
   }
}

export default UploadICS;
