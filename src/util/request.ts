import service from './axios';

// 请求方法封装
export const request = {
  // GET请求
  get: (url: string, params?: any, config?: any) => {
    return service.get(url, { params, ...config });
  },

  // POST请求
  post: (url: string, data?: any, config?: any) => {
    return service.post(url, data, config);
  },

  // PUT请求
  put: (url: string, data?: any, config?: any) => {
    return service.put(url, data, config);
  },

  // DELETE请求
  delete: (url: string, config?: any) => {
    return service.delete(url, config);
  },

  // PATCH请求
  patch: (url: string, data?: any, config?: any) => {
    return service.patch(url, data, config);
  }
};

// 导出axios实例，以便需要时直接使用
export default service;
