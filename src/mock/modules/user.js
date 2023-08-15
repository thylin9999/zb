/* eslint-disable */
import Mock from 'mockjs'
import { statusCode } from '../../utils/statusCode'
import url from '../../api/user/url'
Mock.setup({
    timeout: 500
})
const login = config => {
    return Mock.mock({
        code: statusCode.success,
        data: 'token-token-token'
    })
}
const userInfo = config => {
    return Mock.mock({
        code: statusCode.success,
        data: {
            userName: '@cname',
            'role|1': [
                {
                    id: 1,
                    name: '管理员'
                },
                {
                    id: 2,
                    name: '操作员'
                }
            ] // 角色列表
        }
    })
}
const getHosts = config => {
    return Mock.mock({
        code: statusCode.success,
        'data|1-20': [
            {
                id: '@id',
                name: '@cname',
                'url|1': [
                    'https://cdn.podapi.com/image/avatar/20201128/1b733954074c2a30d6df549c15ba1bb8?imageView2/2/w/200/h/200',
                    'https://cdn.podapi.com/image/avatar/20211125/f637d701b82b38cba364f0b5a63d7901?imageView2/2/w/200/h/200',
                    'https://cdn.podapi.com/image/avatar/20211124/c9e710d4317e145b7a9ed6c108397209?imageView2/2/w/200/h/200',
                    'https://cdn.podapi.com/image/avatar/20211110/78afecb665cf8ee2756b0e4995d17d13?imageView2/2/w/200/h/200'
                ],
                'isSubscribe|1': true
            }
        ]
    })
}
// Mock.mock(url.login, 'post', login)
// Mock.mock(/\/api\/v1\/user\/info/, 'get', userInfo)
Mock.mock(url.getHosts, 'get', getHosts)
