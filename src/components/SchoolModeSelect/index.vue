<template>
  <el-container direction="vertical">
    <el-row v-for="(item, index) in stages" :key="index" :gutter="10">
      <el-col :span="8">
        <el-checkbox v-model="selected[index].checked" :value="item.id">{{ item.name }}</el-checkbox>
      </el-col>
      <el-col :span="8">
        <el-select v-model="selected[index].year" placeholder="请选择年制">
          <el-option v-for="opt in item.years" :key="opt.id" :label="opt.name" :value="opt.id" />
        </el-select>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import { STAGES } from '@/utils/constants'

export default {
  name: 'SchoolModeSelect',
  props: {
    value: {
      type: Array,
      default: () => STAGES.map(item => ({ checked: false, id: item.id, phase: item.phase, year: item.years[0].id }))
    }
  },
  data() {
    return {
      stages: STAGES,
      selected: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selected = val
      },
      immediate: true
    },
    selected: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
