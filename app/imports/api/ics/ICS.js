import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

const ICS = new FilesCollection({
    debug: true,
    collectionName: 'ICS',
    allowClientCode: false,
    onBeforeUpload: function (file) {
        if (file.size <= 1024 * 1024 * 10 && /ics/i.test(file.extension)) {
            return true;
        }
        return 'Please uplaod image, with size equal or less than 10MB';
    }
});

if (Meteor.isServer) {
    ICS.denyClient();
    Meteor.publish('files.images.all', function () {
        return ICS.find().cursor;
    });
} else {
    Meteor.subscribe('files.images.all');
}

export default ICS;
