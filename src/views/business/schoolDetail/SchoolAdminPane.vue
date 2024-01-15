<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <crudOperation :permission="permission">
        <template slot="right">
          <!-- 搜索 -->
        </template>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="1000px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="0">
        <el-form-item prop="ids">
          <SchoolTeacherSelect v-if="crud.status.cu > 0" v-model="form.ids" :school-id="schoolId" :selected-ids="selectedIds" />
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
      <el-table-column prop="id" label="管理员ID" />
      <el-table-column prop="name" label="管理员名称" />
      <el-table-column prop="phone" label="管理员账号" />
      <el-table-column prop="joinTime" label="加入时间" />
      <el-table-column v-if="checkPer(['admin', 'school_admin:del'])" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { addSchoolAdmin, deleteSchoolAdmin } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud2'
import crudOperation from '@crud/CRUD.operation2'
import udOperation from '@crud/UD.operation2'
import SchoolTeacherSelect from './components/SchoolTeacherSelect.vue'

const defaultForm = { schoolId: null, ids: [], selectedIds: [] }
export default {
  name: 'SchoolAdminPane',
  components: { crudOperation, udOperation, SchoolTeacherSelect },
  cruds() {
    return CRUD({
      title: '学校管理员',
      url: 'ljadmin/school/querySchoolAdmin',
      delParams: {},
      crudMethod: {
        add: addSchoolAdmin,
        del: deleteSchoolAdmin
      },
      crudName: {
        add: '添加',
        edit: '编辑',
        del: '删除',
        download: '导出'
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      schoolId: Number(this.$route.params.schoolId),
      permission: {
        add: ['admin', 'school_admin:add'],
        del: ['admin', 'school_admin:del']
      },
      rules: {
        ids: [{ required: true, message: '至少要选择一个教师', trigger: 'blur' }]
      }
    }
  },
  computed: {
    selectedIds() {
      return this.crud.data.map(item => item.id)
    }
  },
  mounted() {},
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, schoolId: this.schoolId }
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.form.schoolId = this.schoolId
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      return true
    },
    // 删除前做的操作
    [CRUD.HOOK.beforeDelete](crud, data) {
      crud.delParams = { schoolId: this.schoolId }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
