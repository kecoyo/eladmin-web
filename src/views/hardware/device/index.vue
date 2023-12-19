<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <area-select v-model="area" check-strictly clearable placeholder="请选择区域" style="width: 250px" class="filter-item" @change="crud.toQuery" />
        <el-input v-model="query.schoolName" clearable placeholder="请输入学校名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.deviceCode" clearable placeholder="请输入设备编号" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.deviceName" clearable placeholder="请输入设备名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.provider" clearable placeholder="请输入设备厂商名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <device-type-select v-model="query.deviceType" clearable placeholder="请选择设备类型" style="width: 200px" class="filter-item" @change="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="form.deviceCode" style="width: 370px" disabled />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModels">
          <device-model-select v-model="form.deviceModels" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="UUID">
          <el-input v-model="form.uuid" style="width: 370px" disabled />
        </el-form-item>
        <el-form-item label="所在区域">
          <el-input v-model="form.showAreaName" style="width: 370px" disabled />
        </el-form-item>
        <el-form-item label="所在学校">
          <el-input v-model="form.showSchoolName" style="width: 370px" disabled />
        </el-form-item>
        <el-form-item label="安装位置" prop="location">
          <el-input v-model="form.location" style="width: 370px" />
        </el-form-item>
        <el-form-item label="安装人员">
          <el-input v-model="form.showCreatorName" style="width: 370px" disabled />
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
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="uuid" label="UUID" width="150" />
      <el-table-column label="设备信息">
        <template slot-scope="scope">
          <div>
            <div>设备编号：{{ scope.row.deviceCode }}</div>
            <div>设备名称：{{ scope.row.deviceName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="网络状态">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.online" type="success">在线</el-tag>
          <el-tag v-else type="info">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="providerName" label="设备厂商" />
      <el-table-column prop="deviceType" label="设备类型">
        <template slot-scope="scope">
          {{ deviceTypesMap.getName(scope.row.deviceType) }}
        </template>
      </el-table-column>
      <el-table-column label="所在区域">
        <template slot-scope="scope">
          <span v-if="allAreasMap.getFullNames">
            {{ allAreasMap.getFullNames([scope.row.province, scope.row.city, scope.row.county]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="schoolName" label="所在学校" />
      <el-table-column label="绑定状态">
        <template slot-scope="scope">
          <el-tag v-if="[1, 2].includes(scope.row.deviceStatus)" type="success">已绑定</el-tag>
          <el-tag v-else type="info">未绑定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" style="margin-left: -1px" size="mini" @click="toGen(scope.row.tableName)">重启</el-button>
          <el-button type="text" style="margin-left: -1px" size="mini" @click="toGen(scope.row.tableName)">刷新</el-button> -->

          <!-- deviceStatus: 3-未绑定，其它-未绑定 -->
          <el-button v-if="scope.row.deviceStatus === 3" type="text" size="mini" style="margin-left: -1px">恢复</el-button>
          <el-button v-else type="text" size="mini" style="margin-left: -1px">解绑</el-button>

          <el-button :loading="crud.status.cu === 2" type="text" size="mini" style="margin-left: -1px" @click.stop="crud.toEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudDevice from '@/api/hardware/device'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import AreaSelect from '@/components/AreaSelect'
import DeviceTypeSelect from '@/components/DeviceTypeSelect'
import DeviceModelSelect from '@/components/DeviceModelSelect'

const defaultForm = { id: null, name: null, ip: null, port: 22, account: 'root', password: null }
export default {
  name: 'Device',
  components: { pagination, crudOperation, rrOperation, AreaSelect, DeviceTypeSelect, DeviceModelSelect },
  cruds() {
    return CRUD({ title: '设备', url: 'ljadmin/device', crudMethod: { ...crudDevice } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      area: [], // 区域
      loading: false,
      permission: {
        add: ['admin', 'device:add'],
        edit: ['admin', 'device:edit'],
        del: ['admin', 'device:del']
      },
      rules: {
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceModels: [{ required: true, message: '请选择设备型号', trigger: 'blur' }],
        location: [{ required: true, message: '请输入安装位置', trigger: 'blur' }]
      }
    }
  },
  computed: {
    allAreasMap() {
      return this.$store.state.baseInfo.allAreasMap
    },
    deviceTypesMap() {
      return this.$store.state.baseInfo.deviceTypesMap
    }
  },
  mounted() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
    this.crud.optShow.del = false
    this.crud.optShow.download = false
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      const [province, city, county] = this.area
      curd.query = { ...curd.query, ...this.query, province, city, county }
      return true
    },
    // 初始化编辑时的表单数据
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // 初始化区域选择器
      if (crud.form.province) {
        crud.form.showAreaName = this.allAreasMap.getFullNames([crud.form.province, crud.form.city, crud.form.county])
      }
      if (crud.form.creator) {
        crud.form.showCreatorName = `${crud.form.creator}（${crud.form.createdBy}）`
      }
      if (crud.form.schoolId) {
        crud.form.showSchoolName = `${crud.form.schoolName}（${crud.form.schoolId}）`
      }
      if (crud.form.hardwareProvider && crud.form.deviceType && crud.form.providerDeviceID) {
        crud.form.deviceModels = [crud.form.hardwareProvider, crud.form.deviceType, crud.form.providerDeviceID]
      }
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      delete this.form.showAreaName
      delete this.form.showCreatorName
      delete this.form.showSchoolName
      this.form.deviceModeID = this.form.deviceModels[2]
      delete this.form.deviceModels
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
