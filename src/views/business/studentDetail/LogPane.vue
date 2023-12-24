<template>
  <div class="pane-container">
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="phone" label="时间" />
      <el-table-column prop="phone" label="对象" />
      <el-table-column prop="phone" label="动作" />
      <el-table-column prop="phone" label="结果" />
      <el-table-column prop="phone" label="操作人" />
      <el-table-column prop="phone" label="操作人ID" />
      <el-table-column prop="phone" label="被操作人" />
      <el-table-column prop="phone" label="被操作人ID" />
      <el-table-column prop="phone" label="APP" />
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import pagination from '@crud/Pagination'

const defaultForm = { userId: null, userName: null, gender: 1, idCard: null, phone: null }
export default {
  name: 'LogPane',
  components: { pagination },
  cruds() {
    return CRUD({ title: '学生日志', idField: 'userId', url: 'ljadmin/student/queryLog' })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      studentId: Number(this.$route.params.studentId)
    }
  },
  computed: {},
  mounted() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
    this.crud.optShow.del = false
    this.crud.optShow.download = false
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, studentId: this.studentId }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
