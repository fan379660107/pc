import axios from 'axios'
import qs from "qs";
import { getLocalStorageStr } from './common'
import { apiUrl } from './config'
import store from '@/store/index';
const instance = axios.create({
    baseURL: apiUrl,
    timeout: 10000
})

export const get = async (url, data = {}) => {
    let res = await initRequestHeader('get', url, data);
    data = res.data;
    return new Promise((resolve, reject) => {
        instance.get(res.url, { params: data, headers: res.headers }).then((response) => {
            if (response.data.state == 266) {
                store.commit('clearAllData')
            } else {
                resolve(response.data)
            }
        }, err => {
            reject(err)
        })
    })
}

export const post = async (url, data = {}, type = 'urlencoded') => {
    let res = await initRequestHeader('post', url, data, type);
    return new Promise((resolve, reject) => {
        instance.post(res.url, res.data, {
            headers: res.headers
        }).then((response) => {
            resolve(response.data)
        }, err => {
            reject(err)
        })
    })
}

/**
 * 初始化请求头和数据
 * @zjf-2020-12-25
 */
const initRequestHeader = async (method, url, data = {}, type = 'urlencoded') => {
    let result = {};
    let headers = {};

    //用户登录状态下，每次更新refresh_token58分钟之后需要更新access_token
    if (getLocalStorageStr('access_token')) {
        let cur_time = new Date().getTime();
        if (cur_time - getLocalStorageStr('time') * 1 > 58 * 60 * 1000) {
            let param = new FormData();
            param.append('grant_type', 'refresh_token');
            param.append('refresh_token', getLocalStorageStr('refresh_token'));
            await instance.post('v3/frontLogin/oauth/token', param, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Basic VVcxS2FsSnVTblppYmxFOTpVMjFHTWxsVlFrUmlNMEkxVlcxc2JtRklVa0ZWTW5oMldrYzVkUT09'
                }
            }).then((response) => {
                if (response.data.state == 200) {
                    localStorage.setItem('access_token', response.data.data.access_token);
                    localStorage.setItem('time', new Date().getTime().toString());//存储refresh_token更新时间
                }
            }, err => {
                console.log('更新access_token出错：', err);
            })
        }
    }

    if (method == 'post') {
        if (type == 'urlencoded') {
            headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            data = qs.stringify(data);
        } else if (type == 'json') {
            headers = { 'Content-Type': 'application/json' };
            data = JSON.parse(JSON.stringify(data));
        } else if (type == 'form') {//form-data
            headers = { 'Content-Type': 'multipart/form-data' };
            let tmp_data = new FormData();
            Object.keys(data).forEach((item) => {
                tmp_data.append(item, data[item])
            });
            data = tmp_data;
        }
    }

    if (url.indexOf('frontLogin/oauth/token') > -1) {
        headers.Authorization = 'Basic VVcxS2FsSnVTblppYmxFOTpVMjFHTWxsVlFrUmlNMEkxVlcxc2JtRklVa0ZWTW5oMldrYzVkUT09';
    } else {
        let token = getLocalStorageStr('access_token');
        headers.Authorization = 'Bearer ' + token;
    }

    result = { url, data, headers };
    return result;
}
