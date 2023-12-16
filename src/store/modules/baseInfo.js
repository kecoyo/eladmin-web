import { getAllAreas, getDeviceTypes } from '@/api/baseInfo'

const state = {
  // 所有区域
  allAreas: [],
  // 所有区域Map
  allAreasMap: {},
  // 设备类型
  deviceTypes: [],
  // 设备类型Map
  deviceTypesMap: {}
}

const mutations = {
  CHANGE_BASE_INFO: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  getAllAreas({ commit }) {
    return new Promise((resolve, reject) => {
      getAllAreas()
        .then(res => {
          const list = []
          const map = {}

          res.forEach(area => {
            if (area.type === 1) {
              // 省
              area.children = []
              list.push(area)
            } else if (area.type === 2) {
              // 市
              area.children = []
              map[area.province].children.push(area)
            } else {
              // 区
              map[area.city].children.push(area)
            }
            map[area.id] = area
          })

          // 获取区域名称
          map.getName = function(id) {
            const area = this[id]
            if (area) {
              return area.name
            }
            return ''
          }

          // 获取区域名称
          map.getFullName = function(id, separator = ' / ') {
            const names = []
            const area = this[id]
            if (area) {
              if (area.type === 1) {
                names.push(this.name)
              } else if (area.type === 2) {
                const province = this[area.province]
                names.push(province.name)
                names.push(this.name)
              } else {
                const province = this[area.province]
                names.push(province.name)
                const city = this[area.city]
                names.push(city.name)
                names.push(this.name)
              }
            }
            return names.join(separator)
          }

          // 获取区域名称
          map.getFullNames = function(ids, separator = ' / ') {
            const names = []
            ids.forEach(id => {
              const area = this[id]
              if (area) {
                names.push(area.name)
              }
            })
            return names.join(separator)
          }

          commit('CHANGE_BASE_INFO', { key: 'allAreas', value: list })
          commit('CHANGE_BASE_INFO', { key: 'allAreasMap', value: map })
          resolve(list)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDeviceTypes({ commit }) {
    return new Promise((resolve, reject) => {
      getDeviceTypes()
        .then(res => {
          const map = {}
          res.forEach(item => {
            map[item.id] = item
          })

          // 获取设备类型名称
          map.getName = function(id) {
            const deviceType = this[id]
            if (deviceType) {
              return deviceType.name
            }
            return ''
          }

          commit('CHANGE_BASE_INFO', { key: 'deviceTypes', value: res })
          commit('CHANGE_BASE_INFO', { key: 'deviceTypesMap', value: map })
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
