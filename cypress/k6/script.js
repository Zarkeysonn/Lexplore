import http from "k6/http";
import { check, sleep } from "k6";
import loginData from "../fixtures/cookies.json";
import data from "../fixtures/cookies.json";
import { SharedArray } from "k6/data";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

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

const dataC = new SharedArray("some data nem", function () {
  return JSON.parse(open("../fixtures/cookies.json"));
});

export default function () {
  const cookieData = dataC[randomIntBetween(0, 2)].devSessionId;
  console.log(cookieData, "COOKIE DATA");
  const jar = http.cookieJar();
  jar.set(
    "https://readingservicesdev.lexplore.com/books?libraryType=readingDiary",
    "devSessionId",
    cookieData,
    {
      domain: ".lexplore.com",
      path: "/",
      secure: true,
    }
  );

  const res = http.get(
    "https://readingservicesdev.lexplore.com/books?libraryType=readingDiary"
  ); //pokusaj sa ovim nasim studentom
  console.log(res.body);
  check(res, { "status was 200": (r) => r.status == 200 });
}
