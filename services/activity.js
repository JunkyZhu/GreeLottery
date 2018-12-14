import {request} from '../utils/util.js'
export function getActivities(param) {
  let url = '/activities?type=1'
  if (param.activityId) {
    url = `/activities/${param.activityId} /preview`
  }
  return request({
    url: url,
    method:"Get",
    
  })
}
export function getAwardsList(param) {
  return request({
    url: '/tickets/my_winning_page',
    urlData: param,
    method: 'Get'
  })
}
export function draw(id,param) {
  return request({
    url: `/activities/${id}/draw`,
    method: "Get",
  })
}
export function exchangeDraw(id, param) {
  return request({
    url: `/activities/${id}/exchange`,
    data: param
  })
}
export function editAddr(id, param) {
  return request({
    url: `/tickets/${id}/delivery_info`,
    data: param,
    method: 'Put'
  })
}

export function getDetail(param) {
  return request({
    url: `/tickets/my_winning/${param}`,
    method: 'Get',
  })
}
export function getDrawCount(param) {
  return request({
    url: `/tickets/my_draw_num`,
    method:"Get",
    data: param
  })
}