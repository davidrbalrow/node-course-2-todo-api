// var promise1 = new Promise((resolve,reject) =>{
//   resolve(result);
//   reject(error);
// });
//
// function asyncFunc(){
//   return promise1;
// }
//
// asyncFunc().then((res)=>{
//   log.console(res);
// });

function asyncFunc() {
    return new Promise(
        function (resolve, reject) {
            var result = 1;
            resolve(result);
            reject(error);
        });
};

// asyncFunc().then(result => { return result})
// .catch(error => { console.log("2")  });

var test = () => {
  return asyncFunc().then(result => { return result;})
  .catch(error => { console.log("2")  });
}

test().then((res)=>{console.log(res)});
