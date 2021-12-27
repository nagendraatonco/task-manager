const express = require('express');
const Tasks = require('../models/tasks')
const router = new express.Router();
const auth = require('../middleware/auth')
//tasks/sortBy=<parameters><specialcharacters><order>
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    console.log(sort)
    try {   
        // const tasks = await Tasks.find({match})
        // res.send(tasks)
        await req.user.populate({
            path: 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        })
        // console.log(req.user.tasks)
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})



router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;
    try {
        await req.user.populate('tasks')
        res.send(res.user.tasks)
        // const task = await Tasks.findOne({_id, 'owner' : req.user._id})
        // if(!task){
        //     return res.status(404).send()
        // }
    
        // res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.post("/tasks", auth, (req, res) => {
    const task = new Tasks ({
        ...req.body,
        owner : req.user._id
    })
    task.save()
    .then(()=>{
        res.status(201).send(task)
    })
    .catch((e) => {
        res.status(400).send(e)
    })
})


router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const task = await Tasks.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
        // const task = await Tasks.findById(req.params.id)
        const task = await Tasks.findOne({_id : req.params.id, owner : req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try{
        const task = await Tasks.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e);
    }
})

router.delete('/tasks/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch(e){
        res.status(500).send("Unable to delete the user")
    }
})

module.exports = router