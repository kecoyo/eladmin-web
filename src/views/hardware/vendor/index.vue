<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable placeholder="输入名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-cascader v-model="form.area" :options="options" style="width: 370px" />
        </el-form-item>
        <el-form-item label="联系人" prop="liaison">
          <el-input v-model="form.liaison" style="width: 370px" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width: 370px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="province" label="所属区域" />
      <el-table-column prop="liaison" label="联系人" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column v-if="checkPer(['admin', 'vendor:edit', 'vendor:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudVendor from '@/api/hardware/vendor'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = { id: null, name: null, province: null, city: null, county: null, area: null, liaison: null, phone: null }
export default {
  name: 'Vendor',
  components: { crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ title: '合作伙伴', url: 'ljadmin/vendor', crudMethod: { ...crudVendor } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      accountList: [],
      accountMap: {},
      loading: false,
      permission: {
        add: ['admin', 'vendor:add'],
        edit: ['admin', 'vendor:edit'],
        del: ['admin', 'vendor:del']
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        area: [{ required: true, message: '请选择所属区域', trigger: 'blur' }],
        liaison: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      options: [
        {
          value: 130000,
          label: '河北省',
          children: [
            {
              value: 130100,
              label: '石家庄市',
              children: [
                {
                  value: 130102,
                  label: '长安区'
                },
                {
                  value: 130104,
                  label: '桥西区'
                },
                {
                  value: 130105,
                  label: '新华区'
                },
                {
                  value: 130107,
                  label: '井陉矿区'
                }
              ]
            },
            {
              value: 130200,
              label: '唐山市',
              children: [
                {
                  value: 130202,
                  label: '路南区'
                },
                {
                  value: 130203,
                  label: '路北区'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  created() {
    this.crud.optShow.download = false
  },
  methods: {
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      const area = []
      if (form.province) area.push(form.province)
      if (form.city) area.push(form.city)
      if (form.county) area.push(form.county)
      this.form.area = area
      console.log('🚀 ~ file: index.vue:140 ~ this.form.area:', this.form.area)
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      const [province, city, county] = this.form.area
      this.form.province = province
      this.form.city = city
      this.form.county = county
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
