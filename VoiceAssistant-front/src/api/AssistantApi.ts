import type { PagingResult, Result } from "../model/result";
import type { Assistant } from "@/model/Assistant";
import Fetch from "../utils/Fetch";


export default class AssistantApi {
  // 创建助手
  public static async create(assistant: Assistant): Promise<Result<Assistant>> {
    return await Fetch.post('/assistant/create', assistant);
  }

  // 获取助手详情
  public static async getById(id: string): Promise<Result<Assistant>> {
    return await Fetch.get(`/assistant/${id}`);
  }

  // 更新助手
  public static async update(id: string, assistant: Assistant): Promise<Result<Assistant>> {

    return await Fetch.post(`/assistant/${id}/update`, assistant);
  }

  // 删除助手
  public static async delete(id: string): Promise<Result<void>> {
    return await Fetch.post(`/assistant/delete/${id}`);
  }

  // 获取助手列表，使用Result包装分页结果
  public static async list(page: number = 1, size: number = 10): Promise<Result<PagingResult<Assistant>>> {
    return await Fetch.get('/assistant/list', { page, size });
  }
  public static async getAll(): Promise<Result<Assistant[]>> {
    return await Fetch.get('/assistant/all');
  }
}