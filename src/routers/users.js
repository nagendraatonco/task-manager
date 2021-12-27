const express = require('express');
const User = require('../models/user');
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelComeEmail, sendCancellationEmail } = require("../emails/accounts");

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log("login")
        const token = await user.generateAuthToken()
        res.send({user, token })
    } catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    console.log(req.user.token)
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token != req.token 
        })
        console.log(req.user.token)
        await req.user.save()
        res.send("Logging out")
    } catch(e){
        res.status(400).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        console.log("logging out")
        req.user.tokens = []
        console.log("Empty the token array")
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.post("/users", async(req, res) => {
    const user = await new User(req.body);
    user.save()
    .then(async ()=>{
        // console.log(user)
        await user.save()
        sendWelComeEmail(user.email, user.name);
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    })
    .catch((error)=>{
        // console.log(error);
        res.status(400).send(error)
    })
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = await Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation =  updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        console.log("Hello")
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user)
    }catch(e){
        res.status(500).send(e);
    }
})

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jp|pn|jpe)g$/)){
            return cb(new Error("Please upload an image"))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async(req, res) =>{
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
})

router.get('/users/:id/avatar', async(req, res) => {
    let user = await User.findById(req.params.id);
    try{
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send(e);
    }
})

module.exports = router