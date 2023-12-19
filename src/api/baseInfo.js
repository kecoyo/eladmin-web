import request from '@/utils/request'

export function getAllAreas() {
  return request({
    url: 'ljadmin/area/getAllAreaInfos',
    method: 'get'
  })
}

export function getDeviceTypes() {
  return request({
    url: 'ljadmin/device/getAllDeviceType',
    method: 'get'
  })
}

export function getDeviceModels() {
  return request({
    url: 'ljadmin/provider/getProviderDeviceDict',
    method: 'get'
  })
}
