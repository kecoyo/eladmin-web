<template>
  <el-cascader v-model="selected" :options="userAreas" :props="areaProps" :clearable="clearable" :placeholder="placeholder" @change="handleChange" />
</template>

<script>
export default {
  name: 'MultiAreaSelect',
  props: {
    value: { type: Array, default: () => [] },
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: '请选择区域' }
  },
  data() {
    return {
      areaProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        multiple: true,
        checkStrictly: true
      },
      selected: []
    }
  },
  computed: {
    userAreas() {
      const allAreas = this.$store.state.baseInfo.allAreas
      const allAreasMap = this.$store.state.baseInfo.allAreasMap
      const oldUserAreas = this.$store.state.user.user.userAreas
      const dataScope = this.$store.state.user.user.roles[0].dataScope

      if (Object.keys(allAreasMap).length === 0) {
        return []
      }

      if (dataScope === '全部') {
        return allAreas
      }

      const userAreas = []
      const userAreasMap = {}

      const getProvince = provinceId => {
        if (!userAreasMap[provinceId]) {
          const province = { ...allAreasMap[provinceId], children: [], disabled: true }
          userAreasMap[provinceId] = province
          userAreas.push(province)
        }
        return userAreasMap[provinceId]
      }

      const getCity = (provinceId, cityId) => {
        if (!userAreasMap[cityId]) {
          const city = { ...allAreasMap[cityId], children: [], disabled: true }
          userAreasMap[cityId] = city
          const province = getProvince(provinceId)
          province.children.push(city)
        }
        return userAreasMap[cityId]
      }

      for (const userArea of oldUserAreas) {
        if (userArea.county) {
          const countyArea = allAreasMap[userArea.county]
          const cityArea = getCity(userArea.province, userArea.city)
          cityArea.children.push(countyArea)
        } else if (userArea.city) {
          const cityArea = allAreasMap[userArea.city]
          const provinceArea = getProvince(userArea.province)
          provinceArea.children.push(cityArea)
        } else if (userArea.province) {
          const provinceArea = allAreasMap[userArea.province]
          userAreas.push(provinceArea)
        }
      }

      return userAreas.length === 0 ? allAreas : userAreas
    }
  },
  watch: {
    value: {
      handler(value) {
        this.selected = value
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleChange(value) {
      let areaStrs = []

      for (let i = 0; i < value.length; i++) {
        const area = value[i]
        if (area.length === 1) {
          areaStrs.push(area.join('-'))
        } else if (area.length === 2) {
          if (areaStrs.includes([area[0]].join('-'))) {
            this.$message.error('不能同时选择省和该省下的城市')
          } else {
            areaStrs.push(area.join('-'))
          }
        } else if (area.length === 3) {
          if (areaStrs.includes([area[0]].join('-'))) {
            this.$message.error('不能同时选择省和该省下的城市')
          } else if (areaStrs.includes([area[0], area[1]].join('-'))) {
            this.$message.error('不能同时选择市和该市下的区县')
          } else {
            areaStrs.push(area.join('-'))
          }
        }
      }

      areaStrs = areaStrs.map(areaStr => areaStr.split('-').map(Number))

      this.$emit('input', areaStrs)
    }
  }
}
</script>

<style></style>
