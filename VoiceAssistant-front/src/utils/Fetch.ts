// 从环境变量获取基础URL
const BASE_URL = import.meta.env.VITE_Fetch_BASE_URL;
const TIMEOUT = 10000;

// 超时控制
const timeoutPromise = (timeout: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });
};

// 基础 fetch 封装
async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await Promise.race([
      fetch(BASE_URL + url, options),
      timeoutPromise(TIMEOUT)
    ]);

    if (response instanceof Response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as T;
    }
    throw new Error('Timeout');
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// GET 请求
export async function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithTimeout<T>(url + queryString, {
    method: 'GET',
  });
}

// POST 请求
export async function post<T>(url: string, body?: any): Promise<T> {
  return fetchWithTimeout<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
}

export default {
  get,
  post
};