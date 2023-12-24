<template>
  <div class="pane-container">
    <div class="pane-header">
      开发中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footprint',
  data() {
    return {
      teacherId: Number(this.$route.params.teacherId)
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
