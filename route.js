const express = require('express')
const uuid = require('uuid')
const moment = require('moment')
const users = require('./data/user')
const categories = require('./data/category')
const v_categories = require('./data/video_category')
const router = express.Router()
let videos = require('./data/videos')

router.get('/', (req,res) => {
    res.json(videos.map(video => ({
        ...video,
        user: users.find(user => user.id == video.user_id),
        categories: v_categories.filter(v_c => video.id == v_c.video_id).map(item => categories.find(category => category.id == item.category_id))
    })))
})

router.get('/:id', (req,res) =>{
    console.log(req.params.id)
    for(let x of videos){
        if(x.id == req.params.id){
            return res.json(x)
        }
    }
    res.status(404).json({mes: `No video with id of ${req.params.id}`})
})

router.post('/', (req, res) =>{
    const {video_name, descriptions} = req.body
    if (!video_name) return res.status(400).json({msg: 'Please insert video name!'})
    console.log(uuid.v4())
    const new_video = {
        id: uuid.v4(),
        video_name,
        descriptions,
        pub_date: moment().format('LLLL'),
        user_id: 1
    }

    videos.push(new_video)

    res.json(new_video)
})

router.put('/:id', (req, res) => {
    const {video_name, descriptions} = req.body
    if (!video_name) return res.status(400).json({msg: 'Please insert video name!'})

    for(const video of videos) {
        if (video.id == req.params.id) {
            video.video_name = video_name || video.video_name;
            video.descriptions = descriptions || video.descriptions;
            video.updated_at = moment().format('LLLL')
            return res.json(video)
        }
    }
    res.status(404).json({mes: `No video with id of ${req.params.id}`})
})

router.delete('/:id', (req, res) => {
    videos = videos.filter(video => video.id != req.params.id)
    res.status(200).json({msg: `delete successfully`})
})

module.exports = router