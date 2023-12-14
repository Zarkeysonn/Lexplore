import http from "k6/http";
import { check, sleep } from "k6";
import loginData from "../fixtures/cookies.json";
import data from "../fixtures/cookies.json";
import { SharedArray } from "k6/data";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: "5s", target: 1 },
    { duration: "15s", target: 50 },
    { duration: "1s", target: 50 },
    { duration: "10s", target: 1 },
  ],
};

const dataC = new SharedArray("some data nem", function () {
  return JSON.parse(open("../fixtures/cookies.json"));
});

export default function () {
  const cookieData = dataC[randomIntBetween(0, 2)].devSessionId;
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
  );
  check(res, { "status was 200": (r) => r.status == 200 });
}
