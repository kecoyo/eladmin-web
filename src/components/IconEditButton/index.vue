<template>
  <el-button class="icon-edit-button" type="text" icon="el-icon-edit" size="medium" round @click.stop="handleEdit" />
</template>

<script>
export default {
  name: 'IconEditButton',
  data() {
    return {}
  },
  methods: {
    handleEdit() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-edit-button.el-button--medium.is-round {
  padding: 0 15px;

  i {
    padding: 0 0;
    font-size: 16px;
  }
}
</style>
