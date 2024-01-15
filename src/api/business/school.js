import request from '@/utils/request'

export function addSchool(data) {
  return request({
    url: 'ljadmin/school/addSchool',
    method: 'post',
    data
  })
}

export function updateSchool(data) {
  return request({
    url: 'ljadmin/school/updateSchool',
    method: 'post',
    data
  })
}

export function deleteSchool(ids) {
  return request({
    url: 'ljadmin/school/deleteSchool',
    method: 'post',
    data: ids
  })
}

export function getSchoolStat(params) {
  return request({
    url: 'ljadmin/school/getSchoolStat',
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

export function getSchoolGrades(schoolId) {
  return request({
    url: 'ljadmin/school/getSchoolGrades',
    method: 'get',
    params: { id: schoolId }
  })
}

export function addClass(data) {
  return request({
    url: 'ljadmin/school/addClass',
    method: 'post',
    data
  })
}

export function updateClass(data) {
  return request({
    url: 'ljadmin/school/updateClass',
    method: 'post',
    data
  })
}

export function deleteClass(ids, delParams) {
  return request({
    url: 'ljadmin/school/deleteClass',
    method: 'post',
    data: {
      ...delParams,
      ids
    }
  })
}

export function addSchoolAdmin(data) {
  return request({
    url: 'ljadmin/school/addSchoolAdmin',
    method: 'post',
    data
  })
}

export function deleteSchoolAdmin(ids, delParams) {
  return request({
    url: 'ljadmin/school/deleteSchoolAdmin',
    method: 'post',
    data: {
      ...delParams,
      ids
    }
  })
}

export function addGradeAdmin(data) {
  return request({
    url: 'ljadmin/school/addGradeAdmin',
    method: 'post',
    data
  })
}

export function deleteGradeAdmin(ids, delParams) {
  return request({
    url: 'ljadmin/school/deleteGradeAdmin',
    method: 'post',
    data: {
      ...delParams,
      ids
    }
  })
}
