import { check } from 'k6';
import http from 'k6/http';

const domain = 'https://test.k6.io';
/*
By default, each k6 user sends each request in the script sequentially. To change this behavior, you can use batching.
Batching signals to k6 that the requests within a batch must be sent simultaneously, and you can use it like this:
*/
export default function () {
    let responses = http.batch([
        ['GET', domain + '/'],
        ['GET', domain + '/contacts.php'],
        ['GET', domain + '/news.php'],
    ])
  check(responses[0], {
    'Homepage successfully loaded': (r) => r.body.includes("Collection of simple web-pages suitable for load testing"),
  });
}