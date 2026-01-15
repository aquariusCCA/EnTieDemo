import { http, HttpResponse, passthrough } from "msw";
import type { HttpResponseResolver } from "msw";
import { ApiMode } from "@/utils/request";
import { get as getDataFromIdb } from "idb-keyval";

const BASE_URL = import.meta.env.VITE_SERVER;

const mockResolver: HttpResponseResolver = async ({ request }) => {
  // 1. 先取得 method，並轉小寫方便比對
  const method = request.method.toLowerCase();

  // 2. 根據 method 分別解析 mode
  let modeValue: string | undefined;
  if (["post", "put", "patch", "delete"].includes(method)) {
    // 對於有 body 的請求，從 JSON body 讀
    try {
      const body = await request.clone().json();
      // body.mode 可能是 ApiMode.TEST，也可能是其他字串
      modeValue = body?.mode;
    } catch {
      // 如果 parse 失敗（如非 JSON），modeValue 保持 undefined
    }
  } else {
    // 對於 GET/HEAD 等無 body 的請求，從 URL query 拿
    const url = new URL(request.url.toString());
    modeValue = url.searchParams.get("mode") || undefined;
  }

  // 3. 若 mode === TEST，則回傳假資料；否則 passthrough
  if (modeValue?.toLowerCase() === ApiMode.TEST) {
    // 這裡的 key 可以依你的需求決定：可用完整 URL，也可用 endpoint path
    const data = await getDataFromIdb(request.url.toString());
    return HttpResponse.json(data);
  }

  // 預設放行到真實伺服器
  return passthrough();
};

export const handlers = [
  http.post(`${BASE_URL}/public/user/login`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/user/logout`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/user/info`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/performance/preCheck`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/performance/grmPreCheck`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/performance/detail`, () => {
    const base64String =
      "UEsDBBQACAgIAJtD+loAAAAAAAAAAAAAAAAYAAAAeGwvZHJhd2luZ3MvZHJhd2luZzEueG1sndBdbsIwDAfwE+wOVd5pWhgTQxRe0E4wDuAlbhuRj8oOo9x+0Uo2aXsBHm3LP/nvzW50tvhEYhN8I+qyEgV6FbTxXSMO72+zlSg4gtdgg8dGXJDFbvu0GTWtz7ynIu17XqeyEX2Mw1pKVj064DIM6NO0DeQgppI6qQnOSXZWzqvqRfJACJp7xLifJuLqwQOaA+Pz/k3XhLY1CvdBnRz6OCGEFmL6Bfdm4KypB65RPVD8AcZ/gjOKAoc2liq46ynZSEL9PAk4/hr13chSvsrVX8jdFMcBHU/DLLlDesiHsSZevpNlRnfugbdoAx2By8i4OPjj3bEqyTa1KCtssV7ercyzIrdfUEsHCAdiaYMFAQAABwMAAFBLAwQUAAgICACbQ/paAAAAAAAAAAAAAAAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbJ2U227jIBCGn2DfweI+xnibHizbVQ+qtndVtd29phjHKBwswIe8/WLioCS+sfZuGP755tcwIn8cBY96qg1TsgAoTkBEJVEVk7sCfP1+29yDyFgsK8yVpAU4UAMeyx/5oPTeNJTayAGkKUBjbZtBaEhDBTaxaql0N7XSAlt31DtoWk1x5YsEh2mS3EKBmQRHQqbXMFRdM0JfFekElfYI0ZRj6+ybhrXmRBPjAicY0cqo2sZEiZnkHBBIR0K9ofsLQ4KscSSw3nftxiFb5+KbcWYP3lfA9AXotMxmxibYmGoy1z/rBT+JR3SzzvdimA/w4cL9iLb/R0IJROgKdYOXs1hvC5NAEusw4UXmFSlzj/zQZa46y5mkHzoynXDDPzxTroYCuMWdE59s19gpAcschjof/GF0MGdxNK3xt1L76fBeXRSda9/8g7uepDNWiV/02AKBqKI17rh9Ufwvq2zjcml8+zPkP9UQxNv4bjvhPfEVW1zmWg2RnjhlTqbgyRGN57oC47J9meSwd5bIrHheKlBQQMcL0DRA00VJegU9KfzdXZxcEeGZ5UrjwX0Okc6Ym5d+r5AfWfgPyn9QSwcI9IfUB7oBAABTBAAAUEsDBBQACAgIAJtD+loAAAAAAAAAAAAAAAAjAAAAeGwvd29ya3NoZWV0cy9fcmVscy9zaGVldDEueG1sLnJlbHONz0sKwjAQBuATeIcwe5PWhYg07UaEbqUeYEimD2weJPHR25uNouDC5czPfMNfNQ8zsxuFODkroeQFMLLK6ckOEs7dcb0DFhNajbOzJGGhCE29qk40Y8o3cZx8ZBmxUcKYkt8LEdVIBiN3nmxOehcMpjyGQXhUFxxIbIpiK8KnAfWXyVotIbS6BNYtnv6xXd9Pig5OXQ3Z9OOF0AHvuVgmMQyUJHD+2r3DkmcWRF2Jr4r1E1BLBwitqOtNswAAACoBAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAABMAAAB4bC90aGVtZS90aGVtZTEueG1szVfbbtwgEP2C/gPivcHXvSm7UbKbVR9aVeq26jOx8aXB2AI2af6+GHttfEuiZiNlXwLjM4czM8CQy6u/GQUPhIs0Z2toX1gQEBbkYcriNfz1c/95AYGQmIWY5oys4RMR8Grz6RKvZEIyApQ7Eyu8homUxQohESgzFhd5QZj6FuU8w1JNeYxCjh8VbUaRY1kzlOGUwdqfv8Y/j6I0ILs8OGaEyYqEE4qlki6StBAQMJwpjYeEECng5iTylpLSQ5SGgPJDoJUPsOG9Xf4RPL7bUg4eMF1DS/8g2lyiBkDlELfXvxpXA8J75yU+p+Ib4np8GoCDQEUxXNtzFv7eq7EGqBoOuW+vPdf1O3iD3x1qubnZWl1+t8V7A7zrXS98t4P3Wrw/EutsZ9kdvN/iZ8N4Zze77ayD16CEpux+gLZt399ua3QDiXL65WV4i0LGzqn8mZzaRxn+k/O9Aujiqu3JgHwqSIQDhbvmKaYlPV4RPG4PxJgd9YizlL3TKi0xMgPVYWfdqL/rI6mjjlJKD/KJkq9CSxI5TcO9MuqJdmqSXCRqWC/XwcUc6zHgufydyuSQ4EItY+sVYlFTxwIUuVCHCU5y66Qcs295eCrr6dwpByxbu+U3dpVCWVln8/aQNvR6FgtTgK9JXy/CWKwrwh0RMXdfJ8K2zqViOaJiYT+nAhlVUQcF4LJr+F6lCIgAUxKWdar8T9U9e6WnktkN2xkJb+mdrdIdEcZ264owtmGCQ9I3n7nWy+V4qZ1RGfPFe9QaDe8Gyroz8KjOnOsrmgAXaxip60wNs0LxCRZDgGmsHieBrBP9PzdLwYXcYZFUMP2pij9LJeGAppna62YZKGu12c7c+rjiltbHyxzqF5lEEQnkhKWdqm8VyejXN4LLSX5Uog9J+Aju6JH/wCpR/twuEximQjbZDFNubO42i73rqj6KIy88/YChRYLrjmJe5hVcjxs5RhxaaT8qNJbCu3h/jq77slPv0pxoIPPJW+z9mryhyh1X5Y/edcuF9XyXeHtDMKQtxqW549KmescZHwTGcrOJvDmT1XxjN+jvWmS8K/Ws90/bybL5B1BLBwhlo4FhKAMAAK0OAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAABQAAAB4bC9zaGFyZWRTdHJpbmdzLnhtbGWOQQrCMBBFT+Adwuw1VUFEknQheAI9QGjHNthMamZa9PZGRFy4fO/z4Jv6EQc1Y+aQyMJ6VYFCalIbqLNwOZ+We1Asnlo/JEILT2So3cIwiyopsYVeZDxozU2P0fMqjUhluaYcvRTMneYxo2+5R5Q46E1V7XT0gUA1aSKxsAU1UbhPePyyMxycEUc+otHijH7zx/nuT91wDvSTurxzL1BLBwjNRYjrnwAAANsAAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAAA0AAAB4bC9zdHlsZXMueG1stVTBbtwgEP2C/gPinsW7iqomsh3l4qiX9pCt1CvGsEYBxgI2tfv1HYzd3dVGahSpPtjMm+G9GWZw+TBaQ16lDxpcRbebghLpBHTaHSr6Y9/cfKEkRO46bsDJik4y0If6UxniZORzL2UkyOBCRfsYh3vGguil5WEDg3ToUeAtj2j6AwuDl7wLaZM1bFcUn5nl2tHMcD9ub7m44rFaeAig4kaAZaCUFvKa6Y7dMS5WJntN80Y6lvuX43CDtAOPutVGx2nOitalAhcDEXB0saK7BajL8Ju8coPnVOBBsboUYMATf2gr2jTF/CTYcStz4KPX3CRozmMBrXbgE8gya35nrpjCUOADNPMnIJ025jJ3BOoSi4zSuwYNsqz304BaDhubaea4f0Qbfejjk+fT2Zb5g8ot+A5HadXe0hVKoYsTC5XGPKfx+akuQkdFcszXrqI4h4l0XWJly9IdbWNXgw+DmR4xJWdlpslQA9lKuudyWfxMd/cx3VG9M4G65KuTpJHFa/U9Sc2bQ++1e9lDo+Ns4zWMWqTWthAjWEp+eT7s5Ti7Uy2jele62/+R7qrPliM8a+RFG/+iJ9k0yBX9lu6eoaQ9ahO1y76LDiFnN56ak72nP039B1BLBwiyOrK81QEAAK4EAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAAA8AAAB4bC93b3JrYm9vay54bWydkktOwzAQhk/AHSLvWyeooDZq0g1C6gaxgAO49qSx6kdkuyG9CxsWSNyAFbcBiWMwDUmk0k3Eys/55pP9L1eNVlENzktrMpJMYxKB4VZIs83I48PtZE4iH5gRTFkDGTmAJ6v8Yvlk3W5j7S7CeuMzUoZQpZR6XoJmfmorMHhSWKdZwKXbUl85YMKXAEErehnH11QzacgvIXVjGLYoJIcby/caTPiFOFAsoL0vZeV7mm7OcFpyZ70twpRb3ZHQgFNoOLRC8xMhzccYaeZ2+2qCyAotNlLJcGi9Bkydkb0zaceYDBrHmhT7p7VW/eUmmY3zPnvMBV2c2DfJ1f9ISUyT5A9qxs7fYrwW4wNJj8MMP9JFJB/idu9ovmz5vhuP6QwYzFp6uVFAIsM0Lr/eXz8/nr9f3hLM7/HeWmC8SeRSiRO3FjOCJNqjBBTSgLjDWo/7nCnetqJ94/wHUEsHCAsH7dFaAQAAKgMAAFBLAwQUAAgICACbQ/paAAAAAAAAAAAAAAAAGgAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzrZJBasMwEEVP0DuI2deyk1JKiZxNKGTbpgcQ0tgysSUhTdr69p024DoQQhdeif/F/P/QaLP9GnrxgSl3wSuoihIEehNs51sF74eX+ycQmbS3ug8eFYyYYVvfbV6x18Qz2XUxCw7xWYEjis9SZuNw0LkIET3fNCENmlimVkZtjrpFuSrLR5nmGVBfZIq9VZD2tgJxGCP+Jzs0TWdwF8xpQE9XKiTxLHKgTi2Sgl95NquCw0BeZ1gtyZBp7PkNJ4izvlW/XrTe6YT2jRIveE4xt2/BPCwJ8xnSMTtE+gOZrB9UPqbFyIsfV38DUEsHCJYZwVPqAAAAuQIAAFBLAwQUAAgICACbQ/paAAAAAAAAAAAAAAAACwAAAF9yZWxzLy5yZWxzjc9BDoIwEAXQE3iHZvZScGGMobAxJmwNHqC2QyFAp2mrwu3tUo0Ll5P5836mrJd5Yg/0YSAroMhyYGgV6cEaAdf2vD0AC1FaLSeyKGDFAHW1KS84yZhuQj+4wBJig4A+RnfkPKgeZxkycmjTpiM/y5hGb7iTapQG+S7P99y/G1B9mKzRAnyjC2Dt6vAfm7puUHgidZ/Rxh8VX4kkS28wClgm/iQ/3ojGLKHAq5J/PFi9AFBLBwikb6EgsgAAACgBAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAABMAAABbQ29udGVudF9UeXBlc10ueG1stVPLTsMwEPwC/iHyFTVuOSCEmvbA4whIlA9Y7E1j1S953dffs0laJKoggdRevLbHOzPrtafznbPFBhOZ4CsxKceiQK+CNn5ZiY/F8+hOFJTBa7DBYyX2SGI+u5ou9hGp4GRPlWhyjvdSkmrQAZUhomekDslB5mVayghqBUuUN+PxrVTBZ/R5lFsOMZs+Yg1rm4uHfr+lrgTEaI2CzL4kk4niacdgb7Ndyz/kbbw+MTM6GCkT2u4MNSbS9akAo9QqvPLNJKPxXxKhro1CHdTacUpJMSFoahCzs+U2pFU37zXfIOUXcEwqd1Z+gyS7MCkPlZ7fBzWQUL/nxI2mIS8/DpzTh06wZc4hzQNEx8kl6897i8OFd8g5lTN/CxyS6oB+vGirOZYOjP/tzX2GsDrqy+5nz74AUEsHCG2ItFA1AQAAGQQAAFBLAQIUABQACAgIAJtD+loHYmmDBQEAAAcDAAAYAAAAAAAAAAAAAAAAAAAAAAB4bC9kcmF3aW5ncy9kcmF3aW5nMS54bWxQSwECFAAUAAgICACbQ/pa9IfUB7oBAABTBAAAGAAAAAAAAAAAAAAAAABLAQAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sUEsBAhQAFAAICAgAm0P6Wq2o602zAAAAKgEAACMAAAAAAAAAAAAAAAAASwMAAHhsL3dvcmtzaGVldHMvX3JlbHMvc2hlZXQxLnhtbC5yZWxzUEsBAhQAFAAICAgAm0P6WmWjgWEoAwAArQ4AABMAAAAAAAAAAAAAAAAATwQAAHhsL3RoZW1lL3RoZW1lMS54bWxQSwECFAAUAAgICACbQ/pazUWI658AAADbAAAAFAAAAAAAAAAAAAAAAAC4BwAAeGwvc2hhcmVkU3RyaW5ncy54bWxQSwECFAAUAAgICACbQ/pasjqyvNUBAACuBAAADQAAAAAAAAAAAAAAAACZCAAAeGwvc3R5bGVzLnhtbFBLAQIUABQACAgIAJtD+loLB+3RWgEAACoDAAAPAAAAAAAAAAAAAAAAAKkKAAB4bC93b3JrYm9vay54bWxQSwECFAAUAAgICACbQ/palhnBU+oAAAC5AgAAGgAAAAAAAAAAAAAAAABADAAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHNQSwECFAAUAAgICACbQ/papG+hILIAAAAoAQAACwAAAAAAAAAAAAAAAAByDQAAX3JlbHMvLnJlbHNQSwECFAAUAAgICACbQ/pabYi0UDUBAAAZBAAAEwAAAAAAAAAAAAAAAABdDgAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLBQYAAAAACgAKAJoCAADTDwAAAAA=";

    const bytes = base64ToUint8Array(base64String);

    // ✅ 成功：回傳 XLSX（二進位）
    return HttpResponse.arrayBuffer(bytes.buffer, {
      headers: {
        "Content-Type":
          "application/octet-stream",
        "Content-Disposition": "attachment; filename=performance_detail.xlsx",
      },
    });

    // ❌ 會話失效 JSON（你的 simpleDownload 會讀到 JSON → 提示並中止）
    // return HttpResponse.json(
    //     { code: 440, message: "無效的會話，或者會話已過期，請重新登錄。", data: {} },
    //     {
    //       status: 200,
    //       headers: { "Content-Type": "application/json; charset=utf-8" },
    //     }
    //   );

      // ❌ 業務錯誤 JSON（例如查無資料）
      // 保持 200 + application/json，模擬很多系統的做法
      // return HttpResponse.json(
      //   { code: 500, message: "下載失敗：查無符合條件的資料" },
      //   {
      //     status: 200,
      //     headers: { "Content-Type": "application/json; charset=utf-8" },
      //   }
      // );
  }),
  http.post(`${BASE_URL}/performance/grmDetail`, () => {
    const base64String =
      "UEsDBBQACAgIAJtD+loAAAAAAAAAAAAAAAAYAAAAeGwvZHJhd2luZ3MvZHJhd2luZzEueG1sndBdbsIwDAfwE+wOVd5pWhgTQxRe0E4wDuAlbhuRj8oOo9x+0Uo2aXsBHm3LP/nvzW50tvhEYhN8I+qyEgV6FbTxXSMO72+zlSg4gtdgg8dGXJDFbvu0GTWtz7ynIu17XqeyEX2Mw1pKVj064DIM6NO0DeQgppI6qQnOSXZWzqvqRfJACJp7xLifJuLqwQOaA+Pz/k3XhLY1CvdBnRz6OCGEFmL6Bfdm4KypB65RPVD8AcZ/gjOKAoc2liq46ynZSEL9PAk4/hr13chSvsrVX8jdFMcBHU/DLLlDesiHsSZevpNlRnfugbdoAx2By8i4OPjj3bEqyTa1KCtssV7ercyzIrdfUEsHCAdiaYMFAQAABwMAAFBLAwQUAAgICACbQ/paAAAAAAAAAAAAAAAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbJ2U227jIBCGn2DfweI+xnibHizbVQ+qtndVtd29phjHKBwswIe8/WLioCS+sfZuGP755tcwIn8cBY96qg1TsgAoTkBEJVEVk7sCfP1+29yDyFgsK8yVpAU4UAMeyx/5oPTeNJTayAGkKUBjbZtBaEhDBTaxaql0N7XSAlt31DtoWk1x5YsEh2mS3EKBmQRHQqbXMFRdM0JfFekElfYI0ZRj6+ybhrXmRBPjAicY0cqo2sZEiZnkHBBIR0K9ofsLQ4KscSSw3nftxiFb5+KbcWYP3lfA9AXotMxmxibYmGoy1z/rBT+JR3SzzvdimA/w4cL9iLb/R0IJROgKdYOXs1hvC5NAEusw4UXmFSlzj/zQZa46y5mkHzoynXDDPzxTroYCuMWdE59s19gpAcschjof/GF0MGdxNK3xt1L76fBeXRSda9/8g7uepDNWiV/02AKBqKI17rh9Ufwvq2zjcml8+zPkP9UQxNv4bjvhPfEVW1zmWg2RnjhlTqbgyRGN57oC47J9meSwd5bIrHheKlBQQMcL0DRA00VJegU9KfzdXZxcEeGZ5UrjwX0Okc6Ym5d+r5AfWfgPyn9QSwcI9IfUB7oBAABTBAAAUEsDBBQACAgIAJtD+loAAAAAAAAAAAAAAAAjAAAAeGwvd29ya3NoZWV0cy9fcmVscy9zaGVldDEueG1sLnJlbHONz0sKwjAQBuATeIcwe5PWhYg07UaEbqUeYEimD2weJPHR25uNouDC5czPfMNfNQ8zsxuFODkroeQFMLLK6ckOEs7dcb0DFhNajbOzJGGhCE29qk40Y8o3cZx8ZBmxUcKYkt8LEdVIBiN3nmxOehcMpjyGQXhUFxxIbIpiK8KnAfWXyVotIbS6BNYtnv6xXd9Pig5OXQ3Z9OOF0AHvuVgmMQyUJHD+2r3DkmcWRF2Jr4r1E1BLBwitqOtNswAAACoBAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAABMAAAB4bC90aGVtZS90aGVtZTEueG1szVfbbtwgEP2C/gPivcHXvSm7UbKbVR9aVeq26jOx8aXB2AI2af6+GHttfEuiZiNlXwLjM4czM8CQy6u/GQUPhIs0Z2toX1gQEBbkYcriNfz1c/95AYGQmIWY5oys4RMR8Grz6RKvZEIyApQ7Eyu8homUxQohESgzFhd5QZj6FuU8w1JNeYxCjh8VbUaRY1kzlOGUwdqfv8Y/j6I0ILs8OGaEyYqEE4qlki6StBAQMJwpjYeEECng5iTylpLSQ5SGgPJDoJUPsOG9Xf4RPL7bUg4eMF1DS/8g2lyiBkDlELfXvxpXA8J75yU+p+Ib4np8GoCDQEUxXNtzFv7eq7EGqBoOuW+vPdf1O3iD3x1qubnZWl1+t8V7A7zrXS98t4P3Wrw/EutsZ9kdvN/iZ8N4Zze77ayD16CEpux+gLZt399ua3QDiXL65WV4i0LGzqn8mZzaRxn+k/O9Aujiqu3JgHwqSIQDhbvmKaYlPV4RPG4PxJgd9YizlL3TKi0xMgPVYWfdqL/rI6mjjlJKD/KJkq9CSxI5TcO9MuqJdmqSXCRqWC/XwcUc6zHgufydyuSQ4EItY+sVYlFTxwIUuVCHCU5y66Qcs295eCrr6dwpByxbu+U3dpVCWVln8/aQNvR6FgtTgK9JXy/CWKwrwh0RMXdfJ8K2zqViOaJiYT+nAhlVUQcF4LJr+F6lCIgAUxKWdar8T9U9e6WnktkN2xkJb+mdrdIdEcZ264owtmGCQ9I3n7nWy+V4qZ1RGfPFe9QaDe8Gyroz8KjOnOsrmgAXaxip60wNs0LxCRZDgGmsHieBrBP9PzdLwYXcYZFUMP2pij9LJeGAppna62YZKGu12c7c+rjiltbHyxzqF5lEEQnkhKWdqm8VyejXN4LLSX5Uog9J+Aju6JH/wCpR/twuEximQjbZDFNubO42i73rqj6KIy88/YChRYLrjmJe5hVcjxs5RhxaaT8qNJbCu3h/jq77slPv0pxoIPPJW+z9mryhyh1X5Y/edcuF9XyXeHtDMKQtxqW549KmescZHwTGcrOJvDmT1XxjN+jvWmS8K/Ws90/bybL5B1BLBwhlo4FhKAMAAK0OAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAABQAAAB4bC9zaGFyZWRTdHJpbmdzLnhtbGWOQQrCMBBFT+Adwuw1VUFEknQheAI9QGjHNthMamZa9PZGRFy4fO/z4Jv6EQc1Y+aQyMJ6VYFCalIbqLNwOZ+We1Asnlo/JEILT2So3cIwiyopsYVeZDxozU2P0fMqjUhluaYcvRTMneYxo2+5R5Q46E1V7XT0gUA1aSKxsAU1UbhPePyyMxycEUc+otHijH7zx/nuT91wDvSTurxzL1BLBwjNRYjrnwAAANsAAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAAA0AAAB4bC9zdHlsZXMueG1stVTBbtwgEP2C/gPinsW7iqomsh3l4qiX9pCt1CvGsEYBxgI2tfv1HYzd3dVGahSpPtjMm+G9GWZw+TBaQ16lDxpcRbebghLpBHTaHSr6Y9/cfKEkRO46bsDJik4y0If6UxniZORzL2UkyOBCRfsYh3vGguil5WEDg3ToUeAtj2j6AwuDl7wLaZM1bFcUn5nl2tHMcD9ub7m44rFaeAig4kaAZaCUFvKa6Y7dMS5WJntN80Y6lvuX43CDtAOPutVGx2nOitalAhcDEXB0saK7BajL8Ju8coPnVOBBsboUYMATf2gr2jTF/CTYcStz4KPX3CRozmMBrXbgE8gya35nrpjCUOADNPMnIJ025jJ3BOoSi4zSuwYNsqz304BaDhubaea4f0Qbfejjk+fT2Zb5g8ot+A5HadXe0hVKoYsTC5XGPKfx+akuQkdFcszXrqI4h4l0XWJly9IdbWNXgw+DmR4xJWdlpslQA9lKuudyWfxMd/cx3VG9M4G65KuTpJHFa/U9Sc2bQ++1e9lDo+Ns4zWMWqTWthAjWEp+eT7s5Ti7Uy2jele62/+R7qrPliM8a+RFG/+iJ9k0yBX9lu6eoaQ9ahO1y76LDiFnN56ak72nP039B1BLBwiyOrK81QEAAK4EAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAAA8AAAB4bC93b3JrYm9vay54bWydkktOwzAQhk/AHSLvWyeooDZq0g1C6gaxgAO49qSx6kdkuyG9CxsWSNyAFbcBiWMwDUmk0k3Eys/55pP9L1eNVlENzktrMpJMYxKB4VZIs83I48PtZE4iH5gRTFkDGTmAJ6v8Yvlk3W5j7S7CeuMzUoZQpZR6XoJmfmorMHhSWKdZwKXbUl85YMKXAEErehnH11QzacgvIXVjGLYoJIcby/caTPiFOFAsoL0vZeV7mm7OcFpyZ70twpRb3ZHQgFNoOLRC8xMhzccYaeZ2+2qCyAotNlLJcGi9Bkydkb0zaceYDBrHmhT7p7VW/eUmmY3zPnvMBV2c2DfJ1f9ISUyT5A9qxs7fYrwW4wNJj8MMP9JFJB/idu9ovmz5vhuP6QwYzFp6uVFAIsM0Lr/eXz8/nr9f3hLM7/HeWmC8SeRSiRO3FjOCJNqjBBTSgLjDWo/7nCnetqJ94/wHUEsHCAsH7dFaAQAAKgMAAFBLAwQUAAgICACbQ/paAAAAAAAAAAAAAAAAGgAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzrZJBasMwEEVP0DuI2deyk1JKiZxNKGTbpgcQ0tgysSUhTdr69p024DoQQhdeif/F/P/QaLP9GnrxgSl3wSuoihIEehNs51sF74eX+ycQmbS3ug8eFYyYYVvfbV6x18Qz2XUxCw7xWYEjis9SZuNw0LkIET3fNCENmlimVkZtjrpFuSrLR5nmGVBfZIq9VZD2tgJxGCP+Jzs0TWdwF8xpQE9XKiTxLHKgTi2Sgl95NquCw0BeZ1gtyZBp7PkNJ4izvlW/XrTe6YT2jRIveE4xt2/BPCwJ8xnSMTtE+gOZrB9UPqbFyIsfV38DUEsHCJYZwVPqAAAAuQIAAFBLAwQUAAgICACbQ/paAAAAAAAAAAAAAAAACwAAAF9yZWxzLy5yZWxzjc9BDoIwEAXQE3iHZvZScGGMobAxJmwNHqC2QyFAp2mrwu3tUo0Ll5P5836mrJd5Yg/0YSAroMhyYGgV6cEaAdf2vD0AC1FaLSeyKGDFAHW1KS84yZhuQj+4wBJig4A+RnfkPKgeZxkycmjTpiM/y5hGb7iTapQG+S7P99y/G1B9mKzRAnyjC2Dt6vAfm7puUHgidZ/Rxh8VX4kkS28wClgm/iQ/3ojGLKHAq5J/PFi9AFBLBwikb6EgsgAAACgBAABQSwMEFAAICAgAm0P6WgAAAAAAAAAAAAAAABMAAABbQ29udGVudF9UeXBlc10ueG1stVPLTsMwEPwC/iHyFTVuOSCEmvbA4whIlA9Y7E1j1S953dffs0laJKoggdRevLbHOzPrtafznbPFBhOZ4CsxKceiQK+CNn5ZiY/F8+hOFJTBa7DBYyX2SGI+u5ou9hGp4GRPlWhyjvdSkmrQAZUhomekDslB5mVayghqBUuUN+PxrVTBZ/R5lFsOMZs+Yg1rm4uHfr+lrgTEaI2CzL4kk4niacdgb7Ndyz/kbbw+MTM6GCkT2u4MNSbS9akAo9QqvPLNJKPxXxKhro1CHdTacUpJMSFoahCzs+U2pFU37zXfIOUXcEwqd1Z+gyS7MCkPlZ7fBzWQUL/nxI2mIS8/DpzTh06wZc4hzQNEx8kl6897i8OFd8g5lTN/CxyS6oB+vGirOZYOjP/tzX2GsDrqy+5nz74AUEsHCG2ItFA1AQAAGQQAAFBLAQIUABQACAgIAJtD+loHYmmDBQEAAAcDAAAYAAAAAAAAAAAAAAAAAAAAAAB4bC9kcmF3aW5ncy9kcmF3aW5nMS54bWxQSwECFAAUAAgICACbQ/pa9IfUB7oBAABTBAAAGAAAAAAAAAAAAAAAAABLAQAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sUEsBAhQAFAAICAgAm0P6Wq2o602zAAAAKgEAACMAAAAAAAAAAAAAAAAASwMAAHhsL3dvcmtzaGVldHMvX3JlbHMvc2hlZXQxLnhtbC5yZWxzUEsBAhQAFAAICAgAm0P6WmWjgWEoAwAArQ4AABMAAAAAAAAAAAAAAAAATwQAAHhsL3RoZW1lL3RoZW1lMS54bWxQSwECFAAUAAgICACbQ/pazUWI658AAADbAAAAFAAAAAAAAAAAAAAAAAC4BwAAeGwvc2hhcmVkU3RyaW5ncy54bWxQSwECFAAUAAgICACbQ/pasjqyvNUBAACuBAAADQAAAAAAAAAAAAAAAACZCAAAeGwvc3R5bGVzLnhtbFBLAQIUABQACAgIAJtD+loLB+3RWgEAACoDAAAPAAAAAAAAAAAAAAAAAKkKAAB4bC93b3JrYm9vay54bWxQSwECFAAUAAgICACbQ/palhnBU+oAAAC5AgAAGgAAAAAAAAAAAAAAAABADAAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHNQSwECFAAUAAgICACbQ/papG+hILIAAAAoAQAACwAAAAAAAAAAAAAAAAByDQAAX3JlbHMvLnJlbHNQSwECFAAUAAgICACbQ/pabYi0UDUBAAAZBAAAEwAAAAAAAAAAAAAAAABdDgAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLBQYAAAAACgAKAJoCAADTDwAAAAA=";

    const bytes = base64ToUint8Array(base64String);

    // ✅ 成功：回傳 XLSX（二進位）
    return HttpResponse.arrayBuffer(bytes.buffer, {
      headers: {
        "Content-Type":
          "application/octet-stream",
        "Content-Disposition": "attachment; filename=performance_detail.xlsx",
      },
    });
  }),
  http.post(`${BASE_URL}/forecast/loan/bootstrap`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/list`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/exchangeRate/USD`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/add`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/delete/23063`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/selectOne/23063`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/clientdata/A123205433`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/loan/update`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/bootstrap`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/exchangeRate/EUR`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/add`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/list`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/selectOne/31`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/update`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
  http.post(`${BASE_URL}/forecast/deposit/delete/31/983`, (resolverInfo) => {
    return mockResolver(resolverInfo);
  }),
    http.post(`${BASE_URL}/forecast/deposit/export`, () => {
    const base64String =
      "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";

    const bytes = base64ToUint8Array(base64String);

    // ✅ 成功：回傳 XLSX（二進位）
    return HttpResponse.arrayBuffer(bytes.buffer, {
      headers: {
        "Content-Type":
          "application/octet-stream",
        "Content-Disposition": "attachment; filename=performance_detail.xlsx",
      },
    });
  }),
];

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64); // 解碼為 binary string（每個字元 = 一個 byte）
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
