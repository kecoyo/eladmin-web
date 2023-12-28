import request from '@/utils/request'

export function edit(data) {
  return request({
    url: 'ljadmin/device',
    method: 'put',
    data
  })
}

export function unbindDevice(data) {
  return request({
    url: 'ljadmin/device/unbindDevice',
    method: 'post',
    data
  })
}

export function rebindDevice(data) {
  return request({
    url: 'ljadmin/device/rebindDevice',
    method: 'post',
    data
  })
}

export default { edit, unbindDevice, rebindDevice }
