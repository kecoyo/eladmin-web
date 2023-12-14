import { getAllAreas, getAllDeviceTypes } from '@/api/baseInfo'

const state = {
  allAreas: [], // 所有区域
  allDeviceTypes: [] // 设备类型
}

const mutations = {
  SET_ALL_AREAS: (state, value) => {
    state['allAreas'] = value
  },
  SET_ALL_DEVICE_TYPES: (state, value) => {
    state['allDeviceTypes'] = value
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
              map[area.id] = area
            } else if (area.type === 2) {
              // 市
              area.children = []
              map[area.province].children.push(area)
              map[area.id] = area
            } else {
              // 区
              map[area.city].children.push(area)
            }
            map[area.id] = area
          })

          commit('SET_ALL_AREAS', list)
          resolve(list)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getAllDeviceTypes({ commit }) {
    return new Promise((resolve, reject) => {
      getAllDeviceTypes()
        .then(res => {
          commit('SET_ALL_DEVICE_TYPES', res)
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
