// login && register

const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const gravatar = require('gravatar')
const router = express.Router()
const User = require('../../models/User')
const keys = require('../../config/keys')

//引入注册验证方法
const validateRegisterInput = require('../../validator/register')
const validateLoginInput = require('../../validator/login')


//$route    GET api/users/test
//@desc     返回请求的json数据
//@access   public
router.get('/test', (req, res) => {
    res.json({msg: 'this is test'})
})


//$route    POST api/users/register
//@desc     用户注册
//@access   public
router.post('/register', (req, res) => {
    // console.log(req.body)


    //验证用户注册,并接受返回值
    const {errors, isValid} = validateRegisterInput(req.body)

    //判断isValid是否通过
    if(!isValid){
        return res.status(400).json(errors)
    }

    //查询数据库中是否拥有邮箱
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({email: "邮箱已被注册！！"})
            }else{

                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                //对密码进行加密

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if(err) throw err
                        newUser.password = hash
                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err))
                    });
                });
            }
        })
    
})


//$route    POST api/users/login
//@desc     用户登录 返回token  jwt     passport
//@access   public
router.post('/login', (req, res) => {

    //验证用户登录,并接受返回值
    const {errors, isValid} = validateLoginInput(req.body)

    //判断isValid是否通过
    if(!isValid){
        return res.status(400).json(errors)
    }
    
    const email = req.body.email
    const password = req.body.password
    //查询数据库
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(400).json({email: '用户不存在！！'})　
            }

            //密码匹配
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch){
                            // res.json({msg: "登录成功！！！"})
                            // jwt.sign("规则", "加密名字", "过期时间", "箭头函数")

                            const rule = {id: user.id, name: user.name, email: user.email}

                            jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                                if(err) throw err
                                res.json({
                                    success: true,
                                    //生成的token必须是：'Bearer '
                                    token: 'Bearer ' + token
                                })
                            })
                            
                        }else{
                            return res.status(400).json({password: "密码输入错误！！！"})
                        }
                    })
        })
})

//$route    GET api/users/current
//@desc     返回当前用户信息
//@access   Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router
