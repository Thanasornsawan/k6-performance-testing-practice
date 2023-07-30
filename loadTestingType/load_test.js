import http from 'k6/http';
import {check, sleep, fail} from 'k6';

/*
    command
    go install go.k6.io/xk6/cmd/xk6@latest
    xk6 build --with github.com/szkiba/xk6-dashboard@latest
    ./k6 run --out json=test_result.json --out dashboard loadTestingType/load_test.js
    ./k6 dashboard replay test_result.json --open
    --------------------------------------------
    Load testing is primarily concerned with assessing the current performance of your system
    in terms of concurrent users or requests per second.
    When you want to understand if your system is meeting the performance goals, this is the type of test you'll run.

    Run a load test to:
    - Assess the current performance of your system under typical and peak load
    - Make sure you are continuously meeting the performance standards as you make changes to your system

    Can be used to simulate a normal day in your business
    How many users you can handle? How many request per second you can handle?
    It is probably the test you want to run first to get benchmark and determine how far you can push your system in other tests
    for example: stress and spike.
    It can be benchmark between previous commit and current commit that the current commit response in 2 ms but the previous commit 
    response in 1 ms.So, the system twice slow
*/

export const options = {
    stages: [
        { duration: '5m', target: 100 }, // simulate ramp up of traffic from 1 to 100 users over 5 minutes
        { duration: '10m', target: 1000}, // stay at 1000 users for 10 minutes
        { duration: '5m', target: 0}, // ramp down to 0 user
    ],
    thresholds: {
        'http_req_duration': ['p(99)<500'], //99% or requests must complete below 0.5s
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