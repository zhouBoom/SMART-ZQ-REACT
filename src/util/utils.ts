// 工具函数集合
class Utils {
  /**
   * 检查字符串中是否包含不安全的链接
   * @param text 要检查的文本
   * @returns 不安全的链接数组
   */
  static isValidLink(text: string): string[] {
    const urlPattern = /https?:\/\/[^\s]+/g;
    const links = text.match(urlPattern) || [];
    return links.filter(link => !link.startsWith('https://'));
  }

  /**
   * 格式化日期
   * @param date 日期对象或日期字符串
   * @returns 格式化后的日期字符串
   */
  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * 防抖函数
   * @param func 要防抖的函数
   * @param wait 等待时间
   * @returns 防抖后的函数
   */
  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * 节流函数
   * @param func 要节流的函数
   * @param limit 限制时间
   * @returns 节流后的函数
   */
  static throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static getUdcapi() {
    return import.meta.env.VITE_UDC_URL;
  }
}



export default Utils; 