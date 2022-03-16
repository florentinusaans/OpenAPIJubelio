import { check, group } from "k6";
import http from "k6/http";

export const options = { vus: 1, duration: "1s" };

export default function main(){
    let response;
    let accessToken;

    group("Test Case 1 - Generate Token", function () {
        const clientKey = 'kintakun';
        const clientSecret = '5876509264279814340158765092642798143401';

        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey}","clientSecret":"${clientSecret}"}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Response Body Test Case 1 : "+response.body)
        accessToken = response.json()['data']['accessToken']
        check(response, {
            'Get Token is status 200': (r) => r.status === 200,
            'Token is not empty': (r) => r.json()['data']['accessToken'] !== undefined,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'accessToken type is string': (r) => typeof r.json()['data']['accessToken'] === 'string',
            'expiresIn type is number': (r) => typeof r.json()['data']['expiresIn'] === 'number',
        });
    })

    group("Test Case 2 - Generate Token Invalid Client Key", function () {
        const clientKey2 = 'kakarak';
        const clientSecret2 = '5876509264279814340158765092642798143401';
        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey2}","clientSecret":"${clientSecret2}"}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Response Body Test Case 2 : "+response.body)
        check(response, {
            'Get Token is status 404': (r) => r.status === 404,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        })
    })

    group("Test Case 3 - Generate Token Invalid Client Secret", function () {
        const clientKey3 = 'kintakun';
        const clientSecret3 = '5876509264279814340158765092642798143400';
        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey3}","clientSecret":"${clientSecret3}"}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Response Body Test Case 3 : "+response.body)
        check(response, {
            'Get Token is status 404': (r) => r.status === 404,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        })
    })

    group("Test Case 4 - Generate Token Check Data Type", function () {
        const clientKey4 = '';
        const clientSecret4 = '';
        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey4}","clientSecret":"${clientSecret4}"}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Response Body Test Case 4 : "+response.body)
        check(response, {
            'Get Token is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        })
    })

    group("Test Case 5 - Generate Token Check Data Type", function () {
        const clientKey5 = 'kintakun';
        const clientSecret5 = "5876509264279814340158765092642798143401";
        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey5}","clientSecret":${clientSecret5}}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Response Body Test Case 5 : "+response.body)
        check(response, {
            'Get Token is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        })
    })
}