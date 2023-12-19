<template>
  <el-select v-model="selected" :clearable="clearable" :placeholder="placeholder">
    <el-option v-for="opt in deviceTypes" :key="opt.id" :label="opt.name" :value="opt.id" />
  </el-select>
</template>

<script>
export default {
  name: 'DeviceTypeSelect',
  props: {
    value: { type: Number, default: () => undefined },
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: '请选择设备类型' }
  },
  data() {
    return {
      selected: undefined
    }
  },
  computed: {
    deviceTypes() {
      return this.$store.state.baseInfo.deviceTypes
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
      }
    }
  }
}
</script>

<style></style>
