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
            console.log(err);
            return err;
        }
        res.end(JSON.stringify(classs));
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

router.get('/semesters/class/:clsId', function(req,res){
    data.getClassById(req.params.clsId, function(err, cls){
        if(err){
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

router.post('/semester/:name/:startingDate/:endingDate', function(req, res){
    var semester = {
        name: req.params.name,
        startingDate: req.params.startingDate,
        endingDate: req.params.endingDate
    };
    data.createNewSemester(semester, function(err, semester){
        if(err){
            return err;
        }
        res.end(JSON.stringify(semester));
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

module.exports = router;
