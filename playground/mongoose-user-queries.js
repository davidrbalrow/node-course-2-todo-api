const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

var id = '5bdc837f6db0bf6c21867273';


//mongoose accepts a string

// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });

User.findById(id).then((user)=>{
  if (!user){
    return console.log('Id not found')
  }
  console.log('User by ID', user);
}).catch((e)=>console.log(e));
