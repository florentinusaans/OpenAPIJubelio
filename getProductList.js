import { check, group } from "k6";
import http from "k6/http";

export const options = { vus: 1, duration: "1s" };

export default function main(){
    let response;
    let accessToken;
    const clientKey = 'kintakun';
    const clientSecret = '5876509264279814340158765092642798143401';

    group("Test Case 1 - generate Token", function () {
    response = http.post('http://evm-auth.dev.internal/open/v1/generate',
        `{"clientKey":"${clientKey}","clientSecret":"${clientSecret}"}`,
        {
            headers :{
                "Content-Type": "application/json",
            },
        }
    );
    console.log("Respponse Body Test Case 1 : "+response.body)
    accessToken = response.json()['data']['accessToken']
    check(response, {
        'Get Token is status 200': (r) => r.status === 200,
    });
    })

    group("Test Case 6 - get Product List Valid Params", function () {
        const timeRangeField = 'updated_date';
        const timeFrom = '2022-03-07 00:00:00';
        const timeTo = '2022-03-09 00:00:00';
        const status = 'inactive';
        const pageSize = "5";
        const offset = 1;
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 6 : "+response.body)
        let productId = response.json()['data']['productList'][0]['id']
        console.log(`Check product id : ${productId}`)
        check(response, {
            'Get Product List is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })

    group("Test Case 7 - get Product List Check Mandatory Field", function () {
        const timeRangeField = '';
        const timeFrom = '';
        const timeTo = '';
        const status = '';
        const pageSize = '';
        const offset = '';
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 7 : "+response.body)
        check(response, {
            'Get Product List is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 8 - get Product List Check Data Type", function () {
        const timeRangeField = 'created_date';
        const timeFrom = '2020-02-13';
        const timeTo = '2020-02-14';
        const status = 'inactive';
        const pageSize = "5";
        const offset = 1;
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 8 : "+response.body)
        check(response, {
            'Get Product List is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 9 - get Product List Invalid Token", function () {
        const accessToken2="1446824813660774558114468248136607745582"
        const timeRangeField = 'created_date';
        const timeFrom = '2020-02-13 00:00:00';
        const timeTo = '2020-02-14 00:00:00';
        const status = 'inactive';
        const pageSize = "5";
        const offset = 1;
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken2}`,
                },
                cookies : {accessToken : `${accessToken2}`}
            }
        );
        console.log("Respponse Body Test Case 9 : "+response.body)
        check(response, {
            'Get Product List is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 10 - get Product List Expired Token", function () {
        const accessToken3="1446824813660774558114468248136607745589"
        const timeRangeField = 'created_date';
        const timeFrom = '2020-02-13 00:00:00';
        const timeTo = '2020-02-14 00:00:00';
        const status = 'inactive';
        const pageSize = "5";
        const offset = 1;
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken3}`,
                },
                cookies : {accessToken : `${accessToken3}`}
            }
        );
        console.log("Respponse Body Test Case 10 : "+response.body)
        check(response, {
            'Get Product List is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 11 - get Product List timeFrom>timeTo", function () {
        const timeRangeField = 'updated_date';
        const timeFrom = '2022-03-08 00:00:00';
        const timeTo = '2022-03-07 00:00:00';
        const status = 'inactive';
        const pageSize = "5";
        const offset = 1;
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 11 : "+response.body)
        check(response, {
            'Get Product List is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })

    group("Test Case 12 - get Product List timeFrom=timeTo", function () {
        const timeRangeField = 'created_date';
        const timeFrom = '2020-02-13 13:20:06';
        const timeTo = '2020-02-13 13:20:06';
        const status = 'inactive';
        const pageSize = "5";
        const offset = 1;
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
            {
                headers :{
                    "Content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
                cookies : {accessToken : `${accessToken}`}
            }
        );
        console.log("Respponse Body Test Case 12 : "+response.body)
        let productId = response.json()['data']['productList'][0]['id']
        console.log(`Check product id : ${productId}`)
        check(response, {
            'Get Product List is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })
}