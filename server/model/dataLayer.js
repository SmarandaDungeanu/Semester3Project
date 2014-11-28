var model = require("../model/db");

function getAllTeachers(callback){
    model.TeacherModel.find({}, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getClassesForTeacher(teacher, callback){
    var cIds = [];
    teacher.classIds.forEach(function(classId){
       cIds.push(classId.cid);
    });
    model.ClassModel.find({'_id': {$in: cIds}}, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });

}

function getClassById(classId, callback){
    model.ClassModel.findById(classId, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getAllClasses(callback){
    model.ClassModel.find(function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getTeacherById(teacherId, callback){
    model.TeacherModel.findById(teacherId, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
}

function getAllSemesters(callback){
    model.SemesterModel.find(function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getSemesterById(semId, callback){
    model.SemesterModel.findById(semId,function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getPeriodsOfSemester(sem, callback){
    var pIds = [];
    sem.periodIds.forEach(function(periodId){
        pIds.push(periodId.pid);
    });
    model.PeriodModel.find({'_id': {$in: pIds}}, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function createNewClass(cls, callback) {
    model.ClassModel.create(cls, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function createNewSemester(semester, callback) {
    model.SemesterModel.create(semester, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function updateClass(cls, callback){
    model.ClassModel.findByIdAndUpdate(cls._id,cls,function(err, data){
        if(err){
            return callback(err);
        }
        callback(null, data)
    });
}

function updateSemester(semester, callback){
    model.SemesterModel.findByIdAndUpdate(semester._id,semester,function(err, data){
        if(err){
            return callback(err);
        }
        callback(null, data)
    });
}

function createNewPeriod(period, callback) {
    model.PeriodModel.create(period, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getSemestersOfClass(cls, callback){
    var sIds = [];
    cls.semesterIds.forEach(function(semesterId){
        sIds.push(semesterId.sid);
    });
    model.SemesterModel.find({'_id': {$in: sIds}}, function(err, data){
        if (err) {
            console.log(err);
            return callback(err);
        }
        callback(null,data);
    });
}

 module.exports = {
     getAllTeachers: getAllTeachers,
     getClassesForTeacher: getClassesForTeacher,
     getTeacherById: getTeacherById,
     getAllClasses: getAllClasses,
     getClassById: getClassById,
     getAllSemesters: getAllSemesters,
     getSemesterById: getSemesterById,
     getPeriodsOfSemester: getPeriodsOfSemester,
   //  saveSemester: saveSemester,
     createNewSemester: createNewSemester,
     updateSemester: updateSemester,
     createNewPeriod: createNewPeriod,
     getSemestersOfClass: getSemestersOfClass,
     updateClass: updateClass,
     createNewClass: createNewClass
    // savePeriod: savePeriod
 };