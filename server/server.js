var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();
var port = process.env.PORT || 3000;

// bodyParser is middleware to be used by express
// bodyParser will take our json text and turn it into json Object (attached to req object)
// return of json function is a function

app.use(bodyParser.json());

//express post route  2 args URl and callback function
app.post('/todos',(req,res) => {
    var todo = new Todo({
      text: req.body.text
    });

    todo.save().then((doc)=>{
      res.send(doc);
    }, (e) =>{
      res.status(400).send(e);
    });
});

app.get('/todos',(req,res) => {
  console.log("get");
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) =>{
    res.status(400).send(e);
    console.log("error")
  });

});



// GET /todos/
app.get('/todos/:id', (req, res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if (!todo){
      res.status(404).send();
    } else
    {res.send({todo})};
  }, (e) =>{
      res.status(400).send();
  });
});

app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if (!todo){
      res.status(404).send();
    } else
    {res.send({todo})};
  }, (e) =>{
      res.status(400).send();
  });

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
