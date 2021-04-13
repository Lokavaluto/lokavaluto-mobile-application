# Lokavaluto


## Doc Lokavaluto

https://laroue.v12.dev.myceliandre.fr/api-docs?urls.primaryName=lokavaluto_api%2Fprivate%3A%20partner#/default

## First User Stories

### Offline (no account)

* map view 

### Online

* login with login/password
  * retrieve token

```
curl --request POST \
  --url https://laroue.v12.dev.myceliandre.fr/lokavaluto_api/public/auth/authenticate \
  --header 'Authorization: Basic XXXXXXXXXXXXXXXXX' \
  --header 'Content-Type: application/json' \
  --data '{
  "db": "laroue.v12.dev.myceliandre.fr",
  "params": [
    "lcc_app"
  ]
}'
```

**Response:**

```
{
  "response": {
    "status": "OK",
    "partner_id": 34699,
    "uid": 117,
    "api_token": "token qui va bien"
  }
}
```

* get user accounts  and balances 

### Get user account

```
curl --request GET \
  --url https://laroue.v12.dev.myceliandre.fr/lokavaluto_api/private/partner/34699 \
  --header 'API-KEY: token qui va bien' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

**Response:**

```
{
  "id": 34699,
  "name": "Prénom NOM",
  "street": null,
  "street2": null,
  "zip": null,
  "city": null,
  "mobile": null,
  "email": "test@test.com",
  "phone": null
}
```
### Get balance

TODO

* For the next  user stories you can decide :
  * list favorites 
  * see account "profile"
  * ...


## Nativescript

Nativescript doc for project setup: https://docs.nativescript.org/environment-setup.html

## Usage

``` bash
# Install dependencies
npm install

# Build for production
tns build <platform> --bundle

# Build, watch for changes and debug the application
tns debug <platform> --bundle

# Build, watch for changes and run the application
tns run <platform> --bundle
```
