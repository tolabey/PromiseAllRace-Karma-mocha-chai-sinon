var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");

var myPromiseHandlers = require ("./promiseRaceAll.js");

describe("myPromiseHandlers ", function() {
  const promiseConstructorName = "Promise";
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "foo");
  });
  const promise4 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 200, "bar");
  });

  const rejectedPromise1 = Promise.reject("rejected");
  const rejectedPromise2 = new Promise(function(resolve, reject) {
    setTimeout(reject, 200, "bar");
  });


  const promiseArrSetTimeOut = [promise3, promise4];
  const promiseArrSetTimeOutVals = ["foo", "bar"];
  const promiseArr = [promise1, promise2, promise3, promise4];
  const promiseArrVals = [3, 42, "foo", "bar"]

  function isArraysEqual(a, b){
    if(a.length !== b.length){
      return false;
    }

    for (var i = 0; i < a.length; i++){
      if(a[i] !== b[i]){
        return false;
      }
    }
    return true;
  }

  describe("race method",function(){

    describe("constructor name", function(){
      it("should be 'Promise' when parameter is iterable and non-empty ", function(done){
        var res = myPromiseHandlers.race([1]).constructor.name;
        assert.equal(res, promiseConstructorName);
        done();

      }); // end it
  
      it("should be 'Promise' when parameter is iterable with one element", function(done){
        var res = myPromiseHandlers.race([promise1]).constructor.name;
        assert.equal(res, promiseConstructorName);
        done();

      }); // end it
  
      it("should be 'Promise' when parameter is iterable and multi elements ", function(done){
        var res = myPromiseHandlers.race(promiseArr).constructor.name;
        assert.equal(res, promiseConstructorName);
        done();
      }); // end it

      it("should be 'Promise' when there is no parameter", function(done){
        var res = myPromiseHandlers.race().constructor.name;
        assert.equal(res, promiseConstructorName);
        done();
      }); // end it

      it(" should be 'Promise' when parameter is wrong format", function(done){
        var res = myPromiseHandlers.race(1).constructor.name;
        assert.equal(res, promiseConstructorName);
        done();
      }); // end it

    }); //end describe constructor.name === "Promise"

    describe("returned Promise ", function(){

      it("should be rejected when parameter is wrong format", function(done){

        myPromiseHandlers.race(1)
        .then(function(val){
          assert.equal(false, true);
          done();
        })
        .catch(function(err){
          assert.equal(true, true);
          done();
        })


      }); // end it

      it("should return same parameter", function(done){
        myPromiseHandlers.race([1])
        .then(function(val){
          assert.equal(val, 1);
          done();
        })
        .catch(function(err){
          assert.equal(false, true);
          done();
        })
      }); //end it

      it("should return non-promise parameter value", function(done){
        myPromiseHandlers.race(promiseArr)
        .then(function(val){
          assert.equal(val, 42)
          done();
        })
      }); // end it

      it("should return first completed promise", function(done){
        myPromiseHandlers.race(promiseArrSetTimeOut)
        .then(function(val){
          assert.equal(val, "foo");
          done();
        })
      }); // end it

      it("should return promise value", function(done){
        myPromiseHandlers.race([promise4])
        .then(function(val){
          assert.equal(val, "bar");
          done();
        })
      }); //end it

      it("should return reject value", function(done){
        myPromiseHandlers.race([rejectedPromise2])
        .then(function(){
          assert.equal(false, true);
          done();
        })
        .catch(function(rej){
          assert.equal(rej, "bar");
          done();
        })
      });//end it

      it("should return number instead of rejected promise value", function(done){
        myPromiseHandlers.race([rejectedPromise2, 1])
        .then(function(val){
          assert.equal(val, 1);
          done();
        })
        .catch(function(rej){
          assert.equal(false, true);
          done();
        })
      });//end it

    }); //end describe return values
  }); //end describe race

  describe("all method", function(){
    
    describe("constructor name ", function(){

      it("should be 'Promise' when there is no parameter", function(){
        var res = myPromiseHandlers.all().constructor.name;
        assert.equal(res, promiseConstructorName);
      }); //end it

      it("should be 'Promise' when parameter is wrong format", function(){
        var res = myPromiseHandlers.all(1).constructor.name;
        assert.equal(res, promiseConstructorName);
      }); //end it

      it("should be 'Promise' when parameter is iterable and no element", function(){
        var res = myPromiseHandlers.all([]).constructor.name;
        assert.equal(res, promiseConstructorName);
      }); //end it

      it("should be 'Promise' when parameter is iterable with multiple elements", function(){
        var res = myPromiseHandlers.all(promiseArr).constructor.name;
        assert.equal(res, promiseConstructorName);
      }); //end it

      it("should be 'Promise' when parameter is iterable but element is not promise", function(){
        var res = myPromiseHandlers.all([1]).constructor.name;
        assert.equal(res, promiseConstructorName);
      }); //end it

    });

    describe("returned promise", function(done){

      it("should return error", function(done){
        myPromiseHandlers.all()
        .then(function(val){
          assert.equal(false, true);
          done();
        })
        .catch(function(val){
          assert.equal(true, true);
          done();
        });
      }); // end it

      it("should return empty iterable object", function(done){
        myPromiseHandlers.all([])
        .then(function(val){
          assert.equal(val.length, 0);
          done();
        })
        .catch(function(){
          assert.equal(false, true);
          done();
        });
      }); // end it

      it("should return same, with parameter", function(done){
        myPromiseHandlers.all([1, 2, 3])
        .then(function(val){
          assert.equal(true, isArraysEqual(val, [1, 2, 3]));
          done();
        });
      }); //end it

      it("should return promises values by ordered", function(done){
        myPromiseHandlers.all(promiseArr)
        .then(function(val){
          assert.equal(true, isArraysEqual(val, promiseArrVals));
          done();
        })
        ;
      }); //end it

      it("should return a reject value", function(done){
        myPromiseHandlers.all([rejectedPromise1, promise1, 1 , 2])
        .then(function(){
          assert.equal(false, true);
          done();
        })
        .catch(function(rej){
          assert.equal(rej, "rejected");
          done();
        })
      })//end it

      it("should return first rejected promise", function(done){
        myPromiseHandlers.all([rejectedPromise1, rejectedPromise2])
        .then(function(val){
          assert.equal(false, true);
          done();
        })
        .catch(function(rej){
          assert.equal(rej, "rejected");
          done();
        })
      });//end it

      it("should return setTimeout reject value", function(done){
        myPromiseHandlers.all([rejectedPromise2])
        .then(function(){
          assert.equal(false, true);
          done();
        })
        .catch(function(rej){
          assert.equal(rej, "bar");
          done();
        })
      });//end it



    }); //end describe return  value

  }); // end describe myPromiseHandlers.all
}); //end describe myPromiseHandlers