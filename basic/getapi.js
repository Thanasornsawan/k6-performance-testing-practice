//k6 run getapi.js 
import http from 'k6/http';
import {sleep} from 'k6';

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
    }
}

export default function(){
    http.get('https://k6.io');
    sleep(1);
}