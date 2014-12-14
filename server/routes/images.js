var express = require('express');
var router = express.Router();
var formidable = require('formidable'),
util = require('util'),
fs   = require('fs-extra');
path = require('path');


router.post('/:userId', function(req, res) {
    var userId = req.params.userId;
    var new_location = 'public/users/' + userId + '/';
    var form = new formidable.IncomingForm();

//    so it works to check the file type at the beginning of the download:
//    form.on('fileBegin', function(name, file) {
//        if (file.type.match(/image/g)) {
//            console.log(file.type + " => " + file.type.match(/image/g));
//        }
//    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });

    form.on('error', function(err) {
        console.error(err);
    });

    form.on('end', function() {
        this.openedFiles.forEach(function(fileToUpload) {
            if(path.extname(fileToUpload.name).match(/\.(jpg)$/)) {
//                alternative for fileToUpload.name:   'avatar' + path.extname(this.openedFiles[0].name)
                fs.copy(fileToUpload.path, new_location + 'avatar.jpg', function (err) {
                    if (err) {
                        console.error("error saving " + fileToUpload.name + ": " + err);
                    } else {
                        console.log(fileToUpload.name + " saved successfully!")
                    }
                });
            }
        });
    });

    form.parse(req, function(err, fields, files) {
//        it just needs a redirect somewhere...
        res.redirect('/#/view2/' + userId);

//        or
//        res.writeHead(200, {'content-type': 'text/plain'});
//        res.write('received upload:\n\n');
//        res.end(util.inspect({fields: fields, files: files}));
    });
});

module.exports = router;
