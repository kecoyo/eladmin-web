// 给列表扩展几个方法
export const registerFunc = function(arr, idField = 'id', nameField = 'name') {
  // 根据id获取name
  arr.getName = function(id, idField2, nameField2) {
    const idKey = idField2 || idField
    const nameKey = nameField2 || nameField
    // eslint-disable-next-line eqeqeq
    const item = this.find(item => item[idKey] == id)
    return item ? item[nameKey] : ''
  }

  return arr
}

// 性别
export const GENDER = [
  { id: 1, name: '男' }, //
  { id: 2, name: '女' }
]

registerFunc(GENDER)

// 学校属性
export const SCHOOL_PROPERTY = [
  { id: 0, name: '无' }, //
  { id: 1, name: '省直属' },
  { id: 2, name: '市直属' }
]

registerFunc(SCHOOL_PROPERTY)

// 学段类型
export const PHASE_TYPE = [
  { id: 1, name: '幼儿园', phase: 'nurse', years: [{ id: 3, name: '三年制' }, { id: 4, name: '四年制' }] },
  { id: 2, name: '小学', phase: 'primary', years: [{ id: 5, name: '五年制' }, { id: 6, name: '六年制' }] },
  { id: 4, name: '初中', phase: 'junior', years: [{ id: 3, name: '三年制' }, { id: 4, name: '四年制' }] },
  { id: 8, name: '职高', phase: 'special', years: [{ id: 3, name: '三年制' }, { id: 4, name: '四年制' }] },
  { id: 16, name: '高中', phase: 'senior', years: [{ id: 3, name: '三年制' }, { id: 4, name: '四年制' }] },
  { id: 32, name: '大学', phase: 'college', years: [{ id: 3, name: '三年制' }, { id: 4, name: '四年制' }] }
]

registerFunc(PHASE_TYPE)

// 班级性质
export const CLASS_MODE = [
  { id: 1, name: '行政班 ' } //
  // { id: 2, name: '非行政班' }
]

registerFunc(CLASS_MODE)
