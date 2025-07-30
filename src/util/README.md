# Axios 配置说明

## 概述

这个项目使用了自定义的 axios 配置，适配 React + TypeScript + Vite 项目，集成了 Ant Design 的消息提示和 Redux 状态管理。

## 主要特性

1. **自动环境检测**: 开发环境使用空 baseURL，生产环境使用配置的 API 地址
2. **请求拦截器**: 
   - 自动添加请求头
   - 链接安全检查（只允许 https 链接）
   - 从 Redux store 获取用户信息
3. **响应拦截器**:
   - 统一错误处理
   - 登录状态检查
   - 使用 Ant Design 的 message 组件显示错误信息
4. **类型安全**: 完整的 TypeScript 支持

## 使用方法

### 1. 基本使用

```typescript
import { request } from '@/util/request';

// GET 请求
const getData = async () => {
  try {
    const response = await request.get('/api/data');
    console.log(response.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

// POST 请求
const createData = async (data: any) => {
  try {
    const response = await request.post('/api/data', data);
    console.log(response.data);
  } catch (error) {
    console.error('创建失败:', error);
  }
};
```

### 2. 直接使用 axios 实例

```typescript
import service from '@/util/request';

const customRequest = async () => {
  try {
    const response = await service({
      method: 'post',
      url: '/api/custom',
      data: { key: 'value' },
      headers: {
        'Custom-Header': 'value'
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};
```

## 配置说明

### 环境变量

- 开发环境: `import.meta.env.DEV` 为 `true`，baseURL 为空
- 生产环境: baseURL 为 `https://test-udc.100tal.com`

### 请求头配置

- `Content-Type`: `application/x-www-form-urlencoded;charset=utf-8`
- `X-Requested-With`: `XMLHttpRequest`
- `withCredentials`: `true` (支持跨域携带 cookie)

### 超时设置

- 默认超时时间: 30 秒

## 错误处理

### 自动处理的错误

1. **HTTP 状态码错误**: 自动显示对应的错误信息
2. **登录失效**: 自动跳转到登录页面
3. **不安全链接**: 自动检测并阻止包含 http 链接的请求

### 自定义错误处理

```typescript
try {
  const response = await request.get('/api/data');
  // 处理成功响应
} catch (error: any) {
  if (error.response) {
    // 服务器返回错误状态码
    console.error('服务器错误:', error.response.data);
  } else if (error.request) {
    // 请求发送失败
    console.error('网络错误:', error.request);
  } else {
    // 其他错误
    console.error('请求配置错误:', error.message);
  }
}
```

## 工具函数

### Utils 类

```typescript
import Utils from '@/util/utils';

// 检查不安全链接
const unsafeLinks = Utils.isValidLink('http://example.com https://safe.com');
console.log(unsafeLinks); // ['http://example.com']

// 格式化日期
const formattedDate = Utils.formatDate(new Date());
console.log(formattedDate); // '2024/01/01 12:00'

// 防抖函数
const debouncedFunction = Utils.debounce(() => {
  console.log('防抖执行');
}, 300);

// 节流函数
const throttledFunction = Utils.throttle(() => {
  console.log('节流执行');
}, 1000);
```

## 注意事项

1. **链接安全检查**: 所有请求都会检查是否包含不安全的 http 链接
2. **Redux 集成**: 需要根据实际的 store 结构修改用户信息获取逻辑
3. **错误提示**: 使用 Ant Design 的 message 组件，确保项目中已正确配置
4. **类型安全**: 建议为 API 响应定义 TypeScript 接口

## 扩展配置

如果需要添加新的请求头或修改配置，可以在 `src/util/axios.ts` 文件中进行修改：

```typescript
// 在请求拦截器中添加自定义请求头
service.interceptors.request.use((config: any) => {
  // 添加自定义请求头
  config.headers!['Custom-Header'] = 'value';
  
  // 其他配置...
  return config;
});
``` 