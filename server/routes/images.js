var express = require('express');
var router = express.Router();
var formidable = require('formidable'),
util = require('util'),
fs   = require('fs-extra');
path = require('path');


router.post('/:userId', function(req, res) {
    var userId = req.params.userId;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
//        it just needs a redirect somewhere...
        res.redirect('/#/view2/' + userId);
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //res.end(util.inspect({fields: fields, files: files}));
    });

//    shitty thing to work on some more, to make the check about the file to be uploaded
//    form.on('start')

    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });

    form.on('error', function(err) {
        console.error(err);
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;

        /* The file name of the uploaded file */
//        var file_name = this.openedFiles[0].name;
//        console.log('Check dis out: ' + path.extname(this.openedFiles[0].name));

        var file_name = 'avatar' + path.extname(this.openedFiles[0].name);

        /* Location where we want to copy the uploaded file */
        var new_location = 'public/users/' + userId + '/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });
});

module.exports = router;
