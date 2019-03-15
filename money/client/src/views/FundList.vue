<template>
    <div class="fillContainer">
        <div>
            <el-form ref="add_data" :model='search_data'>

                <el-row>
                    <el-col :span="22">
                        <!-- 筛选 -->

                        <el-form-item label="按照时间筛选：">
                            <el-date-picker
                                v-model="search_data.startTime"
                                type="datetime"
                                placeholder="选择开始日期时间"
                                style="margin-right: 20px"
                                >
                            </el-date-picker>
                            --
                            <el-date-picker
                                v-model="search_data.endTime"
                                type="datetime"
                                placeholder="选择结束日期时间"
                                style="margin: 0 20px"
                                >
                            </el-date-picker>

                            <el-button
                            type="primary"
                            size="small"
                            icon="search"
                            @click="handleSearch()"
                            >
                                筛选
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <!-- 添加资金信息 -->
                        <el-form-item v-if="user.identity === 'admin'">  
                            <el-button
                            type="primary"
                            size="small"
                            icon="view"
                            @click="handleAdd()"
                            >
                                添加
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                

                

               
                
            </el-form>
        </div>
        <el-table
            v-if="tableData.length > 0"
            :data='tableData'
            max-height="450"
            border
            :default-sort = "{prop: 'date', order: 'descending'}"
            style="width: 100%">
                <el-table-column
                type="index"
                label="序号"
                align='center'
                width="60">
            </el-table-column>
            <el-table-column
                prop="date"
                label="创建时间"
                align='center'
                width="250"
                sortable>
                <template slot-scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="收支类型"
                align='center'
                width="150">
            </el-table-column>
            <el-table-column
                prop="describe"
                label="收支描述"
                align='center'
                width="180">
            </el-table-column>
            <el-table-column
                prop="income"
                label="收入"
                align='center'
                width="100"> 
                <template slot-scope="scope">  
                    <span style="color:#00d053">+ {{ scope.row.income }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="expend"
                label="支出"
                align='center'
                width="100">
                <template slot-scope="scope">  
                    <span style="color:#f56767">- {{ scope.row.expend }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cash"
                label="账户现金"
                align='center'
                width="153">
                <template slot-scope="scope">  
                    <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                </template>
            </el-table-column>
                <el-table-column
                prop="remark"
                label="备注"
                align='center'
                width="160">
            </el-table-column>
            <el-table-column
                prop="operation"
                align='center'
                v-if="user.identity === 'admin'"
                 width="170"
                label="操作">
                <template slot-scope='scope'>
                    <el-button 
                        type="warning" 
                        icon='edit' 
                        size="small"
                        @click='handleEdit(scope.$index, scope.row)'
                    >编辑</el-button>
                    <el-button 
                        type="danger" 
                        icon='delete' 
                        size="small"
                        @click='handleDelete(scopels.$index, scope.row)'
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        
        <el-row>
            <el-col :span="24">
                <div class="pagination">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="paginations.page_index"
                    :page-sizes="paginations.page_sizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <myDialog :dialog="dialog" :formData="formData" @update="getProfile"></myDialog>
    </div>
</template>

<script>

import Dialog from '../components/Dialog'

export default {
  name: "fundList",
  data() {
    return {
      filterTableData: [],      //用于筛选
      search_data: {
          startTime: '',
          endTime: ''
      },
      paginations: {
          page_index: 1,        //当前位于那一页
          total: 0,             //总数
          page_size: 5,         //每页显示的条数
          page_sizes: [5, 10, 15, 20],       //设置每页的最大显示条数
          layout: 'total, sizes, prev, pager, next, jumper'     //翻页属性
      },
      formData: {     //传递给子组件的数据
            type: '',
            describe: '',
            income: '',
            expend: '',
            cash: '',
            remark: '',
            id: ''
        },
      tableData: [],    //存储当前页的资金信息
      allTableData: [],    //存储所有页面的资金信息
      dialog: {
          show: false,
          title: '',
          option: 'edit'
      }
    };
  },
  components: {
      myDialog: Dialog
  },
  created() {
    this.getProfile();
  },
  computed: {
      user(){
          return this.$store.getters.user
      }
  },
  methods: {
    getProfile() {
      //获取表格数据
      this.$axios
        .get("/api/profiles")
        .then(res => {
        //   console.log(res);
          this.allTableData = res.data;     //将请求过来的所有数据赋值给allTableData
          this.filterTableData = res.data;     //将请求过来的所有数据赋值给filterTableData

          this.setPaginations()             //设置分页数据
          
        })
        .catch(err => {
          throw err;
        });
    },
    setPaginations(){
        //初始化分页属性
        this.paginations.total = this.allTableData.length
        this.paginations.page_index = 1
        this.paginations.page_size = 5

        //设置当前页需要显示的分页数据
        this.tableData = this.allTableData.filter((item, index) => {
            return index < this.paginations.page_size
        })
    },
    handleEdit(index, row){
        this.dialog = {
            show: true,
            title: '编辑资金信息',
            option: 'edit'
        }
        console.log(row)

        this.formData = {
            type: row.type,
            describe: row.describe,
            income: row.income,
            expend: row.expend,
            cash: row.cash,
            remark: row.remark,
            id: row._id
        }
    },
    handleDelete(index, row){
        this.$axios.delete(`/api/profiles/delete/${row._id}`)
            .then(res => {
                this.$message({
                    message: '数据删除成功！！！',
                    type: 'success'
                })
                this.getProfile();          //更新页面
            })
    },
    handleAdd(){
        this.dialog = {
            show: true,
            title: '编辑资金信息',
            option: 'add'
        }

        this.formData = {
            type: '',
            describe: '',
            income: '',
            expend: '',
            cash: '',
            remark: '',
            id: ''
        }
    },
    handleSizeChange(page_size){     //切换每页显示的最大条数

        this.paginations.page_index = 1

        this.paginations.page_size = page_size

        //设置当前页需要显示的分页数据
        this.tableData = this.allTableData.filter((item, index) => {
            return index < this.paginations.page_size
        })

    },
    handleCurrentChange(page){
        // console.log(page)


        let index = this.paginations.page_size * (page - 1)         //获取当前页

        let nums = this.paginations.page_size * page            //数据总数

        let tables = []     //容器

        for(let i = index; i < nums; i++){
            //判断allTableData中是否拥有该数据
            if(this.allTableData[i]){
                tables.push(this.allTableData[i])
            }
        }

        //将目标容器赋值给tableData，利用v-for进行遍历循环
        this.tableData = tables
    },
    handleSearch(){         //筛选

        if(!this.search_data.startTime || !this.search_data.endTime){       //判断开始时间和结束时间是否为空
            this.$message({
                type: 'warning',
                message: '请选择正确的时间区域'
            })

            this.getProfile()
            return
            
        }

        const sTime = this.search_data.startTime.getTime()
        const eTime = this.search_data.endTime.getTime()
        
        this.allTableData = this.filterTableData.filter(item => {
            // console.log(item, sTime, eTime)

            let date = new Date(item.date)
            let time = date.getTime()

            // console.log(date, time)

            return time >=sTime && time <= eTime

        })

        this.setPaginations()    //初始化分页数据
    }
  }
};
</script>

<style scoped>
.fillContainer{
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}
.search_box{
    float: left;
}
.btnRight{
    float: right;
    z-index: 666;
}
.pagination{
    text-align: right;
    margin-top: 10px;
}
</style>


