import { check, group } from "k6";
import http from "k6/http";

// export const options = { vus: 1, duration: "1s" };

export default function main(){
    let response;
    let accessToken;
    const clientKey = 'kintakun';
    const clientSecret = '5876509264279814340158765092642798143401';

    group("Test Case 1 - Generate Token", function () {
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
            'Get Token is status 200': (r) => r.status === 200
        });
    })

    group("Test Case 92 - Stock Sync Positive Value",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 30;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 92 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 93 - Stock Sync Negative Value",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = -40;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 93 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is object': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 94 - Stock Sync Check Mandatory Field",function(){
        const varianrId='';
        const stock = '';
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 94 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 95 - Stock Sync Check Data Type",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = "40";
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": "${stock}"}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 95 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error type is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 96 - Stock Sync Invalid Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = "40";
        const brandId='1322';
        const userId='100000413728';
        const accessToken2 = '1446824813660774558114468248136607745582'
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken2}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken2}`}
        }
        )
        console.log("Response Body Test Case 96 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 97 - Stock Sync Expired Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = "40";
        const brandId='1322';
        const userId='100000413728';
        const accessToken3 = '1446824813660774558114468248136607745589'
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken3}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken3}`}
        }
        )
        console.log("Response Body Test Case 97 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 98 - Stock Sync Unregister VariantId",function(){
        const varianrId='6540889f-3830-4182-8477-0770a18ddd26';
        const stock = "40";
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 98 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty':(r) => r.json()['data']['failureList'].length !== 0,
            'successList is empty':(r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 99 - Stock Sync Invalid VariantId",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e8999999';
        const stock = "40";
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 99 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty':(r) => r.json()['data']['failureList'].length !== 0,
            'reason type is string': (r) => typeof r.json()['data']['failureList'][0]['reason'] === 'string',
            'successList is empty':(r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 100 - Stock Sync Unregister BrandId",function(){
        const varianrId='202edb9a-9154-4121-82b4-5e5d8d67030e';
        const stock = "40";
        const brandId='1323';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 100 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty':(r) => r.json()['data']['failureList'].length !== 0,
            'reason type is string': (r) => typeof r.json()['data']['failureList'][0]['reason'] === 'string',
            'successList is empty':(r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 101 - Stock Sync Invalid BrandId",function(){
        const varianrId='202edb9a-9154-4121-82b4-5e5d8d67030e';
        const stock = "40";
        const brandId='9999';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 101 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is not empty':(r) => r.json()['data']['failureList'].length !== 0,
            'reason type is string': (r) => typeof r.json()['data']['failureList'][0]['reason'] === 'string',
            'successList is empty':(r) => r.json()['data']['successList'].length === 0
        });
    })

    group("Test Case 102 - Stock Sync Invalid UserId",function(){
        const varianrId='202edb9a-9154-4121-82b4-5e5d8d67030e';
        const stock = "40";
        const brandId='1322';
        const userId='100999999999';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken}`}
        }
        )
        console.log("Response Body Test Case 102 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })
}