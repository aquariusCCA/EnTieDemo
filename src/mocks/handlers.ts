import { http, HttpResponse, passthrough } from "msw";
import type { HttpResponseResolver } from "msw";
import { doLogin } from "./jsons/user.json";
import { ApiMode } from "@/utils/request";
import request from "../utils/request";
import { get as getDataFromIdb } from 'idb-keyval'

const BASE_URL = import.meta.env.VITE_SERVER;

const mockResolver: HttpResponseResolver = async ({ request }) => {
  console.log("mockResolver", request);

  // 判斷是否需要使用假資料
  const payload = await request.clone().json();
  console.log("mockResolver payload: ", payload);
  const mode = payload.mode.toLowerCase();

  if (mode === ApiMode.TEST) {
    // 如果是 POST 請求且需要使用假資料，則返回假資料
    // 取得在seeds.js裡設定的假資料
    const data = await getDataFromIdb(request.url.toString());
    return HttpResponse.json(data);
  }

  // 如果不是 POST 或不需要假資料，則繼續傳遞請求
  return passthrough();
};

export const handlers = [
  http.post(`${BASE_URL}/public/user/login`, (resolverInfo) => {
    console.log("Handling login request", resolverInfo);
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/user/logout`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
];
