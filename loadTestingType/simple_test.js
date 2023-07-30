import http from 'k6/http';
import {check, sleep, fail} from 'k6';
// ./k6 run --out dashboard=open  loadTestingType/simple_test.js
export default function() {
    const response = http.post('http://localhost:8000/user');
    check(response, {
        "is status 201": (r) => r.status === 201,
    })
}