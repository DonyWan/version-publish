// 引入axios
import axios from 'axios';
import store from '../store';
import router from '../router';
import axiosConfig from '../config/axios.config';

// 创建axios实例
const httpService = axios.create(
    axiosConfig
    //     {
    //     // url前缀-'https://some-domain.com/api/'
    //     baseURL: 'http://127.0.0.1:8089/',//process.env.BASE_API, // 需自定义
    //     // 请求超时时间
    //     timeout: 5000 // 需自定义
    // }
);

// request拦截器
httpService.interceptors.request.use(
    config => {
        // console.log('请求：'+store)
        const token = store.state.token;
        // 根据条件加入token-安全携带
        if ('' != token) { // 需自定义
            // 让每个请求携带token
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        // 请求错误处理
        Promise.reject(error);
    }
)

// respone拦截器
httpService.interceptors.response.use(
    response => {
        // 统一处理状态
        // const res = response.data;
        // console.log(response)
        if (response.status != 200) { // 需自定义
            // 返回异常
            return Promise.reject({
                status: response.status,
                message: response.statusText
            });
        } else {
            return response;
        }
    },
    // 处理处理
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求';
                    break;
                case 401:
                    error.message = '未授权，请重新登录';
                    router.push('/login')
                    break;
                case 403:
                    error.message = '拒绝访问';
                    break;
                case 404:
                    error.message = '请求错误,未找到该资源';
                    break;
                case 405:
                    error.message = '请求方法未允许';
                    break;
                case 408:
                    error.message = '请求超时';
                    break;
                case 500:
                    error.message = '服务器端出错';
                    break;
                case 501:
                    error.message = '网络未实现';
                    break;
                case 502:
                    error.message = '网络错误';
                    break;
                case 503:
                    error.message = '服务不可用';
                    break;
                case 504:
                    error.message = '网络超时';
                    break;
                case 505:
                    error.message = 'http版本不支持该请求';
                    break;
                default:
                    error.message = `未知错误${error.response.status}`;
            }
        } else {
            error.message = "连接到服务器失败";
        }
        return Promise.reject(error);
    }
)

/*网络请求部分*/

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'get',
            params: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}
/**
 * 文件下载
 * @param url 
 * @param params 
 */
export function fileDownload(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'GET',
            data: params,
            responseType: 'arraybuffer'
        }).then(response => {
            //  let fileName = response.headers["content-disposition"]
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        }).catch(error => {
            reject(error)
        });
    })
}
export default {
    get,
    post,
    fileUpload,
    fileDownload
}