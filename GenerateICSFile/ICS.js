class ICS_Generator {
    constructor() {
        this.fs = require('fs');
        this.version = 2.0;
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
let event_1 = new Event("Event One", "20200221T043000Z", "20200221T073000Z");
let event_2 = new Event("Event Two", "20200221T033000Z", "20200221T051500Z");
let x = [event_1, event_2];
test.generate_ics_file(x);
