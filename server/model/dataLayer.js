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

function getTasksOfPeriod(period, callback){
    var tIds = [];
    period.taskIds.forEach(function(taskId){
        tIds.push(taskId.tid);
    });
    model.TaskModel.find({'_id': {$in: tIds}}, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getTasksOfPeriodForStudent(period, student, callback){
    var doneTasks = [];
    student.doneTasks.forEach(function(sTask){
        period.taskIds.forEach(function(pTask){
           if(sTask.taskId==pTask.tid){
               doneTasks.push(sTask.taskId);
           }
        });
    });
    model.TaskModel.find({'_id': {$in: doneTasks}}, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    })
}

function getPeriodById(perId, callback){
    model.PeriodModel.findById(perId,function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function createNewTask(task, callback) {
    model.TaskModel.create(task, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function updatePeriod(period, callback){
    model.PeriodModel.findByIdAndUpdate(period._id,period,function(err, data){
        if(err){
            return callback(err);
        }
        callback(null, data)
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


function createNewStudent(student, callback) {
    model.StudentModel.create(student, function(err, data){
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
            return callback(err);
        }
        callback(null,data);
    });
}

function getAllStudents(callback){
    model.StudentModel.find(function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getStudentById(studId, callback){
    model.StudentModel.findById(studId, function(err, data){
        if (err) {
            return callback(err);
        }
        callback(null,data);
    });
}

function getStudentsOfPeriod(period, callback){
    var sId = [];
    period.studentIds.forEach(function(studentId){
        sId.push(studentId.sid)
    });
    model.StudentModel.find({'_id':{$in: sId}}, function(err, data){
        callback(null, data);
    })
}

function getPeriodsForStudent(studId, callback){
    model.PeriodModel.find({'studentIds.sid': studId}, function(err, period){
        if(err){
            return callback(err);
        }
        callback(null, period);
    });
}

function getSemesterForPeriod(perId, callback){
    model.SemesterModel.findOne({'periodIds.pid': perId}, function(err, semester) {
        if (err) {
            return callback(err);
        }
        callback(null, semester);
    });
}

function getClassForSemester(semId, callback){
    model.ClassModel.findOne({'semesterIds.sid': semId}, function(err, classs){
        if(err){
            return callback(err);
        }
        callback(null, classs);
    });
}

function getPeriodForTask(taskId, callback){
    model.PeriodModel.findOne({'taskIds.tid': taskId}, function(err, period){
        if(err){
            return callback(err);
        }
        callback(null, period);
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
     createNewClass: createNewClass,
     getTasksOfPeriod: getTasksOfPeriod,
     getPeriodById: getPeriodById,
     createNewTask: createNewTask,
     updatePeriod: updatePeriod,
     getAllStudents: getAllStudents,
     getStudentById: getStudentById,
     getPeriodsForStudent: getPeriodsForStudent,
     getSemesterForPeriod: getSemesterForPeriod,
     getClassForSemester: getClassForSemester,
     getPeriodForTask: getPeriodForTask,
     getTasksOfPeriodForStudent: getTasksOfPeriodForStudent,
     getStudentsOfPeriod: getStudentsOfPeriod,
     createNewStudent: createNewStudent
    // savePeriod: savePeriod
 };