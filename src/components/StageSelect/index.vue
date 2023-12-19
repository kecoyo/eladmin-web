<template>
  <el-select v-model="selected" :clearable="clearable" :placeholder="placeholder">
    <el-option v-for="opt in stages" :key="opt.id" :label="opt.name" :value="opt.id" />
  </el-select>
</template>

<script>
export default {
  name: 'StageSelect',
  props: {
    value: { type: Number, default: () => undefined },
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: '请选择设备类型' },
    change: { type: Function, default: () => undefined }
  },
  data() {
    return {
      selected: undefined
    }
  },
  computed: {
    stages() {
      return [{ id: 1, name: '小学' }, { id: 2, name: '初中' }, { id: 3, name: '高中' }]
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
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style></style>
