import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'ljadmin/school/addSchool',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'ljadmin/school/updateSchool',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'ljadmin/school/deleteSchool',
    method: 'post',
    data: ids
  })
}

export function getSchoolExtendStat(params) {
  return request({
    url: 'ljadmin/school/getSchoolExtendStat',
    method: 'get',
    params
  })
}

export function getSchoolInfo(id) {
  return request({
    url: 'ljadmin/school/getSchoolInfo',
    method: 'get',
    params: { id }
  })
}

export function addTeacher(data) {
  return request({
    url: 'ljadmin/school/addTeacher',
    method: 'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url: 'ljadmin/school/updateTeacher',
    method: 'post',
    data
  })
}

export function deleteTeacher(ids, delParams) {
  return request({
    url: 'ljadmin/school/deleteTeacher',
    method: 'post',
    data: {
      ...delParams,
      ids
    }
  })
}

export function addSubject(data) {
  return request({
    url: 'ljadmin/school/addSubject',
    method: 'post',
    data
  })
}

export function deleteSubject(data) {
  return request({
    url: 'ljadmin/school/deleteSubject',
    method: 'post',
    data
  })
}

export default { add, edit, del }
