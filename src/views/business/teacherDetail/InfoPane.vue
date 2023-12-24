<template>
  <div class="pane-container">
    <el-descriptions v-if="teacherInfo" class="margin-top" :column="1" size="medium" border label-class-name="descriptions-label">
      <el-descriptions-item>
        <template slot="label">
          教师ID
        </template>
        {{ teacherInfo.id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          教师名称
        </template>
        {{ teacherInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          性别
        </template>
        {{ GENDER.getName(teacherInfo.gender) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          手机号
        </template>
        {{ teacherInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          人脸识别图片
        </template>
        <el-image :src="teacherInfo.faceImg || defaultFaceImg" :fit="'fit'" :preview-src-list="[teacherInfo.faceImg || defaultFaceImg]" style="width: 100px; height: 100px" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          身份证号
        </template>
        {{ teacherInfo.idCard || '-' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          邮箱
        </template>
        {{ teacherInfo.email || '-' }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="pane-footer">
      <el-button type="primary" size="small" icon="el-icon-edit" @click.stop="crud.toEdit(teacherInfo)">修改</el-button>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-input v-model="form.id" type="hidden" />
        <el-form-item label="教师名称" prop="name">
          <el-input v-model="form.name" style="width: 75%" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width: 75%" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" style="width: 75%">
            <el-radio v-for="opt in GENDER" :key="opt.id" :label="opt.id">{{ opt.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" style="width: 75%" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" style="width: 75%" />
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
import { updateTeacher } from '@/api/business/teacher'
import { GENDER } from '@/utils/constants'
import CRUD, { crud, form, presenter } from '@crud/crudDetail'

const defaultForm = { id: null, name: null, phone: null, gender: 1, idCard: null, email: null, faceImg: null }
export default {
  name: 'InfoPane',
  components: {},
  cruds() {
    return CRUD({ title: '教师', url: 'ljadmin/teacher/getTeacherInfo', crudMethod: { edit: updateTeacher } })
  },
  mixins: [presenter(), form(defaultForm), crud()],
  data() {
    return {
      id: Number(this.$route.params.teacherId),
      teacherInfo: null,
      defaultFaceImg: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      GENDER,
      rules: {
        name: [{ required: true, message: '请输入教师名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        idCard: [{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    // 刷新前做的操作
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, id: this.id }

      return true
    },
    // 刷新后做的操作
    [CRUD.HOOK.afterRefresh](curd) {
      this.teacherInfo = curd.data
      this.$eventBus.$emit('teacherInfoChange', this.teacherInfo)

      return true
    },
    // 编辑前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.form.gender = Number(this.form.gender || 1)

      return true
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
