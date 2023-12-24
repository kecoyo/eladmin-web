import request from '@/utils/request'

export function getStudentInfo(id) {
  return request({
    url: 'ljadmin/student/getStudentInfo',
    method: 'get',
    params: { id }
  })
}

export function updateStudent(data) {
  return request({
    url: 'ljadmin/student/updateStudent',
    method: 'post',
    data
  })
}
