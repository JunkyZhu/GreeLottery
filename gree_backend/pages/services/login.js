import { request } from '../../utils/util.js'
export function login (param) {
  return request({
    url: '/stores/login',
    urlData: param,
    method: 'Get'
  })
}
export function check(param) {
  return request({
    url: '/tickets/check',
    method: 'Get',
    urlData: param
  })
}
export function register(param) {
  return request({
    url: '/tickets/register',
    data: param
  })
}
export function getInfo(param) {
  return request({
    url: '/stores/my/info',
    method: 'Get'
  })
}