<template>
  <div class="app-container">
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
    </el-tabs>
  </div>
</template>

<script>
import InfoPane from './InfoPane'
import TeacherPane from './TeacherPane'
import ClassPane from './ClassPane'
import SubjectPane from './SubjectPane'

export default {
  name: 'SchoolDetail',
  components: { InfoPane, TeacherPane, ClassPane, SubjectPane },
  data() {
    return {
      activeTab: 'info'
    }
  },
  computed: {},
  created() {},
  methods: {
    handleTabClick(tab, event) {
      this.activeTab = tab.name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
