<template>
    <div class="dialog">
        <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        >
            <div class="form">
                <el-form
                ref="form"
                :model="formData"
                :rules="form_rules"
                label-width="120px"
                style="margin: 10px; width: auto;"
                >

                <el-form-item prop="type" label="收支类型：">
                    <el-select v-model="formData.type" placeholder="收支类型">
                        <el-option 
                        v-for="(formType, index) in format_type_list" 
                        :key="index" :label="formType" :value="formType"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="describe" label="收支描述："> 
                    <el-input v-model="formData.describe" style="width: 80%"></el-input>
                </el-form-item>

                <el-form-item prop="income" label="收入："> 
                    <el-input v-model="formData.income" style="width: 80%"></el-input>
                </el-form-item>

                <el-form-item prop="expend" label="支出："> 
                    <el-input v-model="formData.expend" style="width: 80%"></el-input>
                </el-form-item>

                <el-form-item prop="cash" label="账户现金："> 
                    <el-input v-model="formData.cash" style="width: 80%"></el-input>
                </el-form-item>

                <el-form-item prop="remark" label="备注："> 
                    <el-input type="textarea" v-model="formData.remark" style="width: 80%"></el-input>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="warning" @click="dialog.show = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                </el-form-item>
                
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>


<script>
export default {
    name: 'myDialog',
    data(){
        return {
            
            format_type_list: [
                '提现',
                '转账',
                '充值',
                '优惠券',
                '红包',
                '手续费',
                '邀请奖励',
                '抽奖'
            ],
            form_rules: {
                
                describe: [
                    {required: true, message: '收支描述不能为空！！！', trigger: 'blur'}
                ],
                income: [
                    {required: true, message: '收入不能为空！！！', trigger: 'blur'}
                ],
                expend: [
                    {required: true, message: '支出不能为空！！！', trigger: 'blur'}
                ],
                cash: [
                    {required: true, message: '账户现金不能为空！！！', trigger: 'blur'}
                ]
            }
        }
    },
    props: {
        dialog: Object,
        formData: Object
    },
    methods: {
        onSubmit(form){
            this.$refs[form].validate(valid => {
                if(valid){
                    // console.log(this.formData)

                    const url = this.dialog.option === 'add' ? 'add' : `edit/${this.formData.id}`         //判断操作类型：是编辑还是添加
                    // console.log(url, this.formData)
                    //验证通过后将数据POST到后台
                    this.$axios.post(`/api/profiles/${url}`, this.formData)

                                .then(res => {  //添加成功

                                    if(~ url.indexOf('add')){

                                        this.$message({
                                            message: '数据添加成功！！！',
                                            type: 'success'
                                        })

                                    }else{

                                        this.$message({
                                            message: '数据编辑成功！！！',
                                            type: 'warning'
                                        })

                                    }

                                    

                                    this.dialog.show = false        //隐藏dialog

                                    this.$emit('update')        //注册update事件，在父级的FundList中执行getProfile方法，刷新页面。
                                })
                                .catch(err => {throw err})
                }
            })
        }
    }
}
</script>
