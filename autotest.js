// HEAD Set schemas

let CompanyList = {
    "type": "object",
    "properties": {
        "data": {
            "type": "array",
            "items":
            {
                "type": "object",
                "properties": {
                    "company_id": {
                        "type": "integer"
                    },
                    "company_name": {
                        "type": "string"
                    },
                    "company_address": {
                        "type": "string"
                    },
                    "company_status": {
                        "type": "string",
                        "enum": ["ACTIVE", "CLOSED", "BANKRUPT"]
                    },
                    "description": {
                        "type": "string"
                    },
                    "description_lang": {
                        "type": "array",
                        "items":
                        {
                            "type": "object",
                            "properties": {
                                "translation_lang": {
                                    "type": "string"
                                },
                                "translation": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "translation_lang",
                                "translation"
                            ]
                        }

                    }
                },
                "required": [
                    "company_id",
                    "company_name",
                    "company_address",
                    "company_status"
                ]
            }

        },
        "meta": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer"
                },
                "offset": {
                    "type": "integer"
                },
                "total": {
                    "type": "integer"
                }
            },
            "required": [
                "total"
            ]
        }
    },
    "required": [
        "data",
        "meta"
    ]
};

let Company = {
    "type": "object",
    "properties": {
        "company_id": {
            "type": "integer"
        },
        "company_name": {
            "type": "string"
        },
        "company_address": {
            "type": "string"
        },
        "company_status": {
            "type": "string",
            "enum": [
                "ACTIVE",
                "BANKRUPT",
                "CLOSED"
            ]
        },
        "description": {
            "type": "string"
        },
        "description_lang": {
            "type": "array",
            "items":
            {
                "type": "object",
                "properties": {
                    "translation_lang": {
                        "type": "string",
                        "enum": [
                            "EN",
                            "RU",
                            "PL",
                            "UA"
                        ]
                    },
                    "translation": {
                        "type": "string"
                    }
                },
                "required": [
                    "translation_lang",
                    "translation"
                ]
            }

        }
    },
    "required": [
        "company_id",
        "company_name",
        "company_address",
        "company_status",
    ]
};

let UsersList = {
    "type": "object",
    "properties": {
        "meta": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer"
                },
                "offset": {
                    "type": "integer"
                },
                "total": {
                    "type": "integer"
                }
            },
            "required": [
                "total"
            ]
        },
        "data": {
            "type": "array",
            "items":
            {
                "type": "object",
                "properties": {
                    "first_name": {
                        "type": ["string", "null"]
                    },
                    "last_name": {
                        "type": "string"
                    },
                    "company_id": {
                        "type": ["integer", "null"]
                    },
                    "user_id": {
                        "type": "integer"
                    }
                },
                "required": [
                    "last_name",
                    "user_id"
                ]
            }

        }
    },
    "required": [
        "meta",
        "data"
    ]
};


let ResponseUser = {
    "type": "object",
    "properties": {
        "first_name": {
            "type": "string",
        },
        "last_name": {
            "type": "string",
        },
        "company_id": {
            "type": "integer",
        },
        "user_id": {
            "type": "integer",
        }
    },
    "required": [
        "last_name",
        "user_id"
    ]
};

let HTTPValidationError = {
    "type": "object",
    "properties": {
        "detail": {
            "type": "array",
            "items":
            {
                "type": "object",
                "properties": {
                    "loc": {
                        "type": "array",
                        "items": {
                            "type": [
                                "string",
                                "integer"
                            ]
                        }
                    },
                    "msg": {
                        "type": "string"
                    }
                },
                "required": [
                    "loc",
                    "msg",
                    "type"
                ]
            }

        }
    },
    "required": [
        "detail"
    ]
};

let NonExistent = {
    
  "type": "object",
  "properties": {
    "detail": {
      "type": "object",
      "properties": {
        "reason": {
          "type": "string"
        }
      },
      "required": [
        "reason"
      ]
    }
  },
  "required": [
    "detail"
  ]
}

let MeResponse =
{
    "type": "object",
    "properties": {
        "token": {
            "type": "string"
        },
        "user_name": {
            "type": "string"
        },
        "email_address": {
            "type": "string",
            "format": "email"
        },
        "valid_till": {
            "type": "string",
            "format": "date-time"
        }
    },
    "required": [
        "token",
        "user_name",
        "email_address",
        "valid_till"
    ]
}

pm.environment.set("CompanyList", JSON.stringify(CompanyList));
pm.environment.set("Company", JSON.stringify(Company));
pm.environment.set("UsersList", JSON.stringify(UsersList));
pm.environment.set("ResponseUser", JSON.stringify(ResponseUser));
pm.environment.set("HTTPValidationError", JSON.stringify(HTTPValidationError));
pm.environment.set("NonExistent", JSON.stringify(NonExistent));
pm.environment.set("MeResponse", JSON.stringify(MeResponse));

// GET {{baseUrl}}/api/companies

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});

let DataJson = pm.response.json().data;

pm.test("Length of JSON with default limit", function () {
    let countLenData = Object.keys(DataJson).length;
    pm.expect(countLenData).to.eql(3);
});

pm.test("Verify offset", function () {
    pm.expect(DataJson[0].company_id).to.eql(1);
});

let schema = JSON.parse(pm.environment.get("CompanyList"));

pm.test('Schema is valid', function () {
  pm.response.to.have.jsonSchema(schema);
});

pm.test("Request is made using HTTPS", function () {
    pm.expect(pm.request.url.protocol).to.eql("https");
});

// GET http://send-request.me/api/companies/ | получение данных по незащищенному протоколу "http" 


pm.test("Status code is 301", function () {
    pm.response.to.have.status(301);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers is vaild", function() {
pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
pm.expect(pm.response.headers.get('Location')).to.eql('https://send-request.me/api/companies/');
});

pm.test("Request by http", function() {
pm.expect(pm.request.url.protocol).to.eql("http")
});

// GET {{baseUrl}}/api/companies?status=ACTIVE

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers is valid", function() {
pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive')
});

pm.test("Verify status ACTIVE", function(){
    for(let company of pm.response.json().data){
    pm.expect(company.company_status).to.be.eql("ACTIVE");
    }
});

// GET {{baseUrl}}/api/companies?status=CLOSED

pm.test("Verify status CLOSED", function(){
    for(let company of pm.response.json().data){
    pm.expect(company.company_status).to.be.eql("CLOSED");
    }
});
// GET {{baseUrl}}/api/companies?status=BANKRUPT

pm.test("Verify status BANKRUPT", function(){
    for(let company of pm.response.json().data){
    pm.expect(company.company_status).to.be.eql("BANKRUPT");
    }
});

// GET {{baseUrl}}/api/companies?status=1 | invalid query params status = integer

pm.test("Status code is 422", function () {
    pm.response.to.have.status(422);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("Unprocessable Entity");
});

let schema = JSON.parse(pm.environment.get("HTTPValidationError"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// GET {{baseUrl}}/api/companies/1

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("OK");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Response when correct Accept-languege", function() {
    pm.expect(pm.response.json()).to.have.any.keys("description", "description_lang")
});

if(pm.response.json().description_lang){
    pm.test("description_lang === EN", function() {
        pm.expect(pm.response.json().description_lang[0].translation_lang).to.eql("EN")}
    )};

pm.test("Headers is valid", function() {
pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive')
pm.expect(pm.request.headers.get('Accept-Language')).to.eql('RU')
});

let schema = JSON.parse(pm.environment.get("Company"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// GET {{baseUrl}}/api/companies/abc | invalid id 

pm.test("Status code is 422", function () {
    pm.response.to.have.status(422);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("Unprocessable Entity");
});

let schema = JSON.parse(pm.environment.get("HTTPValidationError"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// GET {{baseUrl}}/api/companies/123 | несуществующий ID

pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("Not Found");
});

let schema = JSON.parse(pm.environment.get("NonExistent"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// POST {{baseUrl}}/api/users/

pm.collectionVariables.set("user_id", pm.response.json().user_id);
pm.collectionVariables.set("first_name", pm.response.json().first_name);
pm.collectionVariables.set("last_name", pm.response.json().last_name);
pm.collectionVariables.set("company_id", pm.response.json().company_id);

let schema = JSON.parse(pm.environment.get("ResponseUser"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("Created");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// GET {{baseUrl}}/api/users/?limit=10&offset=5

pm.test("Status code is 201", function () {
    pm.response.to.have.status(200);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("OK");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

let schema = JSON.parse(pm.environment.get("UsersList"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

pm.test("required keys", function() {
    pm.expect(pm.response.json()).to.have.any.keys("meta", "data")
});

let DataJson = pm.response.json().data;

pm.test("Length of JSON with default limit", function () {
    let countLenData = Object.keys(DataJson).length;
    pm.expect(countLenData).to.eql(10);
});

pm.test("Verify offset", function () {
    pm.expect(DataJson[0].user_id).to.eql(5);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});
// GET {{baseUrl}}/api/users/{{user_id}}

let first_name = pm.collectionVariables.get("first_name");
let last_name = pm.collectionVariables.get("last_name");
let company_id = pm.collectionVariables.get("company_id");
let user_id = pm.collectionVariables.get("user_id");

let schema = JSON.parse(pm.environment.get("ResponseUser"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});


// GET {{baseUrl}}/api/users/abc | invalid id

pm.test("Status code is 422", function () {
    pm.response.to.have.status(422);
});

pm.test("Status code name has string", () => {
  pm.response.to.have.status("Unprocessable Entity");
});

let schema = JSON.parse(pm.environment.get("HTTPValidationError"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// POST {{baseUrl}}/api/users/ | non-existent company

pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
    pm.response.to.have.status("Not Found");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

let schema = JSON.parse(pm.environment.get("NonExistent"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// PUT {{baseUrl}}/api/users/{{user_id}}

// Pre-request script:

pm.collectionVariables.set("first_name", "Victor");
pm.collectionVariables.set("last_name", "Semenov");
pm.collectionVariables.set("company_id", 3);

// Tests:

let first_name = pm.collectionVariables.get("first_name");
let last_name = pm.collectionVariables.get("last_name");
let company_id = pm.collectionVariables.get("company_id");
let user_id = pm.collectionVariables.get("user_id");

pm.test("Status code is 201", function () {
    pm.response.to.have.status(200);
    pm.response.to.have.status("OK");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});

let schema = JSON.parse(pm.environment.get("ResponseUser"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

let jsonData = pm.response.json();  

pm.test("Verify enums", function(){
    pm.expect(jsonData.first_name).to.be.eql(first_name);
    pm.expect(jsonData.last_name).to.be.eql(last_name);
    pm.expect(jsonData.company_id).to.be.eql(company_id);
    pm.expect(jsonData.user_id).to.be.eql(user_id);
    
})

// PUT {{baseUrl}}/api/users/1000000 | non-existent user

pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
    pm.response.to.have.status("Not Found");
});

let schema = JSON.parse(pm.environment.get("NonExistent"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// DELETE {{baseUrl}}/api/users/{{user_id}} 

pm.test("Status code is 202", function () {
    pm.response.to.have.status(202);
    pm.response.to.have.status("Accepted");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});

pm.test("Response body is object", function(){
    pm.expect(pm.response.json()).to.be.a("object");
});

// DELETE {{baseUrl}}/api/users/{{user_id}} | non-existent user

pm.test("Status code is 202", function () {
    pm.response.to.have.status(404);
    pm.response.to.have.status("Not Found");
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

let schema = JSON.parse(pm.environment.get("NonExistent"));

pm.test('Schema is valid', function() {
pm.response.to.have.jsonSchema(schema);
});

// GET {{baseUrl}}/api/issues/companies?status=ACTIVE

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers is valid", function() {
pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive')
});

pm.test("Verify status ACTIVE", function(){
    for(let company of pm.response.json().data){
    pm.expect(company.company_status).to.be.eql("ACTIVE");
    }
});

let DataJson = pm.response.json().data;

pm.test("Length of JSON with default limit", function () {
    let countLenData = Object.keys(DataJson).length;
    pm.expect(countLenData).to.eql(3);
});

pm.test("Verify offset", function () {
    pm.expect(DataJson[0].company_id).to.eql(1);
});

let schema = JSON.parse(pm.environment.get("CompanyList"));

pm.test('Response body matches schema', function () {
    pm.response.to.have.jsonSchema(schema);
});

// GET {{baseUrl}}/api/issues/companies/1

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Headers is valid", function() {
pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive')
});

let schema = JSON.parse(pm.environment.get("Company"));

pm.test('Response body matches schema', function () {
    pm.response.to.have.jsonSchema(schema);
});

pm.test("Response when correct Accept-languege", function() {
    pm.expect(pm.response.json()).to.have.any.keys("description", "description_lang")
});

if(pm.response.json().description_lang){
    pm.test("description_lang === EN", function() {
        pm.expect(pm.response.json().description_lang[0].translation_lang).to.eql("EN")}
    )};

// POST {{baseUrl}}/api/issues/users 

// Pre-request:

pm.collectionVariables.set("first_name", "Alexey");
pm.collectionVariables.set("last_name", "Samsonov");
pm.collectionVariables.set("company_id", 3);

// Tests:

let first_name = pm.collectionVariables.get("first_name");
let last_name = pm.collectionVariables.get("last_name");
let company_id = pm.collectionVariables.get("company_id")

 
pm.test("Response time below 500ms", function(){
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Status code is success", function(){
    pm.response.to.be.success;
});

pm.test("Status code is 201", function(){
    pm.response.to.have.status(201);
});

pm.test("Header is valid", function(){
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
});

let schema = JSON.parse(pm.environment.get("ResponseUser"));

pm.test("Schema is valid", function(){
    pm.response.to.have.jsonSchema(schema);
});

pm.collectionVariables.clear();

// POST {{baseUrl}}/api/auth/authorize

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});

pm.environment.set("token", pm.response.json().token)

pm.test("Token received", function(){
    pm.expect(pm.response.json().token).to.be.a("string");
});

// POST {{baseUrl}}/api/auth/authorize | invalid login

pm.test("Status code is 422", function () {
    pm.response.to.have.status(422);
    pm.response.to.have.status("Unprocessable Entity");
});

let schema = JSON.parse(pm.environment.get("HTTPValidationError"));

pm.test('Schema is valid', function() {
  pm.response.to.have.jsonSchema(schema);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});

// GET {{baseUrl}}/api/auth/me

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Headers are valid", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.eql('application/json');
    pm.expect(pm.response.headers.get('Connection')).to.eql('keep-alive');
});

let schema = JSON.parse(pm.environment.get("MeResponse"));

pm.test('Schema is valid', function () {
  pm.response.to.have.jsonSchema(schema);
});
