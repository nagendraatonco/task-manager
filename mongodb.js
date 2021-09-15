const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager-api'

// MongoClient.connect(connectionURL, {useNewUrlParser : true }, ( error, client) => {
//     if(error){
//         console.log(error);
//     }else {
//         const db = client.db(dbName);
//         db.collection('tasks').insertMany([{
//             description : "Complte the NodeJS course", completed: false
//             }, 
//             { 
//                 description : "Listing out the parametsers list", completed : true
//             },
//             {
//                 description : "Send the EOD mail", completed : false
//             }
//              ], (error, result) => {
//             if(error)
//             {
//                 console.log("Some error");
//             }else {
//                 console.log(result.ops)
//             }
//         })
//         console.log("The data has been inserted successfully")
//     }
// })

// MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client) => {
//     if(error){
//         return console.log(error)
//     }
//         const db = client.db(dbName)
//     db.collection('users').updateOne({name : "uuyr"}, 
//             {
//                 $inc : {
//                     age : -2
//                 }  
//             }      
//         ).then((result)=>{
//         console.log(result)
//     }).catch((error)=>{
//         console.log(error);
//     })
// })

// MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error,client) => {
//     console.log("Hello");
//     if(error){
//         console.log(error)
//     } else {
//         const db = client.db(dbName);
//         db.collection('tasks').find({completed : false}).toArray((error, result) => {
//         if(error){
//             console.log(error)
//         } else {
//             console.log(result)
//         }
//         })
//         console.log("World")
//     }
// })

MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error,client) =>{
    if(error)
        return console.log("Failed to connect to database");
    const db = client.db(dbName);
    // db.collection('tasks').updateMany({completed  : false}, {
    //     $set : {
    //         completed : true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })
    db.collection('tasks').deleteMany({description : "Send the EOD mail"
     })
    .then((result) => {
        console.log(result)
    })
    .catch((error)=> {
        console.log(error)
    })
})