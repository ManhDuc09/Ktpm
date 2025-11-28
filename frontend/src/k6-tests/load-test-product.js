import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 1000,        // 1000 concurrent users
    duration: '30s',  // run for 30 seconds
};

export default function () {

    let res = http.get('http://localhost:8080/api/products/1');

    check(res, { 'get products successful': (r) => r.status === 200 });


    sleep(1);
}
