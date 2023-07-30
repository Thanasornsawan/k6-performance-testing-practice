//k6 run getapi.js 
import http from 'k6/http';
import {sleep, check} from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

/*

VUs = (numHourlySessions * avgSessionDurationInSecs)/3600
example: 10,000 sessions in an hour
that each session last 10 second => 10000 * 10/ 3600 = 27 virtual users

Use data from different times to:
- Simulate regular traffic
- Simulate busiest/peak hour
- Stress test your system
*/

export const options={
    scenarios: {
        contacts: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 200,
            maxDuration: '30s',
        }
    },
    thresholds: {
        http_req_duration: ["p(90)<600"],
    }
}

export default function(){
    const res = http.get('https://k6.io');
    sleep(1);
    check(res, {
        'is status 200': (r) => r.status === 200
    });
}

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
}