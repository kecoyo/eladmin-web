<template>
  <div class="app-container">
    <div class="header">
      已选择的学科
    </div>
    <div v-if="crud.data" class="subject-list">
      <el-tag v-for="item in crud.data" :key="item.subjectId" closable @close="handleDelete(item)">
        {{ item.subjectName }}
      </el-tag>
    </div>
    <div class="header">
      待加入的学科
    </div>
    <div v-if="noJoinSubjects" class="subject-list">
      <el-tag v-for="subject in noJoinSubjects" :key="subject.id" type="info">
        <a style="display: block;" @click="handleAdd(subject)"><i class="el-icon-plus" />&nbsp;&nbsp;{{ subject.name }}</a>
      </el-tag>
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
  </div>
</template>

<script>
import { addSubject, deleteSubject } from '@/api/business/school'
import { getSubjects } from '@/api/baseInfo'
import CRUD, { presenter, form, crud } from '@crud/crud2'

const defaultForm = { userId: null, userName: null, gender: 1, idCard: null, phone: null }
export default {
  name: 'SubjectPane',
  components: {},
  cruds() {
    return CRUD({ title: '学科', url: 'ljadmin/school/querySubject' })
  },
  mixins: [presenter(), form(defaultForm), crud()],
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      allSubjects: [],
      noJoinSubjects: [],
      rules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  mounted() {
    this.getAllSubjects()
  },
  methods: {
    // 刷新前做的操作
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, schoolId: this.schoolId }
      return true
    },
    [CRUD.HOOK.afterRefresh]() {
      this.refreshNoJoinSubjects()
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
    // 获取所有学科
    getAllSubjects() {
      getSubjects().then(res => {
        this.allSubjects = res
        this.refreshNoJoinSubjects()
      })
    },
    // 刷新未加入的学科
    refreshNoJoinSubjects() {
      if (this.crud.data?.length > 0) {
        this.noJoinSubjects = this.allSubjects.filter(item => {
          return !this.crud.data.some(subject => subject.subjectId === item.id)
        })
      }
    },
    // 删除学校学科
    handleDelete(item) {
      deleteSubject({ schoolId: this.schoolId, subjectId: item.subjectId }).then(res => {
        this.crud.delSuccessNotify()
        this.crud.refresh()
      })
    },
    // 添加学校学科
    handleAdd(subject) {
      addSubject({ schoolId: this.schoolId, subjectId: subject.id, subjectName: subject.name }).then(res => {
        this.crud.addSuccessNotify()
        this.crud.refresh()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  font-size: 18px;
  font-weight: 400;
  color: #1f2f3d;
  margin: 20px 0 20px 0;

  &:first-child {
    margin-top: 0px;
  }
}
.subject-list {
  display: flex;
  flex-wrap: wrap;
}

.el-tag {
  height: 32px;
  line-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-tag + .el-tag {
  margin-right: 10px;
}
</style>
