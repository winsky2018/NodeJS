<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">火焰鼠在线后台管理系统</span>
        <el-form
          :model="registerUser"
          :rules="rules"
          ref="registerForm"
          label-width="100px"
          class="registerForm"
        >

          <el-form-item label="用户名" prop="name">
            <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerUser.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerUser.password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="password2">
            <el-input type="password" v-model="registerUser.password2" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          
            <el-form-item label="选择身份">
                <el-select v-model="registerUser.identity" placeholder="请选择身份">
                    <el-option label="管理员" value="admin"></el-option>
                    <el-option label="员工" value="employee"></el-option>
                </el-select>
            </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "register",
  components: {},
  data(){


      //验证两次密码输入是否一致
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.registerUser.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
          registerUser: {
              name: '',
              email: '',
              password: '',
              password2: ''
          },
          
          rules: {      //配置表单验证规则
              name: [
                  {required: true, message: '用户名不能为空', trigger: 'blur'},
                  {min: 2, max: 30, message: '用户名长度在2到30个字符之间', trigger: 'blur'}
              ],
              email: [
                  {type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur'}
              ],
              password: [
                  {required: true, message: "密码不能为空", trigger: 'blur'},
                  {min: 6, max: 30, message: '密码长度在6到30个字符之间', trigger: 'blur'}
              ],
              password2: [
                  {required: true, message: "密码不能为空", trigger: 'blur'},
                  {min: 6, max: 30, message: '密码长度在6到30个字符之间', trigger: 'blur'},
                  {validator: validatePass2, trigger: 'blur'}
              ]
          }
      }
  },
  created(){

    let that = this
    //通过enter键来实现注册
    document.onkeydown = function (e) {
      let event = e || window.event
      // console.log(event.keyCode)
      let key = event.keyCode

      if(key === 13){
        that.submitForm('registerForm')
      }
    }
  },
  methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            this.$axios.post("/api/users/register", this.registerUser)
                        .then(res => {
                            //注册成功
                            this.$message({
                                message: '账号注册成功！！！',
                                type: 'success'
                            })
                        })
                        .catch(err => {
                            throw err
                            this.$message({
                                message: '账号注册失败！！！',
                                type: 'warning'
                            })
                        })

                        this.$router.push('/login')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
  }
};
</script>

<style scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
</style>

