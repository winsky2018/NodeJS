const express = require('express')
const passport = require('passport')
const router = express.Router()


//引入数据库模型
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')


//引入验证方法
const validatePostInput = require('../../validator/post')


//$route    GET api/posts/test
//@desc     返回请求的json数据
//@access   public
router.get('/test', (req, res) => {
    res.json({msg: 'this is posts test'})
})



//$route    POST api/posts
//@desc     创建一个评论接口
//@access   private
router.post('/', passport.authenticate('jwt', {session: false}),(req, res) => {


    //验证用户登录,并接受返回值
    const {errors, isValid} = validatePostInput(req.body)

    //判断isValid是否通过
    if(!isValid){
        return res.status(400).json(errors)
    }
    
    
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.body.id
    })


    newPost.save().then(post => res.json(post)).catch(err => res.json(err))
    
})


//$route    GET api/posts
//@desc     获取所有评论信息
//@access   public

router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound: "找不到任何评论信息"}))
})

//$route    GET api/posts/:id
//@desc     获取单个评论信息
//@access   public

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound: "找不到该评论信息"}))
})

// $route  DELETE api/posts/:id
// @desc   删除单个评论信息
// @access Private
router.delete("/:id",passport.authenticate('jwt', { session: false }),(req,res) => {
    Profile.findOne({user:req.user.id}).then(profile => {
      Post.findById(req.params.id)
          .then(post => {
            // 判断是否是本人
            if(post.user.toString() !== req.user.id){
              return res.status(401).json({notauthorized:"用户非法操作!"})
            }
  
            post.remove().then(() => res.json({success:true}))
          })
          .catch(err => res.status(404).json({postnotfound:"没有该评论信息"}))
    })
  })
  

//将路由暴露出去
module.exports = router