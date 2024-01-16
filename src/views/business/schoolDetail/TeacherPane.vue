<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <crudOperation :permission="permission">
        <template slot="right">
          <!-- 搜索 -->
          <el-input v-model="query.userKey" clearable placeholder="输入教师ID/名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <rrOperation />
        </template>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-input v-model="form.id" type="hidden" />
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="form.name" style="width: 75%" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width: 75%" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" style="width: 75%">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" style="width: 75%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="教师ID" width="200" />
      <el-table-column prop="name" label="教师名称" width="200" />
      <el-table-column prop="phone" label="账号" />
      <el-table-column label="任教班级">
        <template slot-scope="scope">
          {{ scope.row.cntClass }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间">
        <template slot-scope="scope">
          {{ scope.row.loginTime }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin', 'school:edit', 'school:del'])" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--上传表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelUpload" :visible="uploadStatus > 0" :title="uploadTitle" width="1000px">
      <!-- <el-form ref="uploadForm" :model="uploadForm" size="small" label-width="100px">
       <el-form-item label="第一步:">
          <div>请先下载批量导入模板</div>
          <el-button type="primary" size="small">下载模板</el-button>
        </el-form-item>
        <el-form-item label="第二步:">
          <div>上传已填写好的表格</div>
          <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="第三步:">
          <div>导入名单后，请检查无错后，再确认创建。</div>
          <el-button type="primary" size="small">确认创建</el-button>
        </el-form-item>
      </el-form> -->

      <div class="upload-head">
        <div class="upload-left">
          <el-upload class="upload-item" action="" :show-file-list="false" :auto-upload="false" :on-change="handleUploadChange">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button class="upload-item" type="success" size="small" @click="submitUpload">开始导入</el-button>
        </div>

        <div class="upload-right">
          <el-button class="upload-item" type="info" size="small">下载模板</el-button>
        </div>
      </div>

      <el-card class="box-card">
        <el-table ref="table22" :data="tableData" height="450" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="老师姓名" label="老师姓名" />
          <el-table-column prop="手机号" label="手机号" />
          <el-table-column prop="性别" label="性别" />
          <el-table-column prop="身份证号" label="身份证号" />
          <el-table-column label="导入状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0">等待导入</el-tag>
              <el-tag v-else-if="scope.row.status === 1" type="info">正在导入</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="success">导入成功</el-tag>
              <el-tag v-else-if="scope.row.status === 3" type="danger">{{ scope.row.errorMsg }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelUpload">取消</el-button>
        <el-button :loading="uploadStatus === 2" type="primary" @click="cancelUpload">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTeacher, updateTeacher, deleteTeacher, importTeacher } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud2'
import rrOperation from '@crud/RR.operation2'
import crudOperation from '@crud/CRUD.operation2'
import udOperation from '@crud/UD.operation2'
import pagination from '@crud/Pagination'
import readXlsxFile from 'read-excel-file'

const defaultForm = { id: null, name: null, gender: 1, idCard: null, phone: null }
export default {
  name: 'TeacherPane',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({
      title: '教师',
      url: 'ljadmin/school/queryTeacher',
      delParams: {},
      crudMethod: {
        add: addTeacher,
        edit: updateTeacher,
        del: deleteTeacher
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      area: [],
      permission: {
        add: ['admin', 'school_teacher:add'],
        edit: ['admin', 'school_teacher:edit'],
        del: ['admin', 'school_teacher:del'],
        view: ['admin', 'school_teacher:view'],
        upload: ['admin', 'school_teacher:upload']
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      uploadForm: {},
      uploadTitle: '导入教师',
      uploadStatus: 0,
      tableData: []
    }
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, schoolId: this.schoolId }
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.form.schoolId = this.schoolId
      this.form.gender = form.gender || 1
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      return true
    },
    // 删除前做的操作
    [CRUD.HOOK.beforeDelete](crud, data) {
      crud.delParams = { schoolId: this.schoolId }
      return true
    },
    // 查看前做的操作
    [CRUD.HOOK.beforeToView](crud, data) {
      this.$router.push({
        path: '/business/teacher/' + data.id,
        query: { title: data.name }
      })
    },
    // 查看前做的操作
    [CRUD.HOOK.beforeToUpload](crud, data) {
      this.uploadStatus = CRUD.STATUS.PREPARED
    },
    handleUploadChange(file, fileList) {
      console.log(file, fileList)
      readXlsxFile(file.raw, { sheet: 1 }).then(data => {
        const [columns, ...rows] = data.slice(1)
        console.log(columns)
        console.log(rows)
        this.tableData = rows.map(row => {
          return columns.reduce(
            (acc, col, i) => {
              acc[col] = row[i]
              return acc
            },
            { status: 0 }
          )
        })
      })
    },
    cancelUpload() {
      this.uploadStatus = CRUD.STATUS.NORMAL
    },
    async submitUpload() {
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        row.status = 1
        this.$set(this.tableData, i, { ...row })
        try {
          await importTeacher({})
          row.status = 2
        } catch (error) {
          row.status = 3
          row.errorMsg = error.response.data.message
        }
        this.$set(this.tableData, i, { ...row })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .upload-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-item {
    display: inline-block;
    vertical-align: middle;
    margin: 0 10px 10px 0;
  }
}
</style>
