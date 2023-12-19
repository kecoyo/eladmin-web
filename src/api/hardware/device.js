import request from '@/utils/request'

export function edit(data) {
  return request({
    url: 'ljadmin/device',
    method: 'put',
    data
  })
}

export default { edit }
