import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'ljadmin/school/addTeacher',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'ljadmin/school/updateTeacher',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'ljadmin/school/removeTeacher',
    method: 'post',
    data
  })
}

export default { add, edit, del }
