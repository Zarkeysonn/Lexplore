import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 1 },
    // { duration: "15s", target: 20 },
    // { duration: "1m", target: 500 },
    // { duration: "10", target: 10 },
    // // { duration: "1m30s", target: 110 },
    // // { duration: "20s", target: 10 },
    // { duration: "15s", target: 2 },
    // { duration: "2s", target: 0 },
  ],
};

export default function () {
  //const res = http.get("https://httpbin.test.k6.io/");
  const jar = http.cookieJar();
  jar.set(
    "https://readingservicesdev.lexplore.com/books?libraryType=readingDiary",
    "devSessionId",
    "dyg08xa35",
    {
      domain: ".lexplore.com",
      path: "/",
      secure: true,
    }
  );

  const res = http.get(
    "https://readingservicesdev.lexplore.com/books?libraryType=readingDiary"
  ); //pokusaj sa ovim nasim studentom
  check(res, { "status was 200": (r) => r.status == 200 });
}
