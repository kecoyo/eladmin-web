import request from '@/utils/request'

export function getClassInfo(id) {
  return request({
    url: 'ljadmin/class/getClassInfo',
    method: 'get',
    params: { id }
  })
}

export function addTeacher(data) {
  return request({
    url: 'ljadmin/class/addTeacher',
    method: 'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url: 'ljadmin/class/updateTeacher',
    method: 'post',
    data
  })
}

export function deleteTeacher(ids, delParams) {
  return request({
    url: 'ljadmin/class/deleteTeacher',
    method: 'post',
    data: { ...delParams, ids }
  })
}

export function addStudent(data) {
  return request({
    url: 'ljadmin/class/addStudent',
    method: 'post',
    data
  })
}

export function updateStudent(data) {
  return request({
    url: 'ljadmin/class/updateStudent',
    method: 'post',
    data
  })
}

export function deleteStudent(ids, delParams) {
  return request({
    url: 'ljadmin/class/deleteStudent',
    method: 'post',
    data: { ...delParams, ids }
  })
}

export function setClassAdmin(data) {
  return request({
    url: 'ljadmin/class/setClassAdmin',
    method: 'post',
    data
  })
}

export function cancelClassAdmin(data) {
  return request({
    url: 'ljadmin/class/cancelClassAdmin',
    method: 'post',
    data
  })
}
