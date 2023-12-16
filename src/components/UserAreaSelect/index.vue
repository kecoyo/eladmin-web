<template>
  <el-cascader v-model="selected" :options="allAreas" :props="areaProps" :clearable="clearable" :placeholder="placeholder" @change="handleChange" />
</template>

<script>
export default {
  name: 'UserAreaSelect',
  props: {
    value: { type: Array, default: () => [] },
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: '请选择区域' }
  },
  data() {
    return {
      areaProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true
      },
      selected: []
    }
  },
  computed: {
    allAreas() {
      return this.$store.state.baseInfo.allAreas
    }
  },
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style></style>
