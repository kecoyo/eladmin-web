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

export default { add, edit, del }
