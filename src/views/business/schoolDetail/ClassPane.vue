<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="grade-list">
        <el-radio-group v-model="gradeLevel" @change="crud.toQuery">
          <el-radio-button :key="0" :label="0">{{ '全部' }}</el-radio-button>
          <el-radio-button v-for="grade in schoolGrades" :key="grade.gradeLevel" :label="grade.gradeLevel">{{ grade.gradeName }}</el-radio-button>
        </el-radio-group>
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-input v-model="form.id" type="hidden" />
        <el-form-item label="班级性质" prop="mode">
          <el-select v-model="form.mode" style="width: 75%">
            <el-option v-for="opt in classModes" :key="opt.id" :label="opt.name" :value="opt.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="gradeLevel">
          <el-select v-model="form.gradeLevel" style="width: 75%">
            <el-option v-for="opt in schoolGrades" :key="opt.id" :label="opt.gradeName" :value="opt.gradeLevel" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" style="width: 75%" />
          <div class="tip">提示：班级名称为一年级2班，只需输入2即可。</div>
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
      <el-table-column prop="id" label="班级ID" width="90" />
      <el-table-column prop="name" label="班级名称" />
      <el-table-column prop="classAdminName" label="班主任" />
      <el-table-column prop="cntTeacher" label="教师数量" />
      <el-table-column prop="cntStudent" label="学生数量" />
      <el-table-column v-if="checkPer(['admin', 'school:edit', 'school:del'])" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSchoolGrades, addClass, updateClass, deleteClass } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud2'
import crudOperation from '@crud/CRUD.operation2'
import udOperation from '@crud/UD.operation2'
import { CLASS_MODE } from '@/utils/constants'

const defaultForm = { id: null, name: null, gradeLevel: null, mode: null }
export default {
  name: 'School',
  components: { crudOperation, udOperation },
  cruds() {
    return CRUD({
      title: '班级',
      url: 'ljadmin/school/queryClass',
      crudMethod: { add: addClass, edit: updateClass, del: deleteClass }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    mode: { type: String, default: undefined }
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      gradeLevel: 0,
      schoolGrades: [],
      classModes: CLASS_MODE,
      permission: {
        add: ['admin', 'school_class:add'],
        edit: ['admin', 'school_class:edit'],
        del: ['admin', 'school_class:del'],
        view: ['admin', 'school_class:view']
      },
      rules: {
        mode: [{ required: true, message: '请选择班级性质', trigger: 'blur' }],
        gradeLevel: [{ required: true, message: '请选择年级', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入班级名称', trigger: 'change' }, //
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.$eventBus.$on('schoolInfoChange', schoolInfo => {
      this.getSchoolGrades()
    })
  },
  beforeDestroy() {
    this.$eventBus.$off('schoolInfoChange')
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, schoolId: this.schoolId, gradeLevel: this.gradeLevel }
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.form.schoolId = this.schoolId
      this.form.mode = Number(this.form.mode || CLASS_MODE[0].id)
      // 年级默认选中
      if (!this.form.gradeLevel) {
        if (this.gradeLevel) {
          this.form.gradeLevel = this.gradeLevel // 选中当前年级
        } else {
          this.form.gradeLevel = this.schoolGrades[0].gradeLevel // 默认第一个年级
        }
      }
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      return true
    },
    [CRUD.HOOK.beforeDelete](crud, data) {
      crud.delParams = { force: 0 }
      return true
    },
    [CRUD.HOOK.beforeToView](crud, data) {
      this.$router.push({
        path: '/business/class/' + data.id,
        query: { title: data.name }
      })
    },
    getSchoolGrades() {
      getSchoolGrades(this.schoolId).then(res => {
        this.schoolGrades = res
        this.$eventBus.$emit('schoolGradesChange', res)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.grade-list {
  margin-bottom: 20px;
}

.tip {
  color: #999;
}
</style>
