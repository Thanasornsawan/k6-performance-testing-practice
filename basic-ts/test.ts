import http from 'k6/http';
import {check, sleep, fail} from 'k6';

// minimal load as sanity check : smoke test
export const smoketest_options = {
    vus: 2, //1 user looping for 13 second
    duration: '13s',

    thresholds: {
        http_req_duration: ['p(99)<400'], //99% of requests must complete below 400 ms
    },
};

// test system under typical or peak load
// typical is you receive 100 rps on API and sometime 
// you just get a huge load and you want to make sure that your API and service can handle it
// performance asessment - load testing
export const loadTest_options = {
    stages: [
        { duration: '20s', target: 100 }, // simulate ramp up of traffic from 1 to 100 users over 20 seconds
        { duration: '2m', target: 1000}, // stay at 1000 users for 10 minutes
        { duration: '20s', target: 5}, // ramp down to 5 users
    ],
    thresholds: {
        'http_req_duration': ['p(99)<500'], //99% or requests must complete below 0.5s
    },
};

// system stability under extreme condition
// stress testing 
// what's the maximum capacity of my system in term of users or tps
// or where is the breaking point in my system
// what's the failure mode if I want to handle it by put a lots traffic on it
// and the last one is I jsut want to make sure that the system will recover
// without manual interaction (if something go wrong, it recover or not)
// what is the recover point of the system
export const stressTest_options = {
    stages: [
        { duration: '2m', target: 100}, // below normal load
        { duration: '5m', target: 100},
        { duration: '2m', target: 200}, // normal load
        { duration: '5m', target: 200},
        { duration: '2m', target: 300}, // around the breaking point
        { duration: '5m', target: 300},
        { duration: '2m', target: 400}, // beyond the breaking point
        { duration: '5m', target: 400},
        { duration: '10m', target: 0}, // scale down. Recovery stage
    ],
};

// soak testing is focus on reliability over a long period
// You want to make sure or verify that the system doesn't suffer from 
// Bug, memory leak which results in crash, verify that no bug relate to race conditions
// and make sure that database doesn't exhaust if there are a lots request coming
// we want to make sure that the external service that we depend on don't stop working after certain amount of request
export const soakTest_options = {
    stages: [
        { duration: '2m', target: 400 }, // ramp up to 400 users
        { duration: '3h56m', target: 400 }, // stay at 400 for 4 hours
        { duration: '2m', target: 0 }, // scale down (optiona;)
    ],
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