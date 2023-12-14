import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'ljadmin/provider',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'ljadmin/provider',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'ljadmin/provider',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }
