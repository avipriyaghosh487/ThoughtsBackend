const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const bcrypt = require('bcrypt')
const verifyToken = require('../middleware/verifyToken')

//Create
router.post('/create',verifyToken, async (req,res) => {
    try{
        const newPost = new Post(req.body)
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err + " in route")
    }
})

//Update
router.put('/:id',verifyToken, async (req,res) => {
    try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)
    }catch(err){
        res.status(500).json(err)
    }
})

//Delete
router.delete('/:id',verifyToken, async (req,res) => {
    try{
        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Post has been deleted successfully"})
    }catch(err){
        res.status(500).json(err);
    }
})

//Get Post Details
router.get('/:id', async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err);
    }
}) 

//Get all Posts
router.get('/', async (req,res) => {
    const query = req.query;
    try{
        const searchFilter = {
            title:{$regex:query.search, $options:"i"}
        }
        const posts = await Post.find(query.search? searchFilter : null)
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
})

//Get User Posts
router.get('/user/:userId', async (req,res) => {
    try{
        const posts = await Post.find({userId:req.params.userId})
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router