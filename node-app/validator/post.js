const Validator = require('validator');
const isEmpty　=　require('./is-empty')


module.exports = function validatePostInput(data){
    let errors = {}

    data.text = !isEmpty(data.text) ? data.text : ''

    
    if(!Validator.isLength(data.text, {min: 10, max: 150})){
        errors.text = '评论不能少于10个字符，且不能大于150个字符'
    }
    
    if(Validator.isEmpty(data.text)){
        errors.text = '文本不能为空！！！'
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}