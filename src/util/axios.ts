import axios from 'axios';
import { message } from 'antd';
import store from '@/store/index';
import type { RootState } from '@/store/index';
import Utils from '@/util/utils';

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.DEV ? '/qingniao' : 'https://test-udc.100tal.com',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    withCredentials: true,
    timeout: 30000,
    transformResponse: [
        (data) => {
            if (typeof data === 'string' && data.startsWith('{')) {
                data = JSON.parse(data);
            }
            return data;
        }
    ]
})

// 请求拦截器
service.interceptors.request.use((config: any) => {
    // 设置默认请求头
    config.headers!['X-Requested-With'] = 'XMLHttpRequest'
    // 从Redux store获取用户数据
    const state = store.getState() as RootState;
    console.log('state', state);
    // 递归遍历config.data，判断是否包含不安全的链接
    const checkLinks = (data: any) => {
        if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const value = data[key];
                    if (typeof value === 'string') {
                        const links = Utils.isValidLink(value);
                        if (links.length > 0) {
                            config.isSafeLink = false;
                            message.error('请求包含不安全的链接，' + links.join(',') + '请使用以 https 开头的链接');
                            return true;
                        }
                    } else if (typeof value === 'object') {
                        checkLinks(value);
                    } else if (Array.isArray(value)) {
                        value.forEach(item => {
                            checkLinks(item);
                        });
                    }
                }
            }
        }   
    }
    
    if(checkLinks(config.data)){
        return Promise.reject(new Error('请求包含不安全的链接'))
    }
    
    return config
}, error => {
    error.data = {
        message: '服务器异常，请联系管理员！'
    }
    // 错误抛到业务代码
    return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response: any) => {
    const status = response.status
    
    if (
        Number(response.data.code) === 30911003 ||
        Number(response.data.status) === 400
    ) {
        let url = response.data.data.login_url
        window.location.href = url
        return { success: false }
    }
    
    if (status < 200 || status >= 300) {
        const errorMessage = showStatus(status)
        // 添加错误详细message
        if (typeof response.data === 'string') {
            response.data = { message: errorMessage };
        } else {
            response.data.message = errorMessage;
        }
        return Promise.reject(response.data)
    } else {
        // 接口响应码正常
        if(response.data.code == 13001){
            message.error("登录失败")

            setTimeout(()=>{
                window.location.href="https://app.xessuyang.com/teacher-admin/#/"
            },2000)
        }
        
        if (Number(response.data.code) === 0) {
            return response
        } else {
            // 机器人详情，不提示错误
            if (!response.config.url.includes('/group/robot/detail')) {
                message.error(response.data.message)
            }
        }
        return Promise.reject(response.data)
    }
}, error => {
    if (axios.isCancel(error)) {
        console.log('重复请求: ' + error.message)
    } else {
        error.data = {
            message: '服务器异常，请联系管理员！'
        }
        // 错误抛到业务代码
        return Promise.reject(error)
    }
})

const showStatus = (status: number) => {
    let message = '';
    switch (status) {
        case 400:
            message = '请求错误(400)';
            break;
        case 401:
            message = '未授权，请重新登录(401)';
            break;
        case 403:
            message = '拒绝访问(403)';
            break;
        case 404:
            message = '请求出错(404)';
            break;
        case 408:
            message = '请求超时(408)';
            break;
        case 500:
            message = '服务器错误(500)';
            break;
        case 501:
            message = '服务未实现(501)';
            break;
        case 502:
            message = '网络错误(502)';
            break;
        case 503:
            message = '服务不可用(503)';
            break;
        case 504:
            message = '网络超时(504)';
            break;
        case 505:
            message = 'HTTP版本不受支持(505)';
            break;
        default:
            message = `连接出错(${status})!`;
    }
    return message;
};

export default service
