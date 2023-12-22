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
        <div slot="left" class="button-wrapper">
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="toAdd">
            创建学校
          </el-button>
        </div>
        <div slot="right" class="school-stat-info">
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
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-input v-model="form.schoolId" type="hidden" />
        <el-form-item label="预设班牌数量" prop="expectCard">
          <el-input-number v-model.number="form.expectCard" controls-position="right" style="width: 230px;" />
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
      <el-table-column prop="name" label="学校名称" />
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
      <el-table-column v-if="checkPer(['admin', 'school:edit', 'school:del'])" label="操作" width="150px" align="center">
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
import crudSchool from '@/api/business/school'
import { getSchoolExtendStat } from '@/api/business/school'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import AreaSelect from '@/components/AreaSelect'

const defaultForm = { schoolId: null, expectCard: null }
export default {
  name: 'School',
  components: { pagination, crudOperation, rrOperation, udOperation, AreaSelect },
  cruds() {
    return CRUD({ title: '学校', url: 'ljadmin/school/querySchool', crudMethod: { ...crudSchool } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      loading: false,
      area: [],
      permission: {
        add: ['admin', 'school:add'],
        edit: ['admin', 'school:edit'],
        del: ['admin', 'school:del']
      },
      rules: {
        expectCard: [{ required: true, message: '请输入预设班牌数量', trigger: 'blur', type: 'number' }]
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
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
    this.crud.optShow.del = false
    this.crud.optShow.download = false
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](curd) {
      const [province, city, county] = this.area
      curd.query = { ...curd.query, ...this.query, province, city, county }

      //  获取学校扩展信息
      this.getSchoolExtendStat(curd.query)

      return true
    },
    toAdd(school) {
      this.$router.push({
        path: '/business/school/add',
        query: {
          title: school.name
        }
      })
    },
    getSchoolExtendStat(params) {
      getSchoolExtendStat(params).then(res => {
        this.schoolStat = res
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.button-wrapper {
  display: inline-flex;
}
.school-stat-info {
  display: inline-flex;
  font-size: 14px;
  margin-left: 20px;

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
