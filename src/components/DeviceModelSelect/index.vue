<template>
  <el-cascader v-model="selected" :options="deviceModels" :props="deviceModelProps" :clearable="clearable" :placeholder="placeholder" />
</template>

<script>
export default {
  name: 'DeviceModelSelect',
  props: {
    value: { type: Array, default: () => [] },
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: '请选择区域' }
  },
  data() {
    return {
      deviceModelProps: { value: 'id', label: 'name', children: 'children' },
      selected: []
    }
  },
  computed: {
    deviceModels() {
      return this.$store.state.baseInfo.deviceModels
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
  }
}
</script>

<style></style>
