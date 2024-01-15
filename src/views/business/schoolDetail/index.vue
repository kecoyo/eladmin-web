<template>
  <div class="app-container">
    <h2 class="page-header"><i class="el-icon-school" /> 学校：{{ schoolInfo?.name }}</h2>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="info">
        <InfoPane />
      </el-tab-pane>
      <el-tab-pane label="教师管理" name="teacher">
        <TeacherPane />
      </el-tab-pane>
      <el-tab-pane label="班级管理" name="class">
        <ClassPane />
      </el-tab-pane>
      <el-tab-pane label="学科管理" name="subject">
        <SubjectPane />
      </el-tab-pane>
      <el-tab-pane label="学校管理员" name="schoolAdmin">
        <SchoolAdminPane />
      </el-tab-pane>
      <el-tab-pane label="年级管理员" name="gradeAdmin">
        <GradeAdminPane />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InfoPane from './InfoPane'
import TeacherPane from './TeacherPane'
import ClassPane from './ClassPane'
import SubjectPane from './SubjectPane'
import GradeAdminPane from './GradeAdminPane'
import SchoolAdminPane from './SchoolAdminPane'

export default {
  name: 'SchoolDetail',
  components: { InfoPane, TeacherPane, ClassPane, SubjectPane, GradeAdminPane, SchoolAdminPane },
  data() {
    return {
      activeTab: 'info',
      schoolInfo: null
    }
  },
  mounted() {
    this.$eventBus.$on('schoolInfoChange', schoolInfo => {
      this.schoolInfo = schoolInfo
    })
  },
  beforeDestroy() {
    this.$eventBus.$off('schoolInfoChange')
  },
  methods: {
    handleTabClick(tab, event) {
      this.activeTab = tab.name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
