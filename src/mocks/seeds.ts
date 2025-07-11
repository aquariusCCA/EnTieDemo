import { setMany } from "idb-keyval";
import { doLogin, doLogout } from './jsons/user.json'
import { getUsers } from './jsons/test.json'

const BASE_URL = import.meta.env.VITE_SERVER;

/** 注入假資料 */
export const setSeeds = async () => {
  try {
    await setMany([
      // 這裡設定假資料 json mapping
      // [url, json key]
      [`${BASE_URL}/public/user/login`, doLogin],
      [`${BASE_URL}/user/logout`, doLogout],
      [`${BASE_URL}/test/getUsers`, getUsers],
    ]);
  } catch (err) {
    console.log(err);
  }
};
