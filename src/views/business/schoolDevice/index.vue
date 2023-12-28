<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <area-select v-model="area" check-strictly clearable placeholder="请选择区域" style="width: 250px" class="filter-item" @change="crud.toQuery" />
        <el-input v-model="query.schoolId" clearable placeholder="输入学校ID" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.schoolName" clearable placeholder="输入学校名称" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <div slot="left" class="school-stat-info">
          <div>
            已开通学校数量：<b>{{ schoolStat.cntSchool }}</b> 个
          </div>
          <div>
            教师数量：<b>{{ schoolStat.cntTeacher }}</b> 个
          </div>
          <div>
            学生数量：<b>{{ schoolStat.cntStudent }}</b> 个
          </div>
          <div>
            家长数量：<b>{{ schoolStat.cntParent }}</b> 个
          </div>
        </div>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-input v-model="form.id" type="hidden" />
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="form.name" style="width: 75%" />
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <area-select v-model="form.area" check-strictly style="width: 75%" />
        </el-form-item>
        <el-form-item label="学校属性" prop="property">
          <el-radio-group v-model="form.property" style="width: 75%">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">省直属</el-radio>
            <el-radio :label="2">市直属</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="识别码" prop="idCode">
          <el-input v-model="form.idCode" style="width: 75%" />
        </el-form-item>
        <el-form-item label="学校类型" prop="modes">
          <school-mode-select v-model="form.modes" style="width: 75%" />
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
      <el-table-column prop="id" label="学校ID" width="90" />
      <el-table-column label="学校名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="所属区域">
        <template slot-scope="scope">
          {{ allAreasMap?.getFullNames([scope.row.province, scope.row.city, scope.row.county]) }}
        </template>
      </el-table-column>
      <el-table-column label="班级数量">
        <template slot-scope="scope">
          {{ scope.row.cntClass + scope.row.cntClass2 }}
        </template>
      </el-table-column>
      <el-table-column prop="cntTeacher" label="教师数量" />
      <el-table-column prop="cntDevice" label="设备数量" />
      <el-table-column v-if="checkPer(['admin', 'school:edit', 'school:del'])" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { getSchoolStat, addSchool, updateSchool, deleteSchool } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud2'
import rrOperation from '@crud/RR.operation2'
import crudOperation from '@crud/CRUD.operation2'
import udOperation from '@crud/UD.operation2'
import pagination from '@crud/Pagination'
import AreaSelect from '@/components/AreaSelect'
import SchoolModeSelect from '@/components/SchoolModeSelect'
import { PHASE_TYPE } from '@/utils/constants'

const defaultForm = { id: null, name: null, area: [], property: 0, idCode: null, schoolModes: [] }
export default {
  name: 'School',
  components: { pagination, crudOperation, rrOperation, udOperation, AreaSelect, SchoolModeSelect },
  cruds() {
    return CRUD({ title: '学校', url: 'ljadmin/school/querySchool', crudMethod: { add: addSchool, edit: updateSchool, del: deleteSchool } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      loading: false,
      area: [],
      permission: {
        view: ['admin', 'school:del']
      },
      rules: {
        name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
        area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        modes: [
          { required: true, message: '请选择学校类型', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.filter(item => item.checked).length === 0) {
                callback(new Error('学校类型不能为空'))
                return
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      schoolStat: {
        cntSchool: 0,
        cntTeacher: 0,
        cntStudent: 0,
        cntParent: 0
      }
    }
  },
  computed: {
    allAreasMap() {
      return this.$store.state.baseInfo.allAreasMap
    }
  },
  mounted() {
    // this.crud.optShow.add = false
    // this.crud.optShow.edit = false
    // this.crud.optShow.del = false
    // this.crud.optShow.download = false
  },
  methods: {
    // 刷新前做的操作
    [CRUD.HOOK.beforeRefresh](curd) {
      const [province, city, county] = this.area
      curd.query = { ...curd.query, ...this.query, province, city, county }

      //  获取学校扩展信息
      this.getSchoolStat(curd.query)

      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      const area = []
      if (form.province) area.push(form.province)
      if (form.city) area.push(form.city)
      if (form.county) area.push(form.county)
      this.form.area = area

      this.form.property = Number(this.form.property || 0)

      const mode = this.form.mode ? JSON.parse(this.form.mode) : {}
      this.form.modes = PHASE_TYPE.map(item => ({
        checked: !!mode[item.phase],
        id: item.id,
        phase: item.phase,
        year: mode[item.phase] || item.years[0].id
      }))
    },
    // 新增编辑提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      const [province, city, county] = this.form.area
      this.form.province = province
      this.form.city = city
      this.form.county = county

      // 学校类型
      this.form.schoolModes = this.form.modes.filter(item => item.checked)

      return true
    },
    // 查看前做的操作
    [CRUD.HOOK.beforeToView](crud, data) {
      this.$router.push({
        path: '/business/school/' + data.id,
        query: { title: data.name }
      })
    },
    getSchoolStat(params) {
      getSchoolStat(params).then(res => {
        this.schoolStat = res
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.school-stat-info {
  display: inline-flex;
  font-size: 14px;
  margin-left: 20px;
  vertical-align: top;
  margin-top: 8px;

  & > div {
    margin-left: 10px;
    color: #999;

    b {
      color: #333;
      font-weight: normal;
    }
  }
}
</style>
