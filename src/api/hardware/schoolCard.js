import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'ljadmin/schoolCard',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'ljadmin/schoolCard',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'ljadmin/schoolCard',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }
