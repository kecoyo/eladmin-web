import request from '@/utils/request'

export function getTeacherInfo(id) {
  return request({
    url: 'ljadmin/teacher/getTeacherInfo',
    method: 'get',
    params: { id }
  })
}

export function updateTeacher(data) {
  return request({
    url: 'ljadmin/teacher/updateTeacher',
    method: 'post',
    data
  })
}
