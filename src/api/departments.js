import request from '@/utils/request'
/** *
 *
 * 获取组织架构数据
 * 暴漏接口
 * **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除阻止架构部门*
 *
 * 删除 delete  新增 post  修改put 获取 get
 *
 * ***/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 *  新增部门接口
 *
 * ****/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/** *
 * 获取部门详情
 * ***/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 *
 * ***/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

