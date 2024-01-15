<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <el-input v-model="query.userKey" clearable placeholder="输入教师ID/名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
      <rrOperation />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" :selectable="checkSelectable" :disabled="checkSelectable" width="55" />
      <el-table-column prop="id" label="教师ID" />
      <el-table-column prop="name" label="教师名称" />
      <el-table-column prop="phone" label="账号" />
      <el-table-column label="是否已选">
        <template slot-scope="scope">
          <el-tag v-if="selectedIds.includes(scope.row.id)">已选</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { addTeacher, updateTeacher, deleteTeacher } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud2'
import rrOperation from '@crud/RR.operation2'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, gender: 1, idCard: null, phone: null }
export default {
  name: 'SchoolTeacherSelect',
  components: { pagination, rrOperation },
  cruds() {
    return CRUD({
      title: '教师',
      url: 'ljadmin/school/queryTeacher',
      delParams: {},
      crudMethod: {
        add: addTeacher,
        edit: updateTeacher,
        del: deleteTeacher
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    value: { type: Array, default: () => undefined },
    schoolId: { type: Number, default: undefined },
    selectedIds: { type: Array, default: () => [] }
  },
  data() {
    return {}
  },
  watch: {
    'crud.selections'(val) {
      this.$emit('input', val.map(e => e.id))
    }
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      curd.query = { ...curd.query, ...this.query, schoolId: this.schoolId }
      return true
    },
    checkSelectable(row, index) {
      return !this.selectedIds.includes(row.id)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
