global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";
global.SKIP_AUTHENTICATION = true;  //Skip security

var should = require("should");
var app = require("../../server/app");
var http = require("http");
var testPort = 9999;
var testServer;
var request = require('request');
var mongoose = require("mongoose");
var teacher = mongoose.model('teacher');
var student = mongoose.model('student');
var classes = mongoose.model('class');
var semester = mongoose.model('semester');
var period = mongoose.model('period');
var task = mongoose.model('task');


describe('REST API for /teacher', function () {
    //Start the Server before the TESTS
    before(function (done) {

        testServer = app.listen(testPort, function () {
            console.log("Server is listening on: " + testPort);
            done();
        })
            .on('error', function (err) {
                console.log(err);
            });
    });

    beforeEach(function (done) {
        teacher.remove({}, function () {
            var array = [{
                fName: "Lars",
                lName: "Mortensen",
                email: "lars@a.dk",
                username: "lars",
                role: "teacher"
            }, {
                fName: "Testing",
                lName: "Teacher",
                email: "what@a.dk",
                username: "test",
                role: "teacher"
            }];
            teacher.create(array, function (err) {
                done();
            });
        });


    });

    after(function () {  //Stop server after the test
        //Uncomment the line below to completely remove the database, leaving the mongoose instance as before the tests
        //db.dropDatabase();
        testServer.close();
    });

    it("Should get 2 teachers", function (done) {
        http.get("http://localhost:" + testPort + "/teachers", function (res) {
            res.setEncoding("utf8");//response data is now a string
            res.on("data", function (chunk) {
                var n = JSON.parse(chunk);
                n.length.should.equal(2);
                n[0].username.should.equal("lars");
                n[1].username.should.equal("test");
                done();
            });
        })
    });

    it("Should get teacher by username", function (done) {
        http.get("http://localhost:" + testPort + "/teachers/username/lars", function (res) {
            res.setEncoding("utf8");//response data is now a string
            res.on("data", function (chunk) {
                var n = JSON.parse(chunk);
                n.username.should.equal("lars");
                done();
            });
        })
    });

    it("Should create teacher ", function (done) {
        request({
                method: 'POST',
                url: "http://localhost:" + testPort + "/teacher/first/last/email@g.dk/username/pass",
                headers: {'Content-Type': 'application/json'}
            },
            function (error, response, body) {
                response.statusCode.should.equal(200);
                var n = JSON.parse(body);
                n.username.should.equal('username');
                done();
            })
    });
});


describe('REST API for /student', function () {
    //Start the Server before the TESTS
    before(function (done) {

        testServer = app.listen(testPort, function () {
            console.log("Server is listening on: " + testPort);
            done();
        })
            .on('error', function (err) {
                console.log(err);
            });
    });

    beforeEach(function (done) {
        student.remove({}, function () {
            var array = [{
                fName: "First",
                lName: "Student",
                email: "lala@a.dk",
                username: "student",
                role: "student"
            }, {
                fName: "Testing",
                lName: "Student",
                email: "what@a.dk",
                username: "test",
                role: "student"
            }];
            student.create(array, function (err) {
                done();
            });
        });


    });

    after(function () {  //Stop server after the test
        //Uncomment the line below to completely remove the database, leaving the mongoose instance as before the tests
        //db.dropDatabase();
        testServer.close();
    });

    it("Should get 2 students", function (done) {
        http.get("http://localhost:" + testPort + "/students", function (res) {
            res.setEncoding("utf8");//response data is now a string
            res.on("data", function (chunk) {
                var n = JSON.parse(chunk);
                n.length.should.equal(2);
                n[0].username.should.equal("student");
                n[1].username.should.equal("test");
                done();
            });
        });
    });

    it("Should get student by username", function (done) {
        http.get("http://localhost:" + testPort + "/students/username/student", function (res) {
            res.setEncoding("utf8");//response data is now a string
            res.on("data", function (chunk) {
                var n = JSON.parse(chunk);
                n.username.should.equal("student");
                done();
            });
        })
    });
});


describe('REST API for /class', function () {
    //Start the Server before the TESTS
    before(function (done) {

        testServer = app.listen(testPort, function () {
            console.log("Server is listening on: " + testPort);
            done();
        })
            .on('error', function (err) {
                console.log(err);
            });
    });

    beforeEach(function (done) {
        classes.remove({}, function () {
            var array = [{name: "First"}, {name: "Second"}, {name: "Testing"}];
            classes.create(array, function (err) {
                done();
            });
        });


    });

    after(function () {  //Stop server after the test
        //Uncomment the line below to completely remove the database, leaving the mongoose instance as before the tests
        //db.dropDatabase();
        testServer.close();
    });

    it("Should get 3 classes", function (done) {
        http.get("http://localhost:" + testPort + "/classes", function (res) {
            res.setEncoding("utf8");//response data is now a string
            res.on("data", function (chunk) {
                var n = JSON.parse(chunk);
                n.length.should.equal(3);
                n[0].name.should.equal("First");
                n[1].name.should.equal("Second");
                n[2].name.should.equal("Testing");
                done();
            });
        })
    });

    it("Should get class by ID", function (done) {
        http.get("http://localhost:" + testPort + "/classes", function (res) {
            res.setEncoding("utf8");//response data is now a string
            res.on("data", function (chunk) {
                var n = JSON.parse(chunk);
                var id = n[0]._id;
                http.get("http://localhost:" + testPort + "/classes/" + id, function (res) {
                    res.setEncoding("utf8");//response data is now a string
                    res.on("data", function (chunk) {
                        var n = JSON.parse(chunk);
                        n.name.should.equal('First');
                        done();
                    });
                })
            });
        })
    });
});