import Mock from 'mockjs'
import { statusCode } from '../../utils/statusCode'
// eslint-disable-next-line no-unused-vars
import url from '../../api/competition/url'
Mock.setup({
    timeout: 500
})
// const getLiveList = config => {
//     console.log(Random)
//     return Mock.mock({
//         code: statusCode.success,
//         'data|5-20': [{
//             id: '@id',
//             team1: {
//                 name: '@cname',
//                 id: '@id'
//             },
//             team2: {
//                 name: '@cname',
//                 id: '@id'
//             },
//             'img|1': [
//                 'https://cdn.podapi.com/image/live/20220511/810101297e7bf7d0418f718121cf2e2b?imageView2/2/w/600/h/600',
//                 'https://cdn.podapi.com/image/live/20220511/74fe6e768e027c7e8152fdc9156fb6d8?imageView2/2/w/600/h/600',
//                 'https://cdn.sportnanoapi.com/football/team/0ca927f81a711c8df6961aa864fb1898.jfif',
//                 'https://cdn.sportnanoapi.com/football/team/9e033dde06190d44817b6e37a4bc0b2b.png'
//             ],
//             user: {
//                 name: '@cname',
//                 viewers: {
//                     'count|0-2000000': 2000
//                 }
//             }
//         }]
//     })
// }

const getBattles = config => {
    return Mock.mock({
        code: statusCode.success,
        page: {
            pageSize: 20,
            count: 500,
            currentPage: 1
        },
        'data|0-20': [
            {
                id: '@id',
                'status|1': [1, 2, 3], // 1 未开始, 2 进行中 3 已结束
                startTime: '@time',
                'country|1': ['意甲', '荷甲', '英超', '中超', '葡甲'],
                host: {
                    id: '@id',
                    name: '@cname'
                },
                teamA: {
                    name: '@cname',
                    'score|1': [1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                teamB: {
                    name: '@cname',
                    'score|1': [1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }
        ]
    })
}

// const getBookedMatches = config => {
//     return Mock.mock({
//         code: statusCode.success,
//         'data|2': [
//             {
//                 id: '@id',
//                 name: '@cname',
//                 'status|1': [0, 1], // 0 未开始，1 进行中
//                 time: '@time',
//                 team1: {
//                     icon: '',
//                     loop: '中甲第3轮',
//                     'score|0-10': 2
//                 },
//                 team2: {
//                     icon: '',
//                     loop: '中甲第3轮',
//                     'score|0-10': 2
//                 }
//             }
//         ]
//     })
// }

// Mock.mock(url.getLiveList, 'get', getLiveList)
Mock.mock(/\/api\/v1\/battles/, 'get', getBattles)
// Mock.mock(url.getBookedMatches, 'post', getBookedMatches)
