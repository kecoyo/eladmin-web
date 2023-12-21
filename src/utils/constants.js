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

// 1 幼儿园，2 小学，4 初中，8 职业中专（职业高中），16 高中，32 大专院校。
const STAGE_YEARS1 = [{ id: 3, name: '三年制' }, { id: 4, name: '四年制' }]
const STAGE_YEARS2 = [{ id: 5, name: '五年制' }, { id: 6, name: '六年制' }]
export const STAGES = [
  { id: 1, name: '幼儿园', phase: 'nurse', years: STAGE_YEARS1 },
  { id: 2, name: '小学', phase: 'primary', years: STAGE_YEARS2 },
  { id: 4, name: '初中', phase: 'junior', years: STAGE_YEARS1 },
  { id: 8, name: '职高', phase: 'Special', years: STAGE_YEARS1 },
  { id: 16, name: '高中', phase: 'senior', years: STAGE_YEARS1 },
  { id: 32, name: '大学', phase: 'college', years: STAGE_YEARS1 }
]

registerFunc(STAGES)

// 学校属性
export const SCHOOL_PROPERTY = [
  { id: 0, name: '无' }, //
  { id: 1, name: '省直属' },
  { id: 2, name: '市直属' }
]

registerFunc(SCHOOL_PROPERTY)

// 学段类型
export const PHASE_TYPE = [
  { id: 1, name: '幼儿园', key: 'nurse' },
  { id: 2, name: '小学', key: 'primary' },
  { id: 4, name: '初中', key: 'junior' },
  { id: 8, name: '职业中专（职业高中）', key: 'special' },
  { id: 16, name: '高中', key: 'senior' },
  { id: 32, name: '大专院校', key: 'college' }
]

registerFunc(PHASE_TYPE)
