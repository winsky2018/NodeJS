//@login    &&      register
const express = require("express")
const bcrypt = require("bcrypt")
const gravatar = require("gravatar")
const jwt = require('jsonwebtoken')
const router = express.Router()
const keys = require('../../config/keys')
const passport = require('passport')
//引入user数据模型
const User = require('../../models/User')

//$route        GET     api/users/test
//@desc         返回请求的json数据
//@access       public
router.get('/test', (req, res) => {
    res.json({msg: "login works"})
})

//$route        POST     api/users/register
//@desc         返回请求的json数据
//@access       public
router.post('/register', (req, res) => {
    //查询数据库中是否拥有该邮箱
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){   //如果用户邮箱存在

                return res.status(400).json("此邮箱已被注册！")

            }else{  //如果用户不存在

                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    identity: req.body.identity,
                    password: req.body.password
                })

                //对密码进行加密处理

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if (err) throw err

                        newUser.password = hash     //将加密后的密码覆盖原来的密码

                        newUser.save()              //对注册的用户进行存储，储存成功则返回该用户信息
                                .then(user => res.json(user))
                                .catch(err => console.log(err))
                    });
                });

            }
        })
})

//$route        POST     api/users/login
//@desc         返回token jwt passport
//@access       public


router.post('/login', (req, res) => {

    const email = req.body.email
    const password = req.body.password   

    //查询数据库中是否有该邮箱
    User.findOne({email: email})
        .then(user => {
            if(!user){  //如果用户不存在！！！

                return res.status(400).json("用户不存在！！！")

            }else{

                //通过bcrypt将用户输入的密码和数据库中的密码进行匹配
                bcrypt.compare(password, user.password)
                        .then(isMatch => {
                            if(isMatch){    //如果匹配成功

                                //使用jwt.sign生成token     jwt.sign("规则", "加密名字", "过期时间", "箭头函数")
                                const rule = {id: user.id, name: user.name, identity: user.identity, avatar: user.avatar}
                                jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {

                                    if(err) throw err

                                    res.json({
                                        success: true,
                                        token: "Bearer " + token
                                    })

                                })
                                // res.json({msg: "密码匹配成功！！！"})

                            }else{      //如果匹配失败

                                return res.status(400).json('密码输入错误！！！')

                            }
                        })
            }


        })
})


//$route        GET     api/users/current
//@desc         返回当前的用户信息
//@access       Private    

// router.get('/current', '验证token', '箭头函数')

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    //接收passport.js中返回的user信息，并将部分数据返回。
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})


//将路由暴露
module.exports = router
