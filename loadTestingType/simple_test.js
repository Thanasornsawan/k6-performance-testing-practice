import http from 'k6/http';
import {check, sleep, fail} from 'k6';

export default function() {
    const response = http.post('http://localhost:8000/user');
    check(response, {
        "is status 201": (r) => r.status === 201,
    })
}