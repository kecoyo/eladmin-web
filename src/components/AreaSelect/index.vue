<template>
  <el-cascader :options="allAreas" :props="props2" />
</template>

<script>
import { Cascader } from 'element-ui'
export default {
  name: 'AreaSelect',
  mixins: [Cascader],
  props: {
    placeholder: { type: String, default: '请选择区域' }
  },
  data() {
    return {
      props2: { value: 'id', label: 'name', children: 'children' }
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
