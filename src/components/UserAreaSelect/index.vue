<template>
  <el-cascader v-model="selected" :options="allAreas" :props="areaProps" :clearable="clearable" :placeholder="placeholder" @change="handleChange" />
</template>

<script>
export default {
  name: 'UserAreaSelect',
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
        checkStrictly: true
      },
      selected: []
    }
  },
  computed: {
    allAreas() {
      const allAreasMap = this.$store.state.baseInfo.allAreasMap
      const userArea = JSON.parse(this.$store.state.user.user.userArea)

      if (Object.keys(allAreasMap).length === 0) {
        return []
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

      for (const area of userArea) {
        if (area.length === 1) {
          const province = allAreasMap[area[0]]
          userAreas.push(province)
        } else if (area.length === 2) {
          const city = allAreasMap[area[1]]
          const province = getProvince(area[0])
          province.children.push(city)
        } else if (area.length === 3) {
          const county = allAreasMap[area[2]]
          const city = getCity(area[0], area[1])
          city.children.push(county)
        }
      }

      return userAreas
    }
  },
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style></style>
