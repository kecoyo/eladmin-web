<template>
  <el-cascader v-model="value" :options="allAreas" :props="props" :clearable="clearable" :placeholder="placeholder" @change="change" />
</template>

<script>
export default {
  props: {
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: '请选择' },
    value: { type: Array, default: () => [] },
    change: { type: Function, default: () => {} }
  },
  data() {
    return {
      props: { value: 'id', label: 'name', children: 'children' }
    }
  },
  computed: {
    allAreas() {
      return this.$store.state.baseInfo.allAreas
    }
  },
  methods: {}
}
</script>

<style></style>
