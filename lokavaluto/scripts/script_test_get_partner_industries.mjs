import https from 'https';

const URL_INDUSTRY = 'https://odoo12.dev.lokavaluto.fr/lokavaluto_api/public/partner_industry/get_all';

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
        `${URL_INDUSTRY}`,
        {},
    );
    console.log('partner info : ', res);

} catch (err) {
    console.error(err.statusCode, err.statusMessage, err.toString(), err.stack);
}

