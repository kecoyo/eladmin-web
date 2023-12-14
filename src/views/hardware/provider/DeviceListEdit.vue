<template>
  <el-container direction="vertical">
    <el-row v-for="(item, index) in value" :key="index" :gutter="10">
      <el-col :span="10">
        <el-select v-model="item.deviceType" placeholder="请选择活动区域">
          <el-option v-for="opt in options" :key="opt.id" :label="opt.name" :value="opt.id" />
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-input v-model="item.deviceMode" placeholder="设备型号" />
      </el-col>
      <el-col :span="4">
        <el-button type="text" :disabled="value.length === 1" @click="delItem(item, index)">删除</el-button>
      </el-col>
    </el-row>
    <div><el-button type="text" icon="el-icon-plus" @click="addItem">添加</el-button></div>
  </el-container>
</template>

<script>
export default {
  name: 'DeviceListEdit',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [
        { id: 1, name: '智慧班牌' }, //
        { id: 2, name: '出入终端' },
        { id: 3, name: '宿舍终端' },
        { id: 4, name: '电子大屏' },
        { id: 5, name: '智慧黑板' }
      ]
    }
  },
  methods: {
    addItem() {
      this.value.push({ deviceType: this.options[0].id, deviceMode: '' })
      this.handleChange()
    },
    delItem(item, index) {
      if (this.value.length === 1) return
      this.value.splice(index, 1)
      this.handleChange()
    },
    handleChange() {
      // this.$emit('input', this.list)
    }
  }
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
