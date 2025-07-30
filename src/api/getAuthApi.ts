// 用户信息相关api
import { request } from '@/util/request';
import utils from '@/util/utils';

export const getAuthApi = () => {
    console.log(utils.getUdcapi());
    return request.get(utils.getUdcapi() + '/zhuque/api/common/login/info');
}

export const getLoginStatusApi = async () => {
    const res = await request.get(utils.getUdcapi() + '/zhuque/api/common/login/status');
    return res;
}