import http from 'k6/http';
import {check, sleep, fail} from 'k6';

/*
    Spike test is a variation of a stress test, but it does not gradually increase the load,
    instread it spikes to extreme load over a very short window of time (verfy fast spike to high load)
    
    Run a stress test to:
    - Determine how your system will perform under a sudden surge of traffic
    - Determine if your system will recover once the traffic has subsided

    Success is based on expectations. Systems will generally react in 1 of 4 ways
    - Excellent: system performance is not degraded during the surge of traffic.
      Response time is similar during low traffic and high traffic
    - Good: Response time is slower. but the system does not product any errors.
      All requests are handled
    - Poor: System products errors during the surge of traffic, but recovers to normal after the traffic subsided
    - Bad: System crashes, and does not recover after the traffic has subsided.

*/
export const options = {
    stages: [
        { duration: '10s', target: 100}, // below normal load
        { duration: '1m', target: 100},  // warming up the service by stay a bit 1 min.
        { duration: '10s', target: 1400}, // spike to 1400 users
        { duration: '3m', target: 1400}, // stay at 1400 for 3 minutes
        { duration: '10s', target: 100}, // scale down. Recovery stage
        { duration: '3m', target: 100},
        { duration: '10s', target: 0}, 
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