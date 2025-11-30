import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 100 },   
        { duration: '30s', target: 300 },   
        { duration: '30s', target: 500 },   
        { duration: '30s', target: 800 },   
        { duration: '30s', target: 1000 },  
        { duration: '30s', target: 1200 },  
        { duration: '30s', target: 0 },     
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'], 
    },
};

export default function () {
    const res = http.post(
        "http://localhost:8080/api/auth/login",
        JSON.stringify({ email: "testuser@gmail.com", password: "Test123456" }),
        { headers: { "Content-Type": "application/json" } }
    );

    check(res, { "login successful": (r) => r.status === 200 });
    sleep(1);
}
