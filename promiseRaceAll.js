var myPromiseHandlers = {    
    race: function(promiseArr){      
        return new Promise(function(resolve, reject) {
            if(promiseArr[Symbol.iterator] !== undefined) { // is parameter iterable control
                let flag = false;
                for(let i = 0; i < promiseArr.length; i++){   // loop for promises array
                    if(promiseArr[i].constructor.name === "Promise") {  // is promise
                        promiseArr[i]
                        .then(function(fData){ 
                            if(!flag){
                                flag = true; // true false yap
                                resolve(fData)
                            }
                        })
                        .catch(function(err){
                            reject(err)
                        });
                    }
                    else {  // is not promise
                        if(!flag){
                            console.log(promiseArr)
                            flag = promiseArr[0];
                            resolve(promiseArr[0])
                        }
                    }

                }
            }
            else {  //error
                if(promiseArr === undefined){ // undefined Error
                    reject(new Error("Cannot read property 'Symbol(Symbol.iterator)' of undefined"));
                }
                else { // others Error
                    reject(new Error("undefined is not a function"));
                }
            }
        });

    },
    all: function(promiseArr) {
        return new Promise(function(resolve, reject){
            if(promiseArr[Symbol.iterator] !== undefined) {
                let dataArr = [], errC = 0, promiseCount = 0;
                for(let i = 0; i < promiseArr.length; i++){
                    if(promiseArr[i].constructor.name === "Promise"){ // p
                        promiseArr[i]
                        .then(function(fData){
                            dataArr[i]= fData; // true false
                            promiseCount++;
                            if(promiseArr.length === promiseCount && errC === 0){
                                resolve(dataArr)
                            }
                        })
                        .catch(function(err){
                            errC++;
                            if(errC === 1){
                                reject(err);
                            }
                        })
                    }    
                    else{ //is not promise
                        dataArr[i] = promiseArr[i];
                        promiseCount++;
                        if(promiseArr.length === promiseCount && errC === 0){
                            resolve(dataArr)
                        }                            
                    }
                }
                
                if(promiseArr.length === 0){ // parameter is iterable but empty
                    resolve([])
                }
            }
            else{  // error
                if(promiseArr === undefined){ // undefined Error
                    reject(new Error("Cannot read property 'Symbol(Symbol.iterator)' of undefined"));
                }
                else { // others Error
                    reject(new Error("undefined is not a function"));
                }
            }
        })            
    }   
}

module.exports = myPromiseHandlers;
