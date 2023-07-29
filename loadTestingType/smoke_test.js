import http from 'k6/http';
import {check, sleep, fail} from 'k6';

// minimal load as sanity check : smoke test
export const options = {
    vus: 2, //1 user looping for 13 second
    duration: '13s',

    thresholds: {
        http_req_duration: ['p(99)<400'], //99% of requests must complete below 400 ms
    },
};

export default function() {
    const response = http.post('http://localhost:8000/user');
    if(!check(response, {
        "is status 201": (r) => r.status === 201,
    })){
        //if status not 201 just fail the error
        fail('failed to get 201 response code')
    }
    // wait 1 second every iterations
    sleep(1);
}