const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5bea08847b45b2c6263be111';

if (!ObjectID.isValid(id)){
  console.log('ID is not valid');
}
//mongoose accepts a string

Todo.find({
  _id: id
}).then((todos)=>{
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo)=>{
  console.log('Todo', todo);
});

Todo.findById(id).then((todo)=>{
  if (!todo){
    return console.log('Id not found')
  }
  console.log('Todo by ID', todo);
}).catch((e)=>console.log(e));
