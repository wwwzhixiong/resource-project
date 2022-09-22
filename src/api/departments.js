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
 *
 * ***/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
