var express = require('express');
var router = express.Router();
const users = require('../controllers/UserController.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*Routes to save users */
router.post('/addUser',users.create);

/*Routes to get users */
router.get('/userList',users.findAll);

/*Routes to get single user */
router.get('/userDetails/:userId',users.findByUserId);

/*Routes to delete single user */
router.get('/userRemove/:userId',users.userDelete);

module.exports = router;
