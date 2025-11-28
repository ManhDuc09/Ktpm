import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 100 },   // Ramp-up to 100 users
        { duration: '30s', target: 300 },   // Ramp-up to 300 users
        { duration: '30s', target: 500 },   // Ramp-up to 500 users
        { duration: '30s', target: 800 },   // Ramp-up to 800 users
        { duration: '30s', target: 1000 },  // Ramp-up to 1000 users
        { duration: '30s', target: 1200 },  // Ramp-up to 1200 users
        { duration: '30s', target: 0 },     // Ramp-down
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'], // allow up to 10% failed requests
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
