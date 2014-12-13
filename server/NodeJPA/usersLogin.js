var request = require('request');
var http = require('http');
var JPA_host = 'http://cnlearning.cloudapp.net:8090/users';


function addUser(username, password, userType, callback) {
    request({headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'username': username,
        'password': password,
        'userType': userType
    },
        uri: JPA_host,
        method: 'POST'
    }, function (error, res, body) {
        if (error) callback(error);
        else callback(null, body);
    });
}

function checkLogin(username, password, callback) {
    request({headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'username': username,
        'password': password
    },
        uri: JPA_host,
        method: 'GET'
    }, function (error, res, body) {
        if (error) callback(error);
        else callback(null, body);
    });
}


module.exports.addUser = addUser;
module.exports.checkLogin = checkLogin;