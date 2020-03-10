class ICS_Generator {
    constructor() {
        this.fs = require('fs');
        this.version = 2.0;
        this.ignore = ["BEGIN:VCALENDAR", "END:VCALENDAR"];
    }

    generate_ics_file(events) {
        this.fs.writeFile('event.ics', this.generate_ics_file_content(events), function(err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    generate_ics_file_content(events) {
        let result = "BEGIN:VCALENDAR\n";
        result += "VERSION:" + this.version.toFixed(1).toString() + "\n";
        result += this.process_events(events);
        result += "END:VCALENDAR"
        return result
    }

    process_events(events){
        let result = "";
        for (var event_element of events) {
            result += "BEGIN:VEVENT\n";
            result += event_element.summary ? ("SUMMARY:" + event_element.summary + "\n") : "";
            result += event_element.start ? ("DTSTART:" + event_element.start + "\n") : "";
            result += event_element.end ? ("DTEND:" + event_element.end + "\n") : "";
            result += event_element.access_class ? ("CLASS:" + event_element.access_class + "\n") : "";
            result += "END:VEVENT\n";
        }
        return result;
    }

    process_ics_file(information) {
        let result = [];
        let temp_event;
        information = information.split("\n");
        for (var event_string of information) {
            if (event_string == "BEGIN:VEVENT") {
                temp_event = new Event();
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
            } else if (this.ignore.includes(event_string)) {
                continue;
            } else {
                console.log(event_string);
                console.warn("Error, incorrect event format");
                break;
            }
        }
        return result;
    }
}

class Event {
    constructor(event_summary = null, event_start = null, event_end = null, event_class = "PUBLIC") {
        this.summary = event_summary; //Event Name
        this.start = event_start; // Event Start Time
        this.end = event_end; // Event End Time
        this.access_class = event_class; // Event Access Classification (PUBLIC, PRIVATE, CONFIDENTIAL)
    }
}

let test = new ICS_Generator();
console.log(test.process_ics_file(check));
