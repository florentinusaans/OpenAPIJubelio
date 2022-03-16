import { check, group } from "k6";
import http from "k6/http";

// export const options = { vus: 1, duration: "1s" };

export default function main(){
    let response;
    let accessToken;
    const clientKey = 'kintakun';
    const clientSecret = '5876509264279814340158765092642798143401';
    const timeRangeField = 'created_date';
    const timeFrom = '2020-02-13 13:20:06';
    const timeTo = '2020-02-14 13:20:06';
    const status = 'inactive';
    const pageSize = 2;
    const offset = 1;
    let productId;

    group("Step 1 - generate Token", function () {
        response = http.post('http://evm-auth.dev.internal/open/v1/generate',
            `{"clientKey":"${clientKey}","clientSecret":"${clientSecret}"}`,
            {
                headers :{
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Respponse Body Step 1 : "+response.body)
        accessToken = response.json()['data']['accessToken']
        check(response, {
            'Get Token Valid Params is status 200': (r) => r.status === 200,
        });
    })

    group("Step 6 - get Product List Valid Params", function () {
        response = http.get(encodeURI(`http://evm-product.dev.internal/v3/external/product/list?timeRangeField=${timeRangeField}&timeFrom=${timeFrom}&timeTo=${timeTo}&status=${status}&pageSize=${pageSize}&offset=${offset}`),
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        );
        console.log("Respponse Body Step 6 : "+response.body)
        productId = response.json()['data']['productList'][0]['id']
        console.log(`Check product id : ${productId}`)
        check(response, {
            'Get Product List is status 200': (r) => r.status === 200
        });
    })

    group("Step 13 - get Product Detail Valid Params", function () {
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        );
        console.log("Respponse Body Step 13 : "+response.body)
        check(response, {
            'Get Product Detail is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })

    group("Step 14 - get Product Detail Check Mandatory Field", function () {
        const productId1='';
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId1}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        );
        console.log("Respponse Body Step 14 : "+response.body)
        check(response, {
            'Get Product Detail is status 404': (r) => r.status === 404,
            // 'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            // 'error is string': (r) => typeof r.json()['error'] === 'string',
            // 'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Step 15 - get Product Detail Check Data Type", function () {
        const productId2=123456789012345678901;
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId2}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        );
        console.log("Respponse Body Step 15 : "+response.body)
        check(response, {
            'Get Product Detail is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Step 16 - get Product Detail Invalid Token", function () {
        const accessToken2='1446824813660774558114468248136607745582';
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken2}`,
            },
            cookies : {accessToken : `${accessToken2}`}
        }
        );
        console.log("Respponse Body Step 16 : "+response.body)
        check(response, {
            'Get Product Detail is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Step 17 - get Product Detail Expired Token", function () {
        const accessToken3='1446824813660774558114468248136607745589';
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken3}`,
            },
            cookies : {accessToken : `${accessToken3}`}
        }
        );
        console.log("Respponse Body Step 17 : "+response.body)
        check(response, {
            'Get Product Detail is status 401': (r) => r.status === 401,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Step 18 - get Product Detail Unregister ProductId", function () {
        const productId3='987a9945-9446-4c18-8591-ca9d2541e0f0';
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId3}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        );
        console.log("Respponse Body Step 18 : "+response.body)
        check(response, {
            'Get Product Detail is status 404': (r) => r.status === 404,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data is empty' : (r) => r.json()['data'] === null
        });
    })

    group("Step 19 - get Product Detail Invalid ProductId", function () {
        const productId3='987a9945-9446-4c18-8591-ca9d2541e999';
        response = http.get(`http://evm-product.dev.internal/v3/external/product/${productId3}`,
        {
            headers :{
                "Content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        );
        console.log("Respponse Body Step 19 : "+response.body)
        check(response, {
            'Get Product Detail is status 404': (r) => r.status === 404,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data is empty' : (r) => r.json()['data'] === null
        });
    })
}