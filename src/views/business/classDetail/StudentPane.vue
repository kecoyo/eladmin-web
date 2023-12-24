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
        <el-input v-model="form.classId" type="hidden" />
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" style="width: 75%" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" style="width: 75%">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学籍号" prop="studentCode">
          <el-input v-model="form.studentCode" style="width: 75%" />
        </el-form-item>
        <el-divider content-position="left">家长信息</el-divider>
        <el-form-item label="母亲手机号" prop="momPhone">
          <el-input v-model="form.momPhone" style="width: 75%" />
        </el-form-item>
        <el-form-item label="父亲手机号" prop="dadPhone">
          <el-input v-model="form.dadPhone" style="width: 75%" />
        </el-form-item>
        <el-form-item label="监护人" prop="otherPhone">
          <el-input v-model="form.otherPhone" style="width: 75%" />
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
      <el-table-column prop="id" label="学生ID" width="90" />
      <el-table-column prop="name" label="学生姓名" />
      <el-table-column prop="phone" label="账号" />
      <el-table-column prop="faceImg" label="人脸照片" />
      <el-table-column v-if="checkPer(['admin', 'school:edit', 'school:del'])" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { addStudent, updateStudent, deleteStudent } from '@/api/business/class'
import CRUD, { presenter, header, form, crud } from '@crud/crud2'
import rrOperation from '@crud/RR.operation2'
import crudOperation from '@crud/CRUD.operation2'
import udOperation from '@crud/UD.operation2'
import { CLASS_MODE, GENDER } from '@/utils/constants'

const defaultForm = { classId: null, name: null, studentCode: null, gender: null, momPhone: null, dadPhone: null, otherPhone: null }
export default {
  name: 'StudentPane',
  components: { crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({
      title: '学生',
      url: 'ljadmin/class/queryStudent',
      crudMethod: {
        add: addStudent,
        edit: updateStudent,
        del: deleteStudent
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    mode: { type: String, default: undefined }
  },
  data() {
    return {
      classId: this.$route.params.classId,
      schoolGrades: [],
      classModes: CLASS_MODE,
      permission: {
        add: ['admin', 'class_student:add'],
        edit: ['admin', 'class_student:edit'],
        del: ['admin', 'class_student:del'],
        view: ['admin', 'class_student:view']
      },
      rules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'change' }, //
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ],
        mode: [{ required: true, message: '请选择班级性质', trigger: 'blur' }],
        gradeLevel: [{ required: true, message: '请选择年级', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  mounted() {
    // this.crud.optShow.add = false
    // this.crud.optShow.edit = false
    // this.crud.optShow.del = false
    // this.crud.optShow.download = false
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, classId: this.classId }
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.form.classId = this.classId
      this.form.gender = Number(this.form.gender || GENDER[0].id)
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      return true
    },
    [CRUD.HOOK.beforeDelete](crud, data) {
      crud.delParams = { classId: this.classId }
      return true
    },
    // 查看前做的操作
    [CRUD.HOOK.beforeToView](crud, data) {
      this.$router.push({
        path: '/business/student/' + data.id,
        query: { title: data.name }
      })
      return false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
