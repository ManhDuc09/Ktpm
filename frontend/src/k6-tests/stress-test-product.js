import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 200 },   // ramp up
        { duration: '1m', target: 400 },
        { duration: '1m', target: 600 },
        { duration: '1m', target: 800 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 1200 },
        { duration: '2m', target: 0 }      // ramp down
    ]
};

export default function () {
    // GET list of products for user 1
    let res = http.get('http://localhost:8080/api/products/1');

    check(res, { 'get products successful': (r) => r.status === 200 });

    sleep(1);
}
