<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.userKey" clearable placeholder="输入教师ID/名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-input v-model="form.userId" type="hidden" />
        <el-form-item label="教师姓名" prop="userName">
          <el-input v-model="form.userName" style="width: 75%" />
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
      <el-table-column prop="userId" label="教师ID" width="200" />
      <el-table-column prop="userName" label="教师名称" width="200" />
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
      <el-table-column v-if="checkPer(['admin', 'school:edit', 'school:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { addTeacher, updateTeacher, deleteTeacher } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { userId: null, userName: null, gender: 1, idCard: null, phone: null }
export default {
  name: 'TeacherPane',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ title: '教师', idField: 'userId', url: 'ljadmin/school/queryTeacher', delParams: {}, crudMethod: { add: addTeacher, edit: updateTeacher, del: deleteTeacher } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      area: [],
      permission: {
        add: ['admin', 'teacher:add'],
        edit: ['admin', 'teacher:edit'],
        del: ['admin', 'teacher:del']
      },
      rules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
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
      curd.query = { ...curd.query, ...this.query, schoolId: this.schoolId }
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.form.schoolId = this.schoolId
      this.form.gender = form.gender || 1
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      return true
    },
    [CRUD.HOOK.beforeDelete](crud, data) {
      crud.delParams = { schoolId: this.schoolId }
      return true
    },
    toEdit(row) {
      this.$router.push({
        path: '/business/school/' + row.id,
        query: { title: row.name }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.button-wrapper {
  display: inline-flex;
}
.school-stat-info {
  display: inline-flex;
  font-size: 14px;
  margin-left: 20px;

  & > div {
    margin-left: 10px;
    color: #999;

    b {
      color: #333;
      font-weight: normal;
    }
  }
}
</style>
