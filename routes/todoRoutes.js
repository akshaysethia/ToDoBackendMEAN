const router = require('express').Router();
const passport = require('passport');
const moment = require('moment');
const User = require('../models/users');

router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
    var user = new User(req.user);
    if (user) {
        res.json({ success: true, tasks: req.user.tasks, message: 'All task of the user have been caught' });
    } else {
        res.json({ success: false, task: null, message: 'An Error Occured !' });
    }
});

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    var user = new User(req.user);
    user.tasks.push({
        taskname: req.body.taskname,
        taskinfo: req.body.taskinfo,
        duedate: req.body.duedate || moment().add(2, 'd'),
        priority: req.body.priority
    });
    user.save()
        .then((upuser) => {
            if (upuser) {
                res.json({ success: true, message: 'Task Added !' });
            } else {
                res.json({ success: false, message: 'Task could not be added !' });
            }
        })
        .catch((err) => console.log('An error occured !', err));
});

router.put('/up/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    var user = new User(req.user);
    if (user) {
        if (user.tasks.id(req.params.taskId)) {
            if (req.body.taskname) {
                user.tasks.id(req.params.taskId).taskname = req.body.taskname;
            } else if (req.body.taskinfo) {
                user.tasks.id(req.params.taskId).taskinfo = req.body.taskinfo;
            } else if (req.body.duedate) {
                user.tasks.id(req.params.taskId).duedate = req.body.duedate;
            } else if (req.body.priority) {
                user.tasks.id(req.params.taskId).priority = req.body.priority;
            }
            user.save()
                .then((upuser) => {
                    if (upuser) {
                        res.json({ success: true, message: 'Task updated !' });
                    } else {
                        res.json({ success: false, message: 'Task could not be updated !' });
                    }
                })
                .catch((err) => console.log('An error occured !', err));
        }
    }
});

router.delete('/del/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    var user = new User(req.user);
    if (user) {
        if (user.tasks.id(req.params.taskId)) {
            user.tasks.id(req.params.taskId).remove();
            user.save()
                .then((upuser) => {
                    if (upuser) {
                        res.json({ success: true, message: 'Task removed !' });
                    } else {
                        res.json({ success: false, message: 'Task could not be removed !' });
                    }
                });
        } else {
            res.json({ success: false, message: 'No Such Task is available !' });
        }
    } else {
        res.json({ success: false, message: 'User not found !' });
    }
});

router.delete('/delAll', passport.authenticate('jwt', { session: false }), (req, res) => {
    var user = new User(req.user);
    if (user) {
        if (user.tasks.length > 0) {
            user.tasks = [];
            user.save()
                .then((upuser) => {
                    if (upuser) {
                        res.json({ success: true, message: 'All Tasks Removed !' });
                    } else {
                        res.json({ success: false, message: 'Could not be removed !' });
                    }
                })
        } else {
            res.json({ success: false, message: 'No Tasks available to delete !' });
        }
    } else {
        res.json({ success: false, message: 'User not found !' });
    }
});

module.exports = router;