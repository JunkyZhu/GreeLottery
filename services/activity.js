import {request} from '../utils/util.js'
export function getActivities() {
  return request({
    url: '/activities?type=1',
    method:"Get"
  })
}
export function getAwardsList(params) {
  return request({
    url: '/tickets/my_winning?activityId=1',
    urlData: params,
    method: 'Get'
  })
}
export function draw(id,param) {
  debugger
  return request({
    url: `/activities/${id}/dealer_draw`,
    data: param
  })
}