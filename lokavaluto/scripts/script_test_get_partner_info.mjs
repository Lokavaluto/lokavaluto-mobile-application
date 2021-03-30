import https from 'https';

const URL_PARTNER = 'https://laroue.v12.dev.myceliandre.fr/lokavaluto_api/private/partner/?name=a patons rompus';
const URL_AUTH = 'https://laroue.v12.dev.myceliandre.fr/lokavaluto_api/public/auth/authenticate';

function runPost(url, jsonData, options) {
    const data = JSON.stringify(jsonData);
    console.log('runRequest', url, data, options);
    return new Promise((resolve, reject) => {
        const req = https.request(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                },
                ...options
            },
            (res) => {
                let data = '';
                
                res.on('data', chunk => {
                  data += chunk.toString('utf8');
                });
                res.on('end', () => {
                  resolve(JSON.parse(data));
                });
            }
        );

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}
function runGet(url, options) {
    console.log('runRequest', encodeURI(url), options);
    return new Promise((resolve, reject) => {
        https.get(encodeURI(url), options, (res) => {
          let data = '';
          res.on('data', chunk => {
            data += chunk.toString('utf8');
          });
          res.on('end', () => {
            resolve(JSON.parse(data));
          });
          res.on('error', (error) => {
              reject(error);
          });
        });
    });
}

try {
    let res = await runPost(
        `${URL_AUTH}`,
        {
            db: 'laroue.v12.dev.myceliandre.fr',
            params: ['lcc_app']
        },
        {
            auth: 'martin.guillon@akylas.fr:1234'
        }
    );
    console.log('token info : ', res);
    const api_token = res.response.api_token;
    console.log('api_token : ', api_token);
    res = await runGet(`${URL_PARTNER}`, { method: 'GET', headers:{

      'API-KEY': api_token
    }
    });
    console.log('Partner info : ', res);
} catch (err) {
    console.error(err.statusCode, err.statusMessage, err.toString(), err.stack);
}
