<template>
  <div>
    <area-select v-model="selected.area" clearable placeholder="请选择区域" @input="handleAreaChange" />
    <stage-select v-model="selected.stageId" clearable placeholder="请选择学段" style="width: 100px" @input="handleStageIdChange" />
    <el-select v-model="selected.schoolId" clearable placeholder="请选择学校" @change="handleSchoolIdChange">
      <el-option v-for="opt in schools" :key="opt.id" :label="opt.name" :value="opt.id" />
    </el-select>
  </div>
</template>

<script>
import AreaSelect from '@/components/AreaSelect'
import StageSelect from '@/components/StageSelect'
export default {
  name: 'AreaSchoolSelect',
  components: { AreaSelect, StageSelect },
  props: {
    value: { type: Array, default: () => undefined }
  },
  data() {
    return {
      schools: [],
      selected: { area: undefined, stageId: undefined, schoolId: undefined }
    }
  },
  methods: {
    // handleAreaChange(value) {
    //   console.log('🚀 ~ file: index.vue:27 ~ handleAreaChange ~ value:', value)
    //   this.getSchools()
    // },
    // handleStageIdChange(value) {
    //   console.log('🚀 ~ file: index.vue:27 ~ handleAreaChange ~ value:', value)
    //   this.getSchools()
    // },
    // handleSchoolIdChange(value) {
    //   console.log('🚀 ~ file: index.vue:27 ~ handleAreaChange ~ value:', value)
    // },
    // async getSchools() {
    //   console.log('🚀 ~ file: index.vue:40 ~ getSchools ~ this:', this)
    //   const { data } = await this.$api.school.getSchools({ area: this.selected.area, stageId: this.selected.stageId })
    //   this.schools = data
    // }
  }
}
</script>

<style></style>
