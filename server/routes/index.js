var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var data = require('../model/dataLayer');





/* GET home page. */
router.get('/', function(req, res) {
  res.redirect("app/index.html")
});


router.post('/authenticate', function (req, res) {
  //TODO: Go and get UserName Password from "somewhere"
  //if is invalid, return 401
   if (req.body.username === 'student' && req.body.password === 'test') {
    var profile = {
      username: 'Bo the Student',
      role: "user",
      id: 1000
    };
    // We are sending the profile inside the token
    var token = jwt.sign(profile, require("../security/secrets").secretTokenUser, { expiresInMinutes: 60*5 });
    res.json({ token: token });
    return;
  }

  if (req.body.username === 'teacher' && req.body.password === 'test') {
    var profile = {
      username: 'Peter the Teacher',
      role: "admin",
      id: 123423
    };
    // We are sending the profile inside the token
    var token = jwt.sign(profile, require("../security/secrets").secretTokenAdmin, { expiresInMinutes: 60*5 });
    res.json({ token: token });
    return;
  }

  else{
    res.status(401).send('Wrong user or password');
    return;
  }
});


//Get Partials made as Views
router.get('/partials/:partialName', function(req, res) {
  var name = req.params.partialName;
  res.render('partials/' + name);
});

router.get('/teachers', function(req,res) {
    data.getAllTeachers(function(err, teachers){
        if(err){
            return err;
        }
        res.end(JSON.stringify(teachers));
    })
});

router.get('/teachers/:teacherId', function(req,res) {
    data.getTeacherById(req.params.teacherId, function(err, teacher){
        if(err){
            return err;
        }
        res.end(JSON.stringify(teacher));
    })
});

router.get('/classes/teacher/:teacherId', function(req, res){
    data.getTeacherById(req.params.teacherId, function(err, teacher){
        if(err){
            return err;
        }
        data.getClassesForTeacher(teacher, function(err, classes){
            if(err){
                return err;
            }
            res.end(JSON.stringify(classes));
        })
    });
});

router.get('/classes', function(req,res){
    data.getAllClasses(function(err, classes){
        if(err){
            return err;
        }
        res.end(JSON.stringify(classes));
    })
});

router.get('/classes/:classId', function(req,res){
    data.getClassById(req.params.classId, function(err, classs){
        if(err){
            return err;
        }
        res.end(JSON.stringify(classs));
    })
});

//get classes for student
router.get('/classes/student/:studId', function(req, res){
    var classes = [];
    data.getPeriodsForStudent(req.params.studId, function(err, periods){
        if(err){
            return err;
        }
        periods.forEach(function(period){
            data.getSemesterForPeriod(period._id, function(err, semester){
                if(err){
                    return err;
                }
                data.getClassForSemester(semester._id, function(err, cls){
                    if(err){
                        return err;
                    }
                    classes.push(cls);
                    if(periods.length===classes.length)
                    {
                        res.end(JSON.stringify(classes));
                    }
                })
            })
        });
    });
});

//get semesters for student
router.get('/semesters/student/:studId', function(req, res){
    var semesters = [];
    data.getPeriodsForStudent(req.params.studId, function(err, periods){
        if(err){
            return err;
        }
        periods.forEach(function(period){
            data.getSemesterForPeriod(period._id, function(err, semester){
                if(err){
                    return err;
                }
                semesters.push(semester);
                if(periods.length===semesters.length)
                {
                    res.end(JSON.stringify(semesters));
                }
            })
        });
    })
});

//get periods for student
router.get('/periods/student/:studId', function(req, res){
    data.getPeriodsForStudent(req.params.studId, function(err, periods){
        if(err){
            return err;
        }
        res.end(JSON.stringify(periods));
    })
});

//get tasks for student of a specific period
router.get('/tasks/period/student/:perId/:studId', function(req, res){
    data.getStudentById(req.params.studId, function(err, student){
        if(err){
            return err;
        }
        data.getPeriodById(req.params.perId, function(err, period){
            if(err){
                return err;
            }
            data.getTasksOfPeriodForStudent(period, student, function(err, tasks){
                if(err){
                    return err;
                }
                res.end(JSON.stringify(tasks));
            })
        })
    });
});

router.get('/students', function(req,res){
    data.getAllStudents(function(err, students){
        if(err){
            return err;
        }
        res.end(JSON.stringify(students));
    })
});

router.get('/students/:studId', function(req,res){
    data.getStudentById(req.params.studId, function(err, student){
        if(err){
            return err;
        }
        res.end(JSON.stringify(student));
    })
});

router.get('/students/period/:perId', function(req,res){
    data.getPeriodById(req.params.perId, function(err, period){
        if(err){
            return err;
        }
        console.log("heyyya");
        data.getStudentsOfPeriod(period, function(err, students){
            if(err){
                return err;
            }
            res.end(JSON.stringify(students));
        })
    })
});

router.get('/semesters', function(req,res){
    data.getAllSemesters(function(err, semesters){
        if(err){
            return err;
        }
        res.end(JSON.stringify(semesters));
    })
});

router.get('/semesters/:semId', function(req,res){
    data.getSemesterById(req.params.semId, function(err, semester){
        if(err){
            return err;
        }
        res.end(JSON.stringify(semester));
    })
});

router.get('/periods/:perId', function(req,res){
    data.getPeriodById(req.params.perId, function(err, data){
        if(err){
            return err;
        }
        res.end(JSON.stringify(data));
    })
});

router.get('/semesters/class/:clsId', function(req,res){
    data.getClassById(req.params.clsId, function(err, cls){
        if(err){
            console.log(err);
            return err;
        }
        data.getSemestersOfClass(cls, function(err, semesters){
            if(err){
                return err;
            }
            res.end(JSON.stringify(semesters));
        });
    })
});

router.get('/periods/semester/:semId', function(req,res){
    data.getSemesterById(req.params.semId, function(err, semester){
        if(err){
            return err;
        }
        data.getPeriodsOfSemester(semester, function(err, periods){
            if(err){
                return err;
            }
            res.end(JSON.stringify(periods));
        });
    })
});

router.get('/tasks/period/:perId', function(req,res){
    data.getPeriodById(req.params.perId, function(err, period){
        if(err){
            return err;
        }
        data.getTasksOfPeriod(period, function(err, tasks){
            if(err){
                return err;
            }
            res.end(JSON.stringify(tasks));
        });
    })
});

router.post('/class/:name', function(req, res){
    var cls = {
        name: req.params.name
    };
    data.createNewClass(cls, function(err, semester){
        if(err){
            return err;
        }
        res.end(JSON.stringify(cls));
    })
});

router.post('/semester/:clsId/:name/:startingDate/:endingDate', function(req, res){
    var semester = {
        name: req.params.name,
        startingDate: req.params.startingDate,
        endingDate: req.params.endingDate
    };
    data.createNewSemester(semester, function(err, semester){
        if(err){
            return err;
        }
        data.getClassById(req.params.clsId, function(err, cls){
            if(err){
                return err;
            }
            cls.semesterIds.push({sid: semester._id});
            data.updateClass(cls.toJSON(), function(err, updatedClass){
                if(err){
                    return err;
                }
                res.end(JSON.stringify(semester));
            })
        });
    })
});

router.post('/period/:semId/:name/:maxPoints/:reqPoints', function(req, res){
    var period = {
        name: req.params.name,
        maxPoints: req.params.maxPoints,
        reqPoints: req.params.reqPoints
    };
    data.createNewPeriod(period, function(err, period){
        if(err){
            return err;
        }
        data.getSemesterById(req.params.semId, function(err, semester){
            if(err){
                return err;
            }
            semester.periodIds.push({pid: period._id});
            console.log("Period id added to semester: "+semester.periodIds[0].pid+" semester name: "+semester.name +" semester id: "+semester._id);
            data.updateSemester(semester.toJSON(), function(err, updatedSemester){
                if(err){
                    return err;
                }
                res.end(JSON.stringify(period));
            })
        })
    })
});

router.post('/task/:perId/:name/:desc/:maxPoints', function(req, res){
    var task = {
        name: req.params.name,
        description: req.params.desc,
        maxPoints: req.params.maxPoints
    };
    data.createNewTask(task, function(err, task){
        if(err){
            return err;
        }
        data.getPeriodById(req.params.perId, function(err, period){
            if(err){
                return err;
            }
            period.taskIds.push({tid: task._id});
            data.updatePeriod(period.toJSON(), function(err, updatedPeriod){
                if(err){
                    return err;
                }
                res.end(JSON.stringify(task));
            })
        })
    })
});

router.post('/student/:perId/:fName/:lName/:email/:username', function(req,res){
   var student = {
       fName: req.params.fName,
       lName: req.params.lName,
       email: req.params.email,
       username: req.params.username
   };
   data.createNewStudent(student, function(err, student){
       if(err){
           return err;
       }
       data.getPeriodById(req.params.perId, function(err, period){
           if(err){
               return err;
           }
           period.studentIds.push({sid: student._id});
           data.updatePeriod(period.toJSON(), function(err, updatedPeriod){
               if(err){
                   return err;
               }
               res.end(JSON.stringify(student));
           })
       })
   })
});

module.exports = router;
