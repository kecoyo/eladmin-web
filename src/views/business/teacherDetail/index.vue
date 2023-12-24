<template>
  <div class="app-container">
    <h2 class="page-header"><i class="el-icon-user" /> 教师：{{ teacherInfo?.name }}</h2>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="info">
        <InfoPane />
      </el-tab-pane>
      <el-tab-pane label="业务记录" name="teacher">
        <LogPane />
      </el-tab-pane>
      <el-tab-pane label="教学足迹" name="footprint">
        <Footprint />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InfoPane from './InfoPane'
import LogPane from './LogPane'
import Footprint from './Footprint'

export default {
  name: 'SchoolDetail',
  components: { InfoPane, LogPane, Footprint },
  data() {
    return {
      activeTab: 'info',
      teacherInfo: null
    }
  },
  mounted() {
    this.$eventBus.$on('teacherInfoChange', teacherInfo => {
      this.teacherInfo = teacherInfo
    })
  },
  beforeDestroy() {
    this.$eventBus.$off('teacherInfoChange')
  },
  methods: {
    handleTabClick(tab, event) {
      this.activeTab = tab.name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
