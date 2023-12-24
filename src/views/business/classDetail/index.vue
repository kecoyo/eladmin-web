<template>
  <div class="app-container">
    <div class="page-header"><i class="el-icon-collection" /> 班级：{{ classInfo?.name }}</div>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="info">
        <InfoPane />
      </el-tab-pane>
      <el-tab-pane label="教师管理" name="teacher">
        <TeacherPane />
      </el-tab-pane>
      <el-tab-pane label="学生管理" name="class">
        <StudentPane />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InfoPane from './InfoPane'
import TeacherPane from './TeacherPane'
import StudentPane from './StudentPane'

export default {
  name: 'ClassDetail',
  components: { InfoPane, TeacherPane, StudentPane },
  data() {
    return {
      activeTab: 'info',
      classInfo: null
    }
  },
  mounted() {
    this.$eventBus.$on('classInfoChange', classInfo => {
      this.classInfo = classInfo
    })
  },
  beforeDestroy() {
    this.$eventBus.$off('classInfoChange')
  },
  methods: {
    handleTabClick(tab, event) {
      this.activeTab = tab.name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
