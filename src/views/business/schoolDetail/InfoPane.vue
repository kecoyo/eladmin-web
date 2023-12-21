<template>
  <div class="pane-container">
    <el-descriptions v-if="schoolInfo" class="margin-top" :column="1" size="medium" border label-class-name="descriptions-label">
      <el-descriptions-item>
        <template slot="label">
          学校ID
        </template>
        {{ schoolInfo.id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          学校名称
        </template>
        {{ schoolInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          所属区域
        </template>
        {{ allAreasMap?.getFullNames([schoolInfo.province, schoolInfo.city, schoolInfo.county]) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          学校属性
        </template>
        {{ schoolPropertyList.getName(schoolInfo.property) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          识别码
        </template>
        {{ schoolInfo.idCode || '-' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          学校类型
        </template>
        <el-tag v-for="tag in schoolModes" :key="tag.id">
          {{ tag.name }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <div class="pane-footer">
      <el-button type="primary" size="small" icon="el-icon-edit" @click.stop="toEdit">修改</el-button>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelEdit" :visible.sync="status.cu > 0" :title="status.title" width="700px">
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
        <el-button type="text" @click="cancelEdit">取消</el-button>
        <el-button :loading="status.cu === 2" type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudSchool from '@/api/business/school'
import { getSchoolInfo } from '@/api/business/school'
import { SCHOOL_PROPERTY, PHASE_TYPE } from '@/utils/constants'
import AreaSelect from '@/components/AreaSelect'
import SchoolModeSelect from '@/components/SchoolModeSelect'
import { STAGES } from '@/utils/constants'

const defaultForm = { id: null, name: null, area: [], property: 0, idCode: null, mode: null, modes: [] }
export default {
  components: { AreaSelect, SchoolModeSelect },
  data() {
    return {
      id: this.$route.params.schoolId,
      schoolInfo: null,
      schoolModes: [],
      schoolPropertyList: SCHOOL_PROPERTY,
      form: { ...defaultForm },
      status: {
        cu: 0,
        title: '修改学校信息'
      },
      permission: {
        add: ['admin', 'school:add'],
        edit: ['admin', 'school:edit'],
        del: ['admin', 'school:del']
      },
      rules: {
        name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
        area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        modes: [{ required: true, message: '请输入学校类型', trigger: 'blur' }]
      }
    }
  },
  computed: {
    allAreasMap() {
      return this.$store.state.baseInfo.allAreasMap
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    // 刷新学校信息
    refresh() {
      getSchoolInfo(this.id).then(res => {
        this.schoolInfo = res
        const modes = JSON.parse(res.mode)
        this.schoolModes = Object.keys(modes).map(key => {
          return { id: key, name: `${PHASE_TYPE.getName(key, ['key'])} - ${modes[key]}年` }
        })
      })
    },
    // 编辑前做的操作
    beforeToEdit(form) {
      const area = []
      if (form.province) area.push(form.province)
      if (form.city) area.push(form.city)
      if (form.county) area.push(form.county)
      this.form.area = area

      this.form.property = Number(this.form.property || 0)

      const mode = JSON.parse(this.form.mode)
      this.form.modes = STAGES.map(item => ({
        checked: !!mode[item.phase],
        id: item.id,
        phase: item.phase,
        year: mode[item.phase] || item.years[0].id
      }))
    },
    // 提交前做的操作
    beforeSubmit() {
      const [province, city, county] = this.form.area
      this.form.province = province
      this.form.city = city
      this.form.county = county

      // 学校类型
      this.form.schoolModes = this.form.modes.filter(item => item.checked)

      return true
    },
    toEdit() {
      this.status.cu = 1
      this.form = { ...this.schoolInfo }
      this.beforeToEdit(this.form)
    },
    cancelEdit() {
      this.status.cu = 0
      this.form = { ...defaultForm }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid && this.beforeSubmit()) {
          this.status.cu = 2
          crudSchool
            .edit(this.form)
            .then(() => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.status.cu = 0
              this.refresh()
            })
            .finally(() => {
              this.status.cu = 0
            })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.pane-container {
  padding: 20px;

  .descriptions-label {
    width: 200px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .el-tag {
    height: 32px;
    line-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.pane-footer {
  padding-top: 20px;
}
</style>
