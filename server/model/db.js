var mongoose = require( 'mongoose' );

/*

 Note:
 To this test project as it is:

 Start your MongoDB database.
 Start mongo.exe and do:
 use testdb
 db.testusers.insert({userName : "Lars", email :"lam@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Henrik", email :"hsty@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Tobias", email :"tog@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Anders", email :"aka@cphbusiness.dk",pw: "test",created : new Date()})

 */
var dbURI;

//This is set by the backend tests
if( typeof global.TEST_DATABASE != "undefined" ) {
    dbURI = global.TEST_DATABASE;
}
else{
    dbURI = 'mongodb://team:team@ds053190.mongolab.com:53190/sem3project';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
    global.mongo_error = "Not Connected to the Database";
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var teacherSchema = mongoose.Schema({
        fName: {type: String, index: true},
        lName: {type: String, index: true},
        email: {type: String},
        username: {type: String, unique: true},
        role: {type: String, required: true},
        classIds: [{cid: {type: String, ref: 'class'}}]},

    { collection: 'teacher' }
);

var classSchema = mongoose.Schema({
        name: { type: String, index: true},
        semesterIds: [{sid: {type: String, ref: 'semester'}}]},

    { collection: 'class' }
);

var semesterSchema = mongoose.Schema({
        name: { type: String, index: true},
        startingDate: {type: Date},
        endingDate: {type: Date},
        periodIds: [{pid: {type: String, ref: 'period'}}]},

    { collection: 'semester' }
);

var periodSchema = mongoose.Schema({
        name: { type: String, index: true},
        maxPoints: {type: Number},
        reqPoints: {type: Number},
        taskIds: [{tid: {type: String}}],
        studentIds: [{sid: {type: String}}]},

    { collection: 'period' }
);

var studentSchema = mongoose.Schema({
        fName: {type: String, index: true},
        lName: {type: String, index: true},
        email: {type: String},
        username: {type: String, unique: true},
        role: {type: String, required: true},
        doneTasks: [{taskId: {type: String}, achievedPoints: {type: Number}}]},

    { collection: 'student' }
);

var taskSchema = mongoose.Schema({
        name: {type: String, index: true},
        description: {type: String},
        maxPoints: {type: Number}},

    { collection: 'task' }
);

exports.TeacherModel = mongoose.model('teacher', teacherSchema, "teacher");
exports.ClassModel = mongoose.model('class', classSchema, "class");
exports.SemesterModel = mongoose.model('semester', semesterSchema, "semester");
exports.PeriodModel = mongoose.model('period', periodSchema, "period");
exports.StudentModel = mongoose.model('student', studentSchema, "student");
exports.TaskModel = mongoose.model('task', taskSchema, "task");