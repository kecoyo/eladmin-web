<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-cascader v-model="query.area" :options="allAreas" :props="areaProps" clearable placeholder="选择区域" style="width: 300px" class="filter-item" @change="crud.toQuery" />
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
          <el-cascader v-model="form.area" :options="allAreas" :props="areaProps" style="width: 370px" />
        </el-form-item>
        <el-form-item label="联系人" prop="liaison">
          <el-input v-model="form.liaison" style="width: 370px" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width: 370px" />
        </el-form-item>
        <el-form-item label="设备信息" prop="devices">
          <device-list-edit v-model="form.devices" style="width: 450px" />
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
      <el-table-column v-if="checkPer(['admin', 'provider:edit', 'provider:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
import crudProvider from '@/api/hardware/provider'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DeviceListEdit from './DeviceListEdit'

const defaultForm = { id: null, name: null, province: null, city: null, county: null, area: null, liaison: null, phone: null, devices: null }
export default {
  name: 'Provider',
  components: { crudOperation, rrOperation, udOperation, DeviceListEdit },
  cruds() {
    return CRUD({ title: '供应商', url: 'ljadmin/provider', crudMethod: { ...crudProvider } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      areaProps: { value: 'id', label: 'name', children: 'children' },
      loading: false,
      permission: {
        add: ['admin', 'provider:add'],
        edit: ['admin', 'provider:edit'],
        del: ['admin', 'provider:del']
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        area: [{ required: true, message: '请选择所属区域', trigger: 'blur' }],
        liaison: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        devices: [
          { required: true, message: '请添加设备信息', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 不能为空
              if (value.filter(val => val.deviceMode === '').length > 0) {
                callback(new Error('设备型号不能为空'))
                return
              }

              // 不能重复
              if (_.uniq(value.map(val => val.deviceMode + '-' + val.deviceType)).length < value.length) {
                callback(new Error('设备类型+设备型号不能重复'))
                return
              }

              callback()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    allAreas() {
      return this.$store.state.baseInfo.allAreas
    },
    allDeviceTypes() {
      return this.$store.state.baseInfo.allDeviceTypes
    }
  },
  created() {
    this.crud.optShow.download = false
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      console.log('🚀 ~ file: index.vue:149 ~ query:', curd)
      this.selectIndex = ''
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      const area = []
      if (form.province) area.push(form.province)
      if (form.city) area.push(form.city)
      if (form.county) area.push(form.county)
      this.form.area = area

      // 设备信息为空时，添加一条
      if (!form.devices || form.devices.length === 0) {
        this.form.devices = [{ deviceType: this.allDeviceTypes[0].id, deviceMode: '' }]
      }
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
