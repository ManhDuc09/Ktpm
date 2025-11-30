import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 100,     //100 users , 30 seconds
    duration: '30s',
};

export default function () {
    let res = http.post(
        "http://localhost:8080/api/auth/login",
        JSON.stringify({ email: "testuser@gmail.com", password: "Test123456" }),
        { headers: { "Content-Type": "application/json" } }
    );

    check(res, { "login successful": (r) => r.status === 200 });
  
}
