const config = require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var {authenticate} = require('./middleware/authenticate');


var app = express();
var port = process.env.PORT;

// bodyParser is middleware to be used by express
// bodyParser will take our json text and turn it into json Object (attached to req object)
// return of json function is a function

app.use(bodyParser.json());

//express post route  2 args URl and callback function
app.post('/todos', authenticate, (req,res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
    console.log("here i am");
    todo.save().then((doc)=>{
      res.send(doc);
    }, (e) =>{
      res.status(400).send(e);
    });
});



app.get('/todos',authenticate, (req,res) => {

  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) =>{
    res.status(400).send(e);
    console.log("error")
  });

});



// GET /todos/
app.get('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
    if (!todo){
      res.status(404).send();
    } else
    {res.send({todo})};
  }, (e) =>{
      res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo)=>{
    if (!todo){
      res.status(404).send();
    } else
    {res.send({todo})};
  }, (e) =>{
      res.status(400).send();
  });

});

app.patch('/todos/:id', authenticate,(req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id:id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo){

      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send()
  });

});

app.post('/users',(req,res) => {
  var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((user)=>{
      return user.generateAuthToken();
    }).then((token)=>{
      res.header('x-auth', token).send(user);
    })
    , (e) =>{
      res.status(400).send(e);
    }
});


app.get('/users/me', authenticate, (req, res) =>{

  res.send(req.user);

});

app.delete('/users/me/token', authenticate, (req,res) => {
  console.log("test");
  console.log("req");
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.post('/users/login', (req, res) =>{
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth', token).send(user);
    })
  }).catch((e)=>{
    res.status(400).send();
  });
//   User.find({"email": body.email}).then((user)=>{
//       if (!user){
//         res.status(401).send();
//       } else
//       {
//         res.send(body)
//       };
//     }, (e) =>{
//         res.status(400).send();
// });
});


app.listen(port, () =>{
    console.log(`Started on port ${port}`)
});

module.exports = {app};
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc)=>{
//   console.log('Saved todo', doc);
// },
//   (e)=>{
//   console.log('Unable to save todo');
// });

// var otherTodo = new Todo({
//   text: 'Feed the cat',
//   completed: true,
//   completedAt: 123
// });
//
// otherTodo.save().then((doc)=>{
//   console.log(JSON.stringify(doc,undefined,2));
// }, (e) => {
//   console.log('Unable to save',e);
// });


// var otherUser = new User({
//   email: 'dbarlow@ufl.edu',
// });
//
// otherUser.save().then((doc)=>{
//   console.log(JSON.stringify(doc,undefined,2));
// }, (e) => {
//   console.log('Unable to save',e);
// });
