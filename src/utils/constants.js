// 给数组扩展几个方法
const registerFunc = function(arr) {
  // 根据id获取name
  arr.getName = function(id, keys = ['id', 'name']) {
    const idKey = keys[0] || 'id'
    const nameKey = keys[1] || 'name'
    const item = this.find(item => item[idKey] === id)
    return item ? item[nameKey] : ''
  }
}

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
