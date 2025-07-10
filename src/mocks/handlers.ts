import { http, HttpResponse, passthrough } from "msw";
import type { HttpResponseResolver } from "msw";
import { doLogin } from './jsons/user.json'

const BASE_URL = import.meta.env.VITE_SERVER

// 加上型別註記，並解構正確的欄位名稱 `request`
export const baseResolver: HttpResponseResolver = async ({ request }) => {
  console.log("baseResolver", request);

  // 判斷是否需要使用假資料
  const newPost = await request.clone().json();
  console.log("baseResolver newPost", newPost);
  const useFakeData = newPost.mode.toUpperCase() === "TEST";

  if (request.method === "POST" && useFakeData) {
    // 如果是 POST 請求且需要使用假資料，則返回假資料
    return HttpResponse.json(doLogin);
  }

  return passthrough();
};

export const handlers = [
  http.post(`${BASE_URL}/public/user/login`, baseResolver),
];
