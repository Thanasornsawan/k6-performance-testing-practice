import http from 'k6/http';
import {check, sleep, fail} from 'k6';

/*

    Soak testing is used to validate realiability of the system over a long time

    Run a soak test to:
    - Verify that your system doesn't suffer from bugs or memory leaks, which result in a crash or restart after
    - Verify that expected application restart don't lose requests
    - Find bugs relate to race-conditions that appear sporadically
    - Make sure your database doesn't exhaust the allotted storage space and stops
    - Make sure your logs don't exhaust the allotted disk storage
    - Make sure the external services you depend on don't stop working after a certain amount of requests are execute

    How to run a soak test:
    - Determine the maximum amount of users your system can handle
    - Get the 75-80% of that value
    - set VUs to that value
    - Run the test in 3 stages. Ramp up to the VUs, stay there for 4-12 hours, ramp down to 0

*/

export const options = {
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