const mongoose = require('mongoose');
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser : true,
    // useCreateIndex : true
})

// const User = mongoose.model('User', {
//     name : {
//         type : String,
//         required : true,
//         trim : true
//     },
//     email : {
//         type : String,
//         required : true,
//         trim : true,
//         validate(val){
//             if(!validator.isEmail(val))
//                 throw new Error("Please enter the valid email address")
//         }
//     },
//     password : {
//         type : String,
//         required : true,
//         trim : true,
//         validate(val){
//             if(val.length < 8)
//                 throw new Error("Password must contains 6 characters")
//             if(val.toLowerCase().includes('password'))
//                 throw new Error('Password shouldn\'t have a "password"')
//         }
//     },
//     age : {
//         type : Number,
//         validate(val){
//             if(val < 0)
//                 throw new Error("Age must be a positive Number")
//         }
//     }
// })

// const me = new User({
//     name : "   Nagendra  ",
//     email : "  nagendra@gmail.com   ",
//     password : "        password "
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })

const Tasks = mongoose.model('Tasks', {
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    }
})

const task = new Tasks({
    description : "Send the EOD mail"
})

task.save()
.then(()=>{
    console.log(task)
})
.catch((error)=> console.log(error))