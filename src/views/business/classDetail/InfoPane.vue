<template>
  <div class="pane-container">
    <el-descriptions v-if="classInfo" class="margin-top" :column="1" size="medium" border label-class-name="descriptions-label">
      <el-descriptions-item>
        <template slot="label">
          班级ID
        </template>
        {{ classInfo.id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          班级名称
        </template>
        {{ classInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          所属年级
        </template>
        {{ schoolGrades.getName(classInfo.gradeLevel, 'gradeLevel', 'gradeName') }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          班级性质
        </template>
        {{ classModes.getName(classInfo.mode) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          班主任
        </template>
        {{ classInfo.classAdminName || '无' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          班级人数
        </template>
        教师: {{ classInfo.cntTeacher }} 人，学生: {{ classInfo.cntStudent }} 人，家长: {{ classInfo.cntParent }} 人
      </el-descriptions-item>
    </el-descriptions>
    <div v-permission="permission.edit" class="pane-footer">
      <el-button type="primary" size="small" icon="el-icon-edit" @click.stop="crud.toEdit(classInfo)">修改</el-button>
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
  </div>
</template>

<script>
import { getSchoolGrades, updateClass } from '@/api/business/school'
import { registerFunc, CLASS_MODE } from '@/utils/constants'
import CRUD, { presenter, form, crud } from '@crud/crudDetail'

const defaultForm = { id: null, name: null, area: [], property: 0, idCode: null, mode: null, modes: undefined }
export default {
  name: 'InfoPane',
  components: {},
  cruds() {
    return CRUD({ title: '班级', url: 'ljadmin/class/getClassInfo', crudMethod: { edit: updateClass } })
  },
  mixins: [presenter(), form(defaultForm), crud()],
  data() {
    return {
      classId: this.$route.params.classId,
      classInfo: null,
      schoolGrades: registerFunc([]),
      classModes: CLASS_MODE,
      permission: {
        edit: ['admin', 'class:edit']
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
  computed: {},
  mounted() {},
  methods: {
    // 刷新前做的操作
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, id: this.classId }
      return true
    },
    // 刷新后做的操作
    [CRUD.HOOK.afterRefresh](curd) {
      this.classInfo = curd.data
      this.getSchoolGrades(this.classInfo.schoolId)
      this.$eventBus.$emit('classInfoChange', this.classInfo)
      return true
    },
    // 编辑前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {},
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      return true
    },
    getSchoolGrades(schoolId) {
      getSchoolGrades(schoolId).then(res => {
        this.schoolGrades = registerFunc(res)
        this.$emit('schoolGradesChange', this.schoolGrades)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss"></style>
