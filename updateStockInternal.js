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

    group("Test Case 80 - Add Stock",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 3;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 80 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 81 - Reduce Stock",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = -2;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 81 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 82 - Update Stock Check Mandatory Field",function(){
        const varianrId='';
        const stock = null;
        const brandId='';
        const userId='';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 82 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 83 - Update Stock Check Data Type",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = -2;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 83 : "+response.body)
        check(response, {
            'Update Stock is status 400': (r) => r.status === 400,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'error is string': (r) => typeof r.json()['error'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
        });
    })

    group("Test Case 84 - Update Stock Invalid Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 2;
        const brandId='1322';
        const userId='100000413728';
        const accessToken2 = '1446824813660774558114468248136607745582';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken2}`}
        }
        )
        console.log("Respponse Body Test Case 84 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 85 - Update Stock Expired Token",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 2;
        const brandId='1322';
        const userId='100000413728';
        const accessToken3 = '1446824813660774558114468248136607745589';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
        `{"variants": [{"id": "${varianrId}","stock": ${stock}}]}`,
        {
            headers :{
                "Content-Type": "application/json",
                UserId: `${userId}`,
                Authorization: `Bearer ${accessToken}`,
                BrandId: `${brandId}`,
            },
            cookies : {accessToken : `${accessToken3}`}
        }
        )
        console.log("Respponse Body Test Case 85 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
            'failureList is empty':(r) => r.json()['data']['failureList'].length === 0,
            'successList is not empty':(r) => r.json()['data']['successList'].length !== 0
        });
    })

    group("Test Case 86 - Update Stock Unregister VariantId",function(){
        const varianrId='f0525554-8c1c-48d5-a6aa-76be1db89853';
        const stock = 3;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 86 : "+response.body)
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

    group("Test Case 87 - Update Stock Invalid VariantId",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d1999';
        const stock = 3;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 87 : "+response.body)
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

    group("Test Case 88 - Update Stock Unregister BrandId",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 3;
        const brandId='1323';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 88 : "+response.body)
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

    group("Test Case 89 - Update Stock Invalid BrandId",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 3;
        const brandId='9999';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 89 : "+response.body)
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

    group("Test Case 90 - Update Stock Invalid UserId",function(){
        const varianrId='25212037-87b6-4903-9c68-57c4e81d14c7';
        const stock = 3;
        const brandId='1322';
        const userId='100000999999';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 90 : "+response.body)
        check(response, {
            'Update Stock is status 200': (r) => r.status === 200,
            'requestId type is string': (r) => typeof r.json()['requestId'] === 'string',
            'message is string': (r) => typeof r.json()['message'] === 'string',
            'data type is object': (r) => typeof r.json()['data'] === 'object',
        });
    })

    group("Test Case 91 - Reduce Stock more than ready stock",function(){
        const varianrId='63236729-9462-4b13-a70d-528320fb247e';
        const stock = -12;
        const brandId='1322';
        const userId='100000413728';
        response = http.put('http://evm-product.dev.internal/v3/internal/variant/stock/add',
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
        console.log("Respponse Body Test Case 91 : "+response.body)
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

}