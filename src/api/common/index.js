import url from '@/api/common/url'
import request from '../request'

export function uploadImage (formData) {
    return request({
        method: 'post',
        url: url.uploadImg,
        data: formData,
        timeout: 1000 * 60
    })
}
/*
* 内容ID,1=关于我们 | 2=用户协议 | 3=隐私政策 | 4=联系我们 | 5=开播教程  | 6=直播规范 | 7=开播工具  | 8=直播协议
* */
export function getContentList (type) {
    return request({
        method: 'post',
        url: url.getContentList,
        data: {
            id: type
        }
    })
}

export function getBanners (type) {
    return request({
        method: 'post',
        url: url.getBanners,
        data: {
            adv_type: type,
            device: 'H5'
        }
    })
}

export function getDownloadUrls () {
    return request({
        method: 'post',
        url: url.getDownloadUrls
    })
}

export function getNewsBanner () {
    return request({
        method: 'get',
        url: url.getNewsBanner
    })
}

export function getNewsTypes () {
    return request({
        method: 'get',
        url: url.getNewsTypes
    })
}

export function getNews ({ pageSize = 20, currentPage = 1, type }) {
    const params = {
        pageSize,
        pageNum: currentPage
    }
    if (type) {
        params.type = type
    }
    return request({
        method: 'get',
        url: url.getNews,
        params
    })
}

export function getNewsDetail (id) {
    return request({
        method: 'get',
        url: url.getNewsDetail,
        params: {
            id
        }
    })
}

export function getOtherNews (id) {
    return request({
        method: 'get',
        url: url.getOtherNews,
        params: {
            id
        }
    })
}

export function getCsLink () {
    return request({
        method: 'get',
        url: url.getCsLink
    })
}

export function getAnnouncementList (params) {
    return request({
        method: 'get',
        url: url.getAnnouncementList,
        params
    })
}
