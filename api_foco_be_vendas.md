API FOCO RAC VENDAS
O token precisa ser passado no header da requisição com key = "Authorization" e value = "Bearer VALORDOTOKEN".
BaseURL: https://api.foco.zoss.ai/
Login:
Endpoint utilizado para fazer login no portal de vendas:
Endpoint: /portal/login (POST)
Request Body (exemplo):
```json 
{
  "loginName": "string",
  "password": "string"
}
```
Response Body sucesso (exemplo):
```json
{
  "id": 1,
  "loginName": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "token": "string",
  "hoursUntilTokenExpired": 12,
  "errors": null
}
```
Response Body caso campo vazio (exemplo):
```json
{
  "id": 0,
  "loginName": null,
  "name": null,
  "surname": null,
  "email": null,
  "token": null,
  "hoursUntilTokenExpired": 0,
  "errors": [
    {
      "code": "400",
      "message": "A senha deve ser informada.",
      "status": "",
      "type": "",
      "field": "password"
    }
  ]
}
```
Verificar primeiro acesso do usuário:
Verifica se é primeiro acesso do usuário.
Endpoint: /portal/login/isFirstAccess/{loginName} (GET)
Response Body sucesso (exemplo):
```json
{
  "isFirstAccess": false,
  "errors": null
}
```
Criar usuário:
(apenas usuários nível "administrator")
Cria usuário para o portal de vendas.

Endpoint: /portal/user (POST)
Request Body (exemplo):
```json
{
  "loginName": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "active": true,
  "role": "string"
}
```
Response Body sucesso (exemplo):
```json
{
  "userId": 4,
  "errors": null
}
```
Recuperar dados do usuário:
(apenas usuários nível "administrator")
Recupera dados do usuário do portal de vendas.
Endpoint: /portal/user/{userId} (GET)
Response Body sucesso (exemplo):
```json
{
  "user": {
    "id": 1,
    "name": "string",
    "surname": "string",
    "loginName": "string",
    "email": "string",
    "active": false,
    "userIdentifier": "string",
    "role": "string"
  },
  "errors": null
}
```
Editar dados do usuário:
(apenas usuários nível "administrator")
Edita informações de um usuário do portal de vendas.
Endpoint: /portal/user/{userId} (PUT)
Request Body (exemplo):
``` json
{
  "name": "STRING",
  "surname": "STRING",
  "email": "STRING",
  "active": true,
  "role": "STRING"
}
```
Response Body sucesso (exemplo):
``` json
{
  "user": {
    "id": 1,
    "name": "STRING",
    "surname": "STRING",
    "loginName": "STRING",
    "email": "STRING",
    "active": true,
    "userIdentifier": "STRING",
    "role": "STRING"
  },
  "errors": null
}
```
Recuperar roles:
(apenas usuários nível "administrator")
Recupera "roles" disponíveis no sistema:
Endpoint: /portal/user/roles (GET)
Response Body sucesso (exemplo):
``` json
{
  "roles": [
    "administrator",
    "operator"
  ]
}
```
Salvar primeira senha do usuário:
Salva a senha do usuário do portal de vendas se for o primeiro acesso dele.
Endpoint: /portal/user/registerFirstPassword (POST)
Request Body (exemplo):
``` json
{
  "loginName": "string",
  "password": "string"
}
```
Response Body sucesso (exemplo):
``` json
{
  "success": true,
  "errors": null
}
```
Resetar senha do usuário:
(apenas usuários nível "administrator")
Reseta a senha de um usuário do portal de vendas.
Endpoint: /portal/user/resetPassword/{UserId} (GET)
Response Body sucesso (exemplo):
```json
{
  "success": true,
  "errors": null
}
```
Recuperar lista de usuário:
(apenas usuários nível "administrator")
Recupera lista de usuários do portal de vendas.
Observações:
não passar nenhum dos query params, gera uma busca na página 1, sem criterio de busca, ordenado em ordem decrescente por Id.
Endpoint: /portal/userlist?search={string}&sortBy={string}&sortOrder=desc&page=1&pageSize=10 (GET)
Response Body sucesso (exemplo):
```json
{
  "search": "string",
  "sortBy": "string",
  "sortOrder": "desc",
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1
  },
  "users": [
    {
      "id": 1,
      "name": "string",
      "surname": "string",
      "loginName": "string",
      "email": "string",
      "active": true,
      "userIdentifier": "string",
      "role": "string"
    }
  ],
  "errors": null
}
```
Buscar lojas:
(Apenas usuários autenticados)
Buscar lojas da locadora através de um termo. Sempre utilizar "search"
Endpoint: /searchStores (POST)
Request Body (exemplo):
```json
{
  "search": "rio de janeiro",
  "neighborhood": "",
  "city": "",
  "airport": "",
  "isApp": false
}
```
Response Body sucesso (exemplo):
```json
{
    "stores": [
        {
            "acronym": "SDU",
            "name": "Aeroporto Santos Dumont",
            "street": "Avenida Infante Dom Henrique",
            "number": "0",
            "neighborhood": "Gloria",
            "city": "Rio de Janeiro",
            "region": "Rio de Janeiro",
            "zipCode": "20021140",
            "mapsLocation": "https://maps.app.goo.gl/PJ67mCjZprEtn2Vi9",
            "distanceToMainStore": 2,
            "app": false,
            "airport": {
                "name": "RIO DE JANEIROSANTOS DUMONT AEROMARINA GLORIA",
                "iata": "SDU"
            },
            "storeOperationTimes": [
                {
                    "dayOfTheWeek": "Quarta-feira",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                },
                {
                    "dayOfTheWeek": "Sábado",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                },
                {
                    "dayOfTheWeek": "Sexta-feira",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                },
                {
                    "dayOfTheWeek": "Quinta-feira",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                },
                {
                    "dayOfTheWeek": "Domingo",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                },
                {
                    "dayOfTheWeek": "Terça-feira",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                },
                {
                    "dayOfTheWeek": "Segunda-feira",
                    "openingTime": "06:00:00",
                    "closingTime": "23:00:00"
                }
            ]
        },
        {
            "acronym": "MOVCOPA",
            "name": "Rio de Janeiro - Rio Sul",
            "street": "Avenida Carlos Peixoto",
            "number": "11",
            "neighborhood": "Botafogo",
            "city": "Rio de Janeiro",
            "region": "Rio de Janeiro",
            "zipCode": "22290090",
            "mapsLocation": "https://maps.app.goo.gl/K86sFdJTB9SsxZYQ9",
            "distanceToMainStore": 7,
            "app": false,
            "airport": null,
            "storeOperationTimes": [
                {
                    "dayOfTheWeek": "Sexta-feira",
                    "openingTime": "08:00:00",
                    "closingTime": "20:00:00"
                },
                {
                    "dayOfTheWeek": "Sábado",
                    "openingTime": "08:00:00",
                    "closingTime": "20:00:00"
                },
                {
                    "dayOfTheWeek": "Segunda-feira",
                    "openingTime": "08:00:00",
                    "closingTime": "20:00:00"
                },
                {
                    "dayOfTheWeek": "Terça-feira",
                    "openingTime": "08:00:00",
                    "closingTime": "20:00:00"
                },
                {
                    "dayOfTheWeek": "Quarta-feira",
                    "openingTime": "08:00:00",
                    "closingTime": "20:00:00"
                },
                {
                    "dayOfTheWeek": "Domingo",
                    "openingTime": "12:00:00",
                    "closingTime": "20:00:00"
                },
                {
                    "dayOfTheWeek": "Quinta-feira",
                    "openingTime": "08:00:00",
                    "closingTime": "20:00:00"
                }
            ]
        },
        {
            "acronym": "MOVNTR",
            "name": "Niterói",
            "street": "Alameda Sao Boaventura",
            "number": "298",
            "neighborhood": "Fonseca",
            "city": "Niterói",
            "region": "Rio de Janeiro",
            "zipCode": "24120196",
            "mapsLocation": "https://maps.app.goo.gl/3o3LhaPfqaSYzRou9",
            "distanceToMainStore": 7,
            "app": false,
            "airport": null,
            "storeOperationTimes": [
                {
                    "dayOfTheWeek": "Quinta-feira",
                    "openingTime": "07:00:00",
                    "closingTime": "18:00:00"
                },
                {
                    "dayOfTheWeek": "Quarta-feira",
                    "openingTime": "07:00:00",
                    "closingTime": "18:00:00"
                },
                {
                    "dayOfTheWeek": "Terça-feira",
                    "openingTime": "07:00:00",
                    "closingTime": "18:00:00"
                },
                {
                    "dayOfTheWeek": "Segunda-feira",
                    "openingTime": "07:00:00",
                    "closingTime": "18:00:00"
                },
                {
                    "dayOfTheWeek": "Sábado",
                    "openingTime": "07:00:00",
                    "closingTime": "18:00:00"
                },
                {
                    "dayOfTheWeek": "Sexta-feira",
                    "openingTime": "07:00:00",
                    "closingTime": "18:00:00"
                }
            ]
        }
    ],
    "airports": [
        {
            "name": "RIO DE JANEIROSANTOS DUMONT AEROMARINA GLORIA",
            "storeCount": 1,
            "stores": [
                "SDU"
            ]
        }
    ],
    "cities": [
        {
            "name": "Rio de Janeiro",
            "storeCount": 2,
            "stores": [
                "SDU",
                "MOVCOPA"
            ]
        },
        {
            "name": "Niterói",
            "storeCount": 1,
            "stores": [
                "MOVNTR"
            ]
        }
    ],
    "neighborhoods": [
        {
            "name": "Gloria",
            "storeCount": 1,
            "stores": [
                "SDU"
            ]
        },
        {
            "name": "Botafogo",
            "storeCount": 1,
            "stores": [
                "MOVCOPA"
            ]
        },
        {
            "name": "Fonseca",
            "storeCount": 1,
            "stores": [
                "MOVNTR"
            ]
        }
    ],
    "errors": null
}
```

Disponibilidade:
(Apenas usuários autenticados)
Realiza busca de disponibilidade de Carros.
Endpoint: /availability (POST)
Request Body (exemplo):
```json
{
    "pickupDateTime": "2026-04-04T10:00:00",
    "returnDateTime": "2026-04-07T10:00:00",
    "pickupStore": "GIG10",
    "returnStore": "GIG10",
    "couponCode": "",
    "chosenGroups": []
}
```
Response Body sucesso (exemplo):
```json
{
    "availableVehicles": [
        {
            "vehicleData": {
                "model": "VW Up ou similar",
                "category": "",
                "vehicleGroup": "Grupo A",
                "vehicleGroupAcronym": "A",
                "rateQualifier": "1774629610256_A",
                "agencyName": "FOCO",
                "agencyCode": 0,
                "vehicleCode": "EBMN",
                "agencyGroup": "",
                "numberOfDoors": 2,
                "numberOfSeats": 5,
                "luggageCapacity": 1,
                "hasAirConditioning": false,
                "isAutomaticTransmission": false,
                "imageUrl": "https://cms.aluguefoco.com.br/uploads/A_ee2c8525b3.png",
                "totalValue": 391.12,
                "dailyValue": 118.52,
                "administrativeFeePercentage": 10.00,
                "bookingValue": 355.56,
                "numberOfDays": 3,
                "returnFeeValue": 0,
                "totalOvertimeValue": 0,
                "overtimeValue": 0,
                "overtimeCoverageValue": 0,
                "overtimeCoverageFeePercentage": 0,
                "numberOfOvertimeHours": 0,
                "returnFeePrice": 0,
                "returnFeeQuantity": 0,
                "totalDepositValue": 0,
                "offer": "",
                "availabilityToken": "",
                "totalDeductibleValue": 500.00,
                "isUnlimitedKm": true,
                "dailyKmLimit": 0,
                "isMonthly": false,
                "totalMonthlyDailyRateValue": 0
            },
            "optionalAddonsData": [
                {
                    "name": "Bebe Conforto",
                    "description": "Bebe Conforto",
                    "addonCode": "BCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Cadeira de Bebe",
                    "description": "Cadeira de Bebe",
                    "addonCode": "CCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "isentor cop vidros e pneus",
                    "description": "isentor cop vidros e pneus",
                    "addonCode": "CPG1N",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor Cop e Vidros e Pneus",
                    "description": "Isentor Cop e Vidros e Pneus",
                    "addonCode": "CPKG1",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Cop e Prot Terceiro",
                    "description": "Isentor de Cop e Prot Terceiro",
                    "addonCode": "CPKG2",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Adicional",
                    "description": "Condutor Adicional",
                    "addonCode": "DRV",
                    "totalValue": 21.90,
                    "dailyValue": 21.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Resposvel financeiro app",
                    "description": "Resposvel financeiro app",
                    "addonCode": "FINAP",
                    "totalValue": 2.16,
                    "dailyValue": 2.16,
                    "fee": {
                        "percentage": 10.185185185185185185185185190,
                        "totalValue": 0.22
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Responsavel Financeiro",
                    "description": "Responsavel Financeiro",
                    "addonCode": "FINR",
                    "totalValue": 11.90,
                    "dailyValue": 11.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.19
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Aparelho de GPS",
                    "description": "Aparelho de GPS",
                    "addonCode": "GPS",
                    "totalValue": 17.00,
                    "dailyValue": 17.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.70
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Assento de Elevação",
                    "description": "Assento de Elevação",
                    "addonCode": "IBS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Junior",
                    "description": "Condutor Junior",
                    "addonCode": "JRD",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "JRDJR",
                    "description": "JRDJR",
                    "addonCode": "JRDMF",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWM",
                    "description": "LDWM",
                    "addonCode": "LDWM",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWUBER",
                    "description": "LDWUBER",
                    "addonCode": "LDWUB",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Multicondutores Adicionais",
                    "description": "Multicondutores Adicionais",
                    "addonCode": "MULTC",
                    "totalValue": 14.90,
                    "dailyValue": 14.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Lavagem Antecipada",
                    "description": "Lavagem Antecipada",
                    "addonCode": "PWSH2",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "RAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 0.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDLDW",
                    "totalValue": 40.90,
                    "dailyValue": 40.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.09
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDUDW",
                    "totalValue": 40.90,
                    "dailyValue": 40.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFLDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFUDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SLDWQ",
                    "totalValue": 52.90,
                    "dailyValue": 52.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Tag Pedagio",
                    "description": "Tag Pedagio",
                    "addonCode": "TOLL",
                    "totalValue": 20.00,
                    "dailyValue": 20.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.00
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "URAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                }
            ],
            "coveragesData": [
                {
                    "coverageCode": "DFCVG",
                    "name": "Proteçao Especial",
                    "description": "Proteçao Especial",
                    "totalValue": 0,
                    "dailyValue": 65.74,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNT",
                    "name": "Proteção de Vidros e Pneus",
                    "description": "Proteção de Vidros e Pneus",
                    "totalValue": 0,
                    "dailyValue": 16.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTM",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTMU",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW",
                    "name": "Proteçao Basica",
                    "description": "Proteçao Basica",
                    "totalValue": 0,
                    "dailyValue": 0,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW99",
                    "name": "PROTEÇAO 99POP",
                    "description": "PROTEÇAO 99POP",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWB2",
                    "name": "Proteçao Basica B2B",
                    "description": "Proteçao Basica B2B",
                    "totalValue": 0,
                    "dailyValue": 39.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWQ",
                    "name": "PROTECAO APP QUINZENAL",
                    "description": "PROTECAO APP QUINZENAL",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "PRTMF",
                    "name": "Proteção Mensal Flex",
                    "description": "Proteção Mensal Flex",
                    "totalValue": 0,
                    "dailyValue": 13.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "RLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 40.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "UDFCG",
                    "name": "Protecao especial",
                    "description": "Protecao especial",
                    "totalValue": 0,
                    "dailyValue": 59.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "URLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 40.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "WFCVG",
                    "name": "Proteçao Super",
                    "description": "Proteçao Super",
                    "totalValue": 0,
                    "dailyValue": 91.25,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                }
            ],
            "coupon": {
                "coupon": null,
                "valid": false
            },
            "rentalSearch": {
                "pickupStoreName": null,
                "returnStoreName": null,
                "pickupStoreCode": "GIG10",
                "returnStoreCode": "GIG10",
                "pickupDateTime": "2026-04-04T10:00:00",
                "returnDateTime": "2026-04-07T10:00:00",
                "distanceToMainStore": null
            }
        },
        {
            "vehicleData": {
                "model": "Fiat Mobi, Renault Kwid ou similar",
                "category": "",
                "vehicleGroup": "Grupo B",
                "vehicleGroupAcronym": "B",
                "rateQualifier": "1774629610256_B",
                "agencyName": "FOCO",
                "agencyCode": 0,
                "vehicleCode": "ECMR",
                "agencyGroup": "",
                "numberOfDoors": 4,
                "numberOfSeats": 5,
                "luggageCapacity": 1,
                "hasAirConditioning": false,
                "isAutomaticTransmission": false,
                "imageUrl": "https://cms.aluguefoco.com.br/uploads/B_2f2707969f.png",
                "totalValue": 391.41,
                "dailyValue": 118.61,
                "administrativeFeePercentage": 10.00,
                "bookingValue": 355.83,
                "numberOfDays": 3,
                "returnFeeValue": 0,
                "totalOvertimeValue": 0,
                "overtimeValue": 0,
                "overtimeCoverageValue": 0,
                "overtimeCoverageFeePercentage": 0,
                "numberOfOvertimeHours": 0,
                "returnFeePrice": 0,
                "returnFeeQuantity": 0,
                "totalDepositValue": 0,
                "offer": "",
                "availabilityToken": "",
                "totalDeductibleValue": 500.00,
                "isUnlimitedKm": true,
                "dailyKmLimit": 0,
                "isMonthly": false,
                "totalMonthlyDailyRateValue": 0
            },
            "optionalAddonsData": [
                {
                    "name": "Bebe Conforto",
                    "description": "Bebe Conforto",
                    "addonCode": "BCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Cadeira de Bebe",
                    "description": "Cadeira de Bebe",
                    "addonCode": "CCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "isentor cop vidros e pneus",
                    "description": "isentor cop vidros e pneus",
                    "addonCode": "CPG1N",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor Cop e Vidros e Pneus",
                    "description": "Isentor Cop e Vidros e Pneus",
                    "addonCode": "CPKG1",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Cop e Prot Terceiro",
                    "description": "Isentor de Cop e Prot Terceiro",
                    "addonCode": "CPKG2",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Adicional",
                    "description": "Condutor Adicional",
                    "addonCode": "DRV",
                    "totalValue": 21.90,
                    "dailyValue": 21.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Resposvel financeiro app",
                    "description": "Resposvel financeiro app",
                    "addonCode": "FINAP",
                    "totalValue": 2.16,
                    "dailyValue": 2.16,
                    "fee": {
                        "percentage": 10.185185185185185185185185190,
                        "totalValue": 0.22
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Responsavel Financeiro",
                    "description": "Responsavel Financeiro",
                    "addonCode": "FINR",
                    "totalValue": 11.90,
                    "dailyValue": 11.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.19
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Aparelho de GPS",
                    "description": "Aparelho de GPS",
                    "addonCode": "GPS",
                    "totalValue": 17.00,
                    "dailyValue": 17.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.70
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Assento de Elevação",
                    "description": "Assento de Elevação",
                    "addonCode": "IBS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Junior",
                    "description": "Condutor Junior",
                    "addonCode": "JRD",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "JRDJR",
                    "description": "JRDJR",
                    "addonCode": "JRDMF",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWM",
                    "description": "LDWM",
                    "addonCode": "LDWM",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWUBER",
                    "description": "LDWUBER",
                    "addonCode": "LDWUB",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Multicondutores Adicionais",
                    "description": "Multicondutores Adicionais",
                    "addonCode": "MULTC",
                    "totalValue": 14.90,
                    "dailyValue": 14.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Lavagem Antecipada",
                    "description": "Lavagem Antecipada",
                    "addonCode": "PWSH2",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "RAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 0.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDLDW",
                    "totalValue": 40.90,
                    "dailyValue": 40.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.09
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDUDW",
                    "totalValue": 40.90,
                    "dailyValue": 40.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFLDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFUDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SLDWQ",
                    "totalValue": 52.90,
                    "dailyValue": 52.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Tag Pedagio",
                    "description": "Tag Pedagio",
                    "addonCode": "TOLL",
                    "totalValue": 20.00,
                    "dailyValue": 20.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.00
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "URAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                }
            ],
            "coveragesData": [
                {
                    "coverageCode": "DFCVG",
                    "name": "Proteçao Especial",
                    "description": "Proteçao Especial",
                    "totalValue": 0,
                    "dailyValue": 65.74,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNT",
                    "name": "Proteção de Vidros e Pneus",
                    "description": "Proteção de Vidros e Pneus",
                    "totalValue": 0,
                    "dailyValue": 16.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTM",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTMU",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW",
                    "name": "Proteçao Basica",
                    "description": "Proteçao Basica",
                    "totalValue": 0,
                    "dailyValue": 0,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW99",
                    "name": "PROTEÇAO 99POP",
                    "description": "PROTEÇAO 99POP",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWB2",
                    "name": "Proteçao Basica B2B",
                    "description": "Proteçao Basica B2B",
                    "totalValue": 0,
                    "dailyValue": 39.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWQ",
                    "name": "PROTECAO APP QUINZENAL",
                    "description": "PROTECAO APP QUINZENAL",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "PRTMF",
                    "name": "Proteção Mensal Flex",
                    "description": "Proteção Mensal Flex",
                    "totalValue": 0,
                    "dailyValue": 13.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "RLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 40.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "UDFCG",
                    "name": "Protecao especial",
                    "description": "Protecao especial",
                    "totalValue": 0,
                    "dailyValue": 59.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "URLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 40.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "WFCVG",
                    "name": "Proteçao Super",
                    "description": "Proteçao Super",
                    "totalValue": 0,
                    "dailyValue": 91.25,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                }
            ],
            "coupon": {
                "coupon": null,
                "valid": false
            },
            "rentalSearch": {
                "pickupStoreName": null,
                "returnStoreName": null,
                "pickupStoreCode": "GIG10",
                "returnStoreCode": "GIG10",
                "pickupDateTime": "2026-04-04T10:00:00",
                "returnDateTime": "2026-04-07T10:00:00",
                "distanceToMainStore": null
            }
        },
        {
            "vehicleData": {
                "model": "VW Polo, Fiat Argo ou similar",
                "category": "",
                "vehicleGroup": "Grupo D+",
                "vehicleGroupAcronym": "D+",
                "rateQualifier": "1774629610256_D+",
                "agencyName": "FOCO",
                "agencyCode": 0,
                "vehicleCode": "CDMR",
                "agencyGroup": "",
                "numberOfDoors": 4,
                "numberOfSeats": 5,
                "luggageCapacity": 2,
                "hasAirConditioning": false,
                "isAutomaticTransmission": false,
                "imageUrl": "https://cms.aluguefoco.com.br/uploads/D_8985500736.png",
                "totalValue": 439.66,
                "dailyValue": 133.23,
                "administrativeFeePercentage": 10.00,
                "bookingValue": 399.69,
                "numberOfDays": 3,
                "returnFeeValue": 0,
                "totalOvertimeValue": 0,
                "overtimeValue": 0,
                "overtimeCoverageValue": 0,
                "overtimeCoverageFeePercentage": 0,
                "numberOfOvertimeHours": 0,
                "returnFeePrice": 0,
                "returnFeeQuantity": 0,
                "totalDepositValue": 0,
                "offer": "",
                "availabilityToken": "",
                "totalDeductibleValue": 500.00,
                "isUnlimitedKm": true,
                "dailyKmLimit": 0,
                "isMonthly": false,
                "totalMonthlyDailyRateValue": 0
            },
            "optionalAddonsData": [
                {
                    "name": "Bebe Conforto",
                    "description": "Bebe Conforto",
                    "addonCode": "BCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Cadeira de Bebe",
                    "description": "Cadeira de Bebe",
                    "addonCode": "CCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "isentor cop vidros e pneus",
                    "description": "isentor cop vidros e pneus",
                    "addonCode": "CPG1N",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor Cop e Vidros e Pneus",
                    "description": "Isentor Cop e Vidros e Pneus",
                    "addonCode": "CPKG1",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Cop e Prot Terceiro",
                    "description": "Isentor de Cop e Prot Terceiro",
                    "addonCode": "CPKG2",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Adicional",
                    "description": "Condutor Adicional",
                    "addonCode": "DRV",
                    "totalValue": 21.90,
                    "dailyValue": 21.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Resposvel financeiro app",
                    "description": "Resposvel financeiro app",
                    "addonCode": "FINAP",
                    "totalValue": 2.16,
                    "dailyValue": 2.16,
                    "fee": {
                        "percentage": 10.185185185185185185185185190,
                        "totalValue": 0.22
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Responsavel Financeiro",
                    "description": "Responsavel Financeiro",
                    "addonCode": "FINR",
                    "totalValue": 11.90,
                    "dailyValue": 11.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.19
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Aparelho de GPS",
                    "description": "Aparelho de GPS",
                    "addonCode": "GPS",
                    "totalValue": 17.00,
                    "dailyValue": 17.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.70
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Assento de Elevação",
                    "description": "Assento de Elevação",
                    "addonCode": "IBS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Junior",
                    "description": "Condutor Junior",
                    "addonCode": "JRD",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "JRDJR",
                    "description": "JRDJR",
                    "addonCode": "JRDMF",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWM",
                    "description": "LDWM",
                    "addonCode": "LDWM",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWUBER",
                    "description": "LDWUBER",
                    "addonCode": "LDWUB",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Multicondutores Adicionais",
                    "description": "Multicondutores Adicionais",
                    "addonCode": "MULTC",
                    "totalValue": 14.90,
                    "dailyValue": 14.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Lavagem Antecipada",
                    "description": "Lavagem Antecipada",
                    "addonCode": "PWSH2",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "RAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 0.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDLDW",
                    "totalValue": 40.90,
                    "dailyValue": 40.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.09
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDUDW",
                    "totalValue": 40.90,
                    "dailyValue": 40.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFLDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFUDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SLDWQ",
                    "totalValue": 52.90,
                    "dailyValue": 52.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Tag Pedagio",
                    "description": "Tag Pedagio",
                    "addonCode": "TOLL",
                    "totalValue": 20.00,
                    "dailyValue": 20.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.00
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "URAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                }
            ],
            "coveragesData": [
                {
                    "coverageCode": "DFCVG",
                    "name": "Proteçao Especial",
                    "description": "Proteçao Especial",
                    "totalValue": 0,
                    "dailyValue": 69.50,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNT",
                    "name": "Proteção de Vidros e Pneus",
                    "description": "Proteção de Vidros e Pneus",
                    "totalValue": 0,
                    "dailyValue": 16.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTM",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTMU",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW",
                    "name": "Proteçao Basica",
                    "description": "Proteçao Basica",
                    "totalValue": 0,
                    "dailyValue": 0,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW99",
                    "name": "PROTEÇAO 99POP",
                    "description": "PROTEÇAO 99POP",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWB2",
                    "name": "Proteçao Basica B2B",
                    "description": "Proteçao Basica B2B",
                    "totalValue": 0,
                    "dailyValue": 39.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWQ",
                    "name": "PROTECAO APP QUINZENAL",
                    "description": "PROTECAO APP QUINZENAL",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "PRTMF",
                    "name": "Proteção Mensal Flex",
                    "description": "Proteção Mensal Flex",
                    "totalValue": 0,
                    "dailyValue": 13.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "RLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 40.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "UDFCG",
                    "name": "Protecao especial",
                    "description": "Protecao especial",
                    "totalValue": 0,
                    "dailyValue": 64.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "URLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 40.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "WFCVG",
                    "name": "Proteçao Super",
                    "description": "Proteçao Super",
                    "totalValue": 0,
                    "dailyValue": 95.21,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                }
            ],
            "coupon": {
                "coupon": null,
                "valid": false
            },
            "rentalSearch": {
                "pickupStoreName": null,
                "returnStoreName": null,
                "pickupStoreCode": "GIG10",
                "returnStoreCode": "GIG10",
                "pickupDateTime": "2026-04-04T10:00:00",
                "returnDateTime": "2026-04-07T10:00:00",
                "distanceToMainStore": null
            }
        },
        {
            "vehicleData": {
                "model": "Hyundai HB20S, Fiat Cronos ou similar",
                "category": "",
                "vehicleGroup": "Grupo F",
                "vehicleGroupAcronym": "F",
                "rateQualifier": "1774629610256_F",
                "agencyName": "FOCO",
                "agencyCode": 0,
                "vehicleCode": "IDMR",
                "agencyGroup": "",
                "numberOfDoors": 4,
                "numberOfSeats": 5,
                "luggageCapacity": 2,
                "hasAirConditioning": false,
                "isAutomaticTransmission": false,
                "imageUrl": "https://cms.aluguefoco.com.br/uploads/F_5a933bc136.png",
                "totalValue": 477.21,
                "dailyValue": 144.61,
                "administrativeFeePercentage": 10.00,
                "bookingValue": 433.83,
                "numberOfDays": 3,
                "returnFeeValue": 0,
                "totalOvertimeValue": 0,
                "overtimeValue": 0,
                "overtimeCoverageValue": 0,
                "overtimeCoverageFeePercentage": 0,
                "numberOfOvertimeHours": 0,
                "returnFeePrice": 0,
                "returnFeeQuantity": 0,
                "totalDepositValue": 0,
                "offer": "",
                "availabilityToken": "",
                "totalDeductibleValue": 500.00,
                "isUnlimitedKm": true,
                "dailyKmLimit": 0,
                "isMonthly": false,
                "totalMonthlyDailyRateValue": 0
            },
            "optionalAddonsData": [
                {
                    "name": "Bebe Conforto",
                    "description": "Bebe Conforto",
                    "addonCode": "BCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Cadeira de Bebe",
                    "description": "Cadeira de Bebe",
                    "addonCode": "CCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "isentor cop vidros e pneus",
                    "description": "isentor cop vidros e pneus",
                    "addonCode": "CPG1N",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor Cop e Vidros e Pneus",
                    "description": "Isentor Cop e Vidros e Pneus",
                    "addonCode": "CPKG1",
                    "totalValue": 50.90,
                    "dailyValue": 50.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.09
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Cop e Prot Terceiro",
                    "description": "Isentor de Cop e Prot Terceiro",
                    "addonCode": "CPKG2",
                    "totalValue": 50.90,
                    "dailyValue": 50.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.09
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Adicional",
                    "description": "Condutor Adicional",
                    "addonCode": "DRV",
                    "totalValue": 21.90,
                    "dailyValue": 21.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Resposvel financeiro app",
                    "description": "Resposvel financeiro app",
                    "addonCode": "FINAP",
                    "totalValue": 2.16,
                    "dailyValue": 2.16,
                    "fee": {
                        "percentage": 10.185185185185185185185185190,
                        "totalValue": 0.22
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Responsavel Financeiro",
                    "description": "Responsavel Financeiro",
                    "addonCode": "FINR",
                    "totalValue": 11.90,
                    "dailyValue": 11.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.19
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Aparelho de GPS",
                    "description": "Aparelho de GPS",
                    "addonCode": "GPS",
                    "totalValue": 17.00,
                    "dailyValue": 17.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.70
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Assento de Elevação",
                    "description": "Assento de Elevação",
                    "addonCode": "IBS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Junior",
                    "description": "Condutor Junior",
                    "addonCode": "JRD",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "JRDJR",
                    "description": "JRDJR",
                    "addonCode": "JRDMF",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWM",
                    "description": "LDWM",
                    "addonCode": "LDWM",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWUBER",
                    "description": "LDWUBER",
                    "addonCode": "LDWUB",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Multicondutores Adicionais",
                    "description": "Multicondutores Adicionais",
                    "addonCode": "MULTC",
                    "totalValue": 14.90,
                    "dailyValue": 14.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Lavagem Antecipada",
                    "description": "Lavagem Antecipada",
                    "addonCode": "PWSH2",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "RAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 0.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDLDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.59
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDUDW",
                    "totalValue": 45.90,
                    "dailyValue": 45.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFLDW",
                    "totalValue": 50.90,
                    "dailyValue": 50.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.09
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFUDW",
                    "totalValue": 50.90,
                    "dailyValue": 50.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SLDWQ",
                    "totalValue": 52.90,
                    "dailyValue": 52.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Tag Pedagio",
                    "description": "Tag Pedagio",
                    "addonCode": "TOLL",
                    "totalValue": 20.00,
                    "dailyValue": 20.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.00
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "URAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                }
            ],
            "coveragesData": [
                {
                    "coverageCode": "DFCVG",
                    "name": "Proteçao Especial",
                    "description": "Proteçao Especial",
                    "totalValue": 0,
                    "dailyValue": 79.85,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNT",
                    "name": "Proteção de Vidros e Pneus",
                    "description": "Proteção de Vidros e Pneus",
                    "totalValue": 0,
                    "dailyValue": 16.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTM",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTMU",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW",
                    "name": "Proteçao Basica",
                    "description": "Proteçao Basica",
                    "totalValue": 0,
                    "dailyValue": 0,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW99",
                    "name": "PROTEÇAO 99POP",
                    "description": "PROTEÇAO 99POP",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWB2",
                    "name": "Proteçao Basica B2B",
                    "description": "Proteçao Basica B2B",
                    "totalValue": 0,
                    "dailyValue": 39.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWQ",
                    "name": "PROTECAO APP QUINZENAL",
                    "description": "PROTECAO APP QUINZENAL",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "PRTMF",
                    "name": "Proteção Mensal Flex",
                    "description": "Proteção Mensal Flex",
                    "totalValue": 0,
                    "dailyValue": 13.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "RLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 45.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "UDFCG",
                    "name": "Protecao especial",
                    "description": "Protecao especial",
                    "totalValue": 0,
                    "dailyValue": 74.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "URLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 45.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "WFCVG",
                    "name": "Proteçao Super",
                    "description": "Proteçao Super",
                    "totalValue": 0,
                    "dailyValue": 105.11,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                }
            ],
            "coupon": {
                "coupon": null,
                "valid": false
            },
            "rentalSearch": {
                "pickupStoreName": null,
                "returnStoreName": null,
                "pickupStoreCode": "GIG10",
                "returnStoreCode": "GIG10",
                "pickupDateTime": "2026-04-04T10:00:00",
                "returnDateTime": "2026-04-07T10:00:00",
                "distanceToMainStore": null
            }
        },
        {
            "vehicleData": {
                "model": "Fiat Cronos ou similar",
                "category": "",
                "vehicleGroup": "Grupo H+",
                "vehicleGroupAcronym": "H+",
                "rateQualifier": "1774629610256_H+",
                "agencyName": "FOCO",
                "agencyCode": 0,
                "vehicleCode": "SDAR",
                "agencyGroup": "",
                "numberOfDoors": 4,
                "numberOfSeats": 5,
                "luggageCapacity": 2,
                "hasAirConditioning": false,
                "isAutomaticTransmission": true,
                "imageUrl": "https://cms.aluguefoco.com.br/uploads/H_fad5d7bc50.png",
                "totalValue": 508.37,
                "dailyValue": 154.05,
                "administrativeFeePercentage": 10.00,
                "bookingValue": 462.15,
                "numberOfDays": 3,
                "returnFeeValue": 0,
                "totalOvertimeValue": 0,
                "overtimeValue": 0,
                "overtimeCoverageValue": 0,
                "overtimeCoverageFeePercentage": 0,
                "numberOfOvertimeHours": 0,
                "returnFeePrice": 0,
                "returnFeeQuantity": 0,
                "totalDepositValue": 0,
                "offer": "",
                "availabilityToken": "",
                "totalDeductibleValue": 800.00,
                "isUnlimitedKm": true,
                "dailyKmLimit": 0,
                "isMonthly": false,
                "totalMonthlyDailyRateValue": 0
            },
            "optionalAddonsData": [
                {
                    "name": "Bebe Conforto",
                    "description": "Bebe Conforto",
                    "addonCode": "BCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Cadeira de Bebe",
                    "description": "Cadeira de Bebe",
                    "addonCode": "CCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "isentor cop vidros e pneus",
                    "description": "isentor cop vidros e pneus",
                    "addonCode": "CPG1N",
                    "totalValue": 44.90,
                    "dailyValue": 44.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor Cop e Vidros e Pneus",
                    "description": "Isentor Cop e Vidros e Pneus",
                    "addonCode": "CPKG1",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 6.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Cop e Prot Terceiro",
                    "description": "Isentor de Cop e Prot Terceiro",
                    "addonCode": "CPKG2",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 6.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Adicional",
                    "description": "Condutor Adicional",
                    "addonCode": "DRV",
                    "totalValue": 21.90,
                    "dailyValue": 21.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Resposvel financeiro app",
                    "description": "Resposvel financeiro app",
                    "addonCode": "FINAP",
                    "totalValue": 2.16,
                    "dailyValue": 2.16,
                    "fee": {
                        "percentage": 10.185185185185185185185185190,
                        "totalValue": 0.22
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Responsavel Financeiro",
                    "description": "Responsavel Financeiro",
                    "addonCode": "FINR",
                    "totalValue": 11.90,
                    "dailyValue": 11.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.19
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Aparelho de GPS",
                    "description": "Aparelho de GPS",
                    "addonCode": "GPS",
                    "totalValue": 17.00,
                    "dailyValue": 17.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.70
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Assento de Elevação",
                    "description": "Assento de Elevação",
                    "addonCode": "IBS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Junior",
                    "description": "Condutor Junior",
                    "addonCode": "JRD",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "JRDJR",
                    "description": "JRDJR",
                    "addonCode": "JRDMF",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWM",
                    "description": "LDWM",
                    "addonCode": "LDWM",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWUBER",
                    "description": "LDWUBER",
                    "addonCode": "LDWUB",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Multicondutores Adicionais",
                    "description": "Multicondutores Adicionais",
                    "addonCode": "MULTC",
                    "totalValue": 14.90,
                    "dailyValue": 14.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Lavagem Antecipada",
                    "description": "Lavagem Antecipada",
                    "addonCode": "PWSH2",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "RAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 0.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDLDW",
                    "totalValue": 57.90,
                    "dailyValue": 57.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDUDW",
                    "totalValue": 57.90,
                    "dailyValue": 57.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFLDW",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 6.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFUDW",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SLDWQ",
                    "totalValue": 54.90,
                    "dailyValue": 54.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Tag Pedagio",
                    "description": "Tag Pedagio",
                    "addonCode": "TOLL",
                    "totalValue": 20.00,
                    "dailyValue": 20.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.00
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "URAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                }
            ],
            "coveragesData": [
                {
                    "coverageCode": "DFCVG",
                    "name": "Proteçao Especial",
                    "description": "Proteçao Especial",
                    "totalValue": 0,
                    "dailyValue": 90.19,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNT",
                    "name": "Proteção de Vidros e Pneus",
                    "description": "Proteção de Vidros e Pneus",
                    "totalValue": 0,
                    "dailyValue": 19.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTM",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTMU",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW",
                    "name": "Proteçao Basica",
                    "description": "Proteçao Basica",
                    "totalValue": 0,
                    "dailyValue": 0,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW99",
                    "name": "PROTEÇAO 99POP",
                    "description": "PROTEÇAO 99POP",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWB2",
                    "name": "Proteçao Basica B2B",
                    "description": "Proteçao Basica B2B",
                    "totalValue": 0,
                    "dailyValue": 39.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWQ",
                    "name": "PROTECAO APP QUINZENAL",
                    "description": "PROTECAO APP QUINZENAL",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "PRTMF",
                    "name": "Proteção Mensal Flex",
                    "description": "Proteção Mensal Flex",
                    "totalValue": 0,
                    "dailyValue": 13.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "RLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 57.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "UDFCG",
                    "name": "Protecao especial",
                    "description": "Protecao especial",
                    "totalValue": 0,
                    "dailyValue": 94.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "URLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 57.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "WFCVG",
                    "name": "Proteçao Super",
                    "description": "Proteçao Super",
                    "totalValue": 0,
                    "dailyValue": 114.02,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                }
            ],
            "coupon": {
                "coupon": null,
                "valid": false
            },
            "rentalSearch": {
                "pickupStoreName": null,
                "returnStoreName": null,
                "pickupStoreCode": "GIG10",
                "returnStoreCode": "GIG10",
                "pickupDateTime": "2026-04-04T10:00:00",
                "returnDateTime": "2026-04-07T10:00:00",
                "distanceToMainStore": null
            }
        },
        {
            "vehicleData": {
                "model": "VW T-Cross, VW Nivus ou similar",
                "category": "",
                "vehicleGroup": "Grupo J+",
                "vehicleGroupAcronym": "J+",
                "rateQualifier": "1774629610256_J+",
                "agencyName": "FOCO",
                "agencyCode": 0,
                "vehicleCode": "JFAR",
                "agencyGroup": "",
                "numberOfDoors": 4,
                "numberOfSeats": 5,
                "luggageCapacity": 2,
                "hasAirConditioning": false,
                "isAutomaticTransmission": true,
                "imageUrl": "https://cms.aluguefoco.com.br/uploads/Frota_Foco_2024_J_T_Cross_ba6f2b3d0d.png",
                "totalValue": 584.69,
                "dailyValue": 177.18,
                "administrativeFeePercentage": 10.00,
                "bookingValue": 531.54,
                "numberOfDays": 3,
                "returnFeeValue": 0,
                "totalOvertimeValue": 0,
                "overtimeValue": 0,
                "overtimeCoverageValue": 0,
                "overtimeCoverageFeePercentage": 0,
                "numberOfOvertimeHours": 0,
                "returnFeePrice": 0,
                "returnFeeQuantity": 0,
                "totalDepositValue": 0,
                "offer": "",
                "availabilityToken": "",
                "totalDeductibleValue": 1500.00,
                "isUnlimitedKm": true,
                "dailyKmLimit": 0,
                "isMonthly": false,
                "totalMonthlyDailyRateValue": 0
            },
            "optionalAddonsData": [
                {
                    "name": "Bebe Conforto",
                    "description": "Bebe Conforto",
                    "addonCode": "BCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Cadeira de Bebe",
                    "description": "Cadeira de Bebe",
                    "addonCode": "CCS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "isentor cop vidros e pneus",
                    "description": "isentor cop vidros e pneus",
                    "addonCode": "CPG1N",
                    "totalValue": 44.90,
                    "dailyValue": 44.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 4.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor Cop e Vidros e Pneus",
                    "description": "Isentor Cop e Vidros e Pneus",
                    "addonCode": "CPKG1",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 6.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Cop e Prot Terceiro",
                    "description": "Isentor de Cop e Prot Terceiro",
                    "addonCode": "CPKG2",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 6.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Adicional",
                    "description": "Condutor Adicional",
                    "addonCode": "DRV",
                    "totalValue": 21.90,
                    "dailyValue": 21.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Resposvel financeiro app",
                    "description": "Resposvel financeiro app",
                    "addonCode": "FINAP",
                    "totalValue": 2.16,
                    "dailyValue": 2.16,
                    "fee": {
                        "percentage": 10.185185185185185185185185190,
                        "totalValue": 0.22
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Responsavel Financeiro",
                    "description": "Responsavel Financeiro",
                    "addonCode": "FINR",
                    "totalValue": 11.90,
                    "dailyValue": 11.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.19
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Aparelho de GPS",
                    "description": "Aparelho de GPS",
                    "addonCode": "GPS",
                    "totalValue": 17.00,
                    "dailyValue": 17.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.70
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Assento de Elevação",
                    "description": "Assento de Elevação",
                    "addonCode": "IBS",
                    "totalValue": 29.90,
                    "dailyValue": 29.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.99
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Condutor Junior",
                    "description": "Condutor Junior",
                    "addonCode": "JRD",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "JRDJR",
                    "description": "JRDJR",
                    "addonCode": "JRDMF",
                    "totalValue": 34.90,
                    "dailyValue": 34.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWM",
                    "description": "LDWM",
                    "addonCode": "LDWM",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "LDWUBER",
                    "description": "LDWUBER",
                    "addonCode": "LDWUB",
                    "totalValue": 39.00,
                    "dailyValue": 39.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.90
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Multicondutores Adicionais",
                    "description": "Multicondutores Adicionais",
                    "addonCode": "MULTC",
                    "totalValue": 14.90,
                    "dailyValue": 14.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 1.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Lavagem Antecipada",
                    "description": "Lavagem Antecipada",
                    "addonCode": "PWSH2",
                    "totalValue": 39.90,
                    "dailyValue": 39.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 3.99
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "RAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 0.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDLDW",
                    "totalValue": 57.90,
                    "dailyValue": 57.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.79
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Redutor de Coparticipação",
                    "description": "Redutor de Coparticipação",
                    "addonCode": "RDUDW",
                    "totalValue": 57.90,
                    "dailyValue": 57.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFLDW",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 6.29
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SFUDW",
                    "totalValue": 62.90,
                    "dailyValue": 62.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Isentor de Coparticipação",
                    "description": "Isentor de Coparticipação",
                    "addonCode": "SLDWQ",
                    "totalValue": 54.90,
                    "dailyValue": 54.90,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 5.49
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                },
                {
                    "name": "Tag Pedagio",
                    "description": "Tag Pedagio",
                    "addonCode": "TOLL",
                    "totalValue": 20.00,
                    "dailyValue": 20.00,
                    "fee": {
                        "percentage": 10.0,
                        "totalValue": 2.00
                    },
                    "maximumQuantity": 1,
                    "maximumChargeableDays": 1
                },
                {
                    "name": "Assistencia Veicular",
                    "description": "Assistencia Veicular",
                    "addonCode": "URAS",
                    "totalValue": 7.90,
                    "dailyValue": 7.90,
                    "fee": {
                        "percentage": 0,
                        "totalValue": 0
                    },
                    "maximumQuantity": 3,
                    "maximumChargeableDays": 3
                }
            ],
            "coveragesData": [
                {
                    "coverageCode": "DFCVG",
                    "name": "Proteçao Especial",
                    "description": "Proteçao Especial",
                    "totalValue": 0,
                    "dailyValue": 94.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNT",
                    "name": "Proteção de Vidros e Pneus",
                    "description": "Proteção de Vidros e Pneus",
                    "totalValue": 0,
                    "dailyValue": 19.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTM",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "GNTMU",
                    "name": "Proteçao Vidros e Pneus Mensal",
                    "description": "Proteçao Vidros e Pneus Mensal",
                    "totalValue": 0,
                    "dailyValue": 10.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW",
                    "name": "Proteçao Basica",
                    "description": "Proteçao Basica",
                    "totalValue": 0,
                    "dailyValue": 0,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDW99",
                    "name": "PROTEÇAO 99POP",
                    "description": "PROTEÇAO 99POP",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWB2",
                    "name": "Proteçao Basica B2B",
                    "description": "Proteçao Basica B2B",
                    "totalValue": 0,
                    "dailyValue": 39.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "LDWQ",
                    "name": "PROTECAO APP QUINZENAL",
                    "description": "PROTECAO APP QUINZENAL",
                    "totalValue": 0,
                    "dailyValue": 39.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "PRTMF",
                    "name": "Proteção Mensal Flex",
                    "description": "Proteção Mensal Flex",
                    "totalValue": 0,
                    "dailyValue": 13.00,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "RLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 57.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "UDFCG",
                    "name": "Protecao especial",
                    "description": "Protecao especial",
                    "totalValue": 0,
                    "dailyValue": 94.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "URLDW",
                    "name": "Proteção Flexível",
                    "description": "Proteção Flexível",
                    "totalValue": 0,
                    "dailyValue": 57.90,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                },
                {
                    "coverageCode": "WFCVG",
                    "name": "Proteçao Super",
                    "description": "Proteçao Super",
                    "totalValue": 0,
                    "dailyValue": 118.97,
                    "isRequired": false,
                    "sortOrder": 0,
                    "acronym": ""
                }
            ],
            "coupon": {
                "coupon": null,
                "valid": false
            },
            "rentalSearch": {
                "pickupStoreName": null,
                "returnStoreName": null,
                "pickupStoreCode": "GIG10",
                "returnStoreCode": "GIG10",
                "pickupDateTime": "2026-04-04T10:00:00",
                "returnDateTime": "2026-04-07T10:00:00",
                "distanceToMainStore": null
            }
        }
    ],
    "search": [
        {
            "agencyCode": 0,
            "pickupStore": "GIG10",
            "returnStore": "GIG10",
            "pickupDateTime": "2026-04-04T10:00:00",
            "returnDateTime": "2026-04-07T10:00:00",
            "logRequestResponse": {
                "request": [
                    "<Request xmlns=\"https://apicoral.aluguefoco.com.br/api/ota/xml\" referenceNumber=\"1\" version=\"2.3200\">\n    <ResRates>\n        <Pickup locationCode=\"GIG10\" dateTime=\"2026-04-04T10:00:00\" />\n        <Return locationCode=\"GIG10\" dateTime=\"2026-04-07T10:00:00\" />\n        <CorpRateID>ZOSSAI1</CorpRateID>\n        <EstimateType>3</EstimateType>\n        <CouponCode></CouponCode>\n    </ResRates>\n</Request>"
                ],
                "response": [
                    "<Response xmlns=\"https://apicoral.aluguefoco.com.br/api/ota/xml\" regardingReferenceNumber=\"1\" version=\"2.32\" webxg_id=\"FOCO-1774629610256-ZOSSAI1\"><ResRates success=\"true\"><Count>14</Count><Rate><RateID>1774629610256_A</RateID><Class>A</Class><SippCode>EBMN</SippCode><Availability>Available</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>391.12</Estimate><RateOnlyEstimate>355.56</RateOnlyEstimate><RateOnlyEstimateFee>35.56</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>4000.00</Liability><PrePaid>false</PrePaid><AthPad>500.00</AthPad><Loss>5000.00</Loss></Rate><Rate><RateID>1774629610256_B</RateID><Class>B</Class><SippCode>ECMR</SippCode><Availability>Available</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>391.41</Estimate><RateOnlyEstimate>355.83</RateOnlyEstimate><RateOnlyEstimateFee>35.58</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>4000.00</Liability><PrePaid>false</PrePaid><AthPad>500.00</AthPad><Loss>5000.00</Loss></Rate><Rate><RateID>1774629610256_D+</RateID><Class>D+</Class><SippCode>CDMR</SippCode><Availability>Available</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>439.66</Estimate><RateOnlyEstimate>399.69</RateOnlyEstimate><RateOnlyEstimateFee>39.97</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>4000.00</Liability><PrePaid>false</PrePaid><AthPad>500.00</AthPad><Loss>5000.00</Loss></Rate><Rate><RateID>1774629610256_F</RateID><Class>F</Class><SippCode>IDMR</SippCode><Availability>Available</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>477.21</Estimate><RateOnlyEstimate>433.83</RateOnlyEstimate><RateOnlyEstimateFee>43.38</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>4000.00</Liability><PrePaid>false</PrePaid><AthPad>500.00</AthPad><Loss>5000.00</Loss></Rate><Rate><RateID>1774629610256_H+</RateID><Class>H+</Class><SippCode>SDAR</SippCode><Availability>Available</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>508.37</Estimate><RateOnlyEstimate>462.15</RateOnlyEstimate><RateOnlyEstimateFee>46.22</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>6000.00</Liability><PrePaid>false</PrePaid><AthPad>800.00</AthPad><Loss>8000.00</Loss></Rate><Rate><RateID>1774629610256_J+</RateID><Class>J+</Class><SippCode>JFAR</SippCode><Availability>Available</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>584.69</Estimate><RateOnlyEstimate>531.54</RateOnlyEstimate><RateOnlyEstimateFee>53.15</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>8000.00</Liability><PrePaid>false</PrePaid><AthPad>1500.00</AthPad><Loss>10000.00</Loss></Rate><Rate><RateID>1774629610256_E</RateID><Class>E</Class><SippCode>DDMR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_D</RateID><Class>D</Class><SippCode>EDMR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_K</RateID><Class>K</Class><SippCode>EPNR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_J</RateID><Class>J</Class><SippCode>IFAR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_H</RateID><Class>H</Class><SippCode>SDMR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_I+</RateID><Class>I+</Class><SippCode>SVAR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_I</RateID><Class>I</Class><SippCode>SVMR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate><Rate><RateID>1774629610256_L+</RateID><Class>L+</Class><SippCode>XFAR</SippCode><Availability>UnAvailable</Availability><CurrencyCode>BRL</CurrencyCode><Estimate>0.00</Estimate><RateOnlyEstimate>0.00</RateOnlyEstimate><RateOnlyEstimateFee>0.00</RateOnlyEstimateFee><Discount>0.00</Discount><DropCharge responsibility=\"renter\">0.00</DropCharge><IncludedItemsCharged></IncludedItemsCharged><IncludedItemsChargedPrice>0</IncludedItemsChargedPrice><IncludedItemsChargedFee>0</IncludedItemsChargedFee><Distance><Included>unlimited</Included></Distance><Liability>0.00</Liability><PrePaid>false</PrePaid><AthPad>0.00</AthPad><Loss>0.00</Loss></Rate></ResRates></Response>"
                ]
            }
        }
    ],
    "bookingValueFilter": null,
    "warnings": [],
    "errors": [{
      "code": "exemplo",
      "message": "exemplo de resposta apenas.",
      "status": "string",
      "type": "string",
      "field": "string"
    }]
}
```
Realizar Reserva:
(Apenas usuários autenticados)
Realiza reserva do Carro
Observações:
Campo "documentType" possui apenas 3 opções salvas em banco. "1" para CPF, "2" para CNPJ e "3" Passaporte.
Telefone tem que ser nesse formato "+xx (xx) xxxxxxxxx".
Endpoint: /booking (POST)
Request Body (exemplo):
```json
{
  "pickupDateTime": "2025-11-13T15:51:43.118Z",
  "returnDateTime": "2025-11-13T15:51:43.118Z",
  "pickupStore": "string",
  "returnStore": "string",
  "customer": {
    "email": "string",
    "name": "string",
    "phoneNumber": "string",
    "documentType": "string",
    "document": "string"
  },
  "vehicleCode": "string",
  "vehicleGroup": "string",
  "optionalAddonsCodes": [
    "string"
  ],
  "coverageCode": "string",
  "promotionalCode": "string",
  "rateQualifier": "string"
}
```
Response Body sucesso (exemplo):
```json
{
  "warnings": [
    {
      "type": "string",
      "code": "string",
      "text": "string"
    }
  ],
  "booking": {
    "bookingCode": "string",
    "bookingStatus": "Booked",
    "customerLastName": "string",
    "customerFirstName": "string",
    "coverages": [
      {
        "isRequired": true,
        "coverageType": "24",
        "coverageCode": "BAS",
        "coverageTypeTitle": "Supplement",
        "coverageTypeDetails": null,
        "quantity": 1,
        "totalValue": 35.55,
        "unitPrice": 35.55,
        "unitType": "Day",
        "currency": "BRL",
        "taxIncluded": false,
        "includedInRate": true
      }
    ],
    "optionalAddons": [],
    "coupon": null
  },
  "basicBookingTotal": {
    "totalValue": 176.25,
    "estimatedValue": 202.69,
    "currency": "BRL"
  },
  "logRequestResponse": {
    "request": "string",
    "response": "string"
  },
  "errors": [
    {
      "code": "exemplo",
      "message": "exemplo de resposta apenas.",
      "status": "string",
      "type": "string",
      "field": "string"
    }
  ]
}
```
Detalhes da reserva:
(Apenas usuários autenticados)
Busca na locadora, através do código da reserva, as informações da reserva.
Endpoint: /foco-rac/bookingDetails/${bookingCode} (GET)

Response Body sucesso (exemplo):
``` json
{
    "error": "",
    "status": "Confirmed",
    "bookingCode": "R1095376-25",
    "pickupDateTime": "2026-04-15T15:00:00",
    "returnDateTime": "2026-04-16T16:00:00",
    "pickupStore": "Recife - Aeroporto (REC)",
    "returnStore": "Recife - Aeroporto (REC)",
    "pickupStoreCode": "REC20",
    "returnStoreCode": "REC20",
    "group": {
        "name": "Peugeot 208 ou similar",
        "code": "D"
    },
    "customer": {
        "name": "string",
        "document": "",
        "phoneNumber": "string",
        "email": "string"
    },
    "kilometerCap": "",
    "partner": {
        "partner": "",
        "code": ""
    },
    "totalValue": "128.47",
    "coverage": {
        "name": "Proteçao Basica",
        "code": ""
    },
    "sessionId": "34QTO27XC08ME37R1DNW_2026-03-17T12:19:41.427Z"
}
```

Cancelar Reserva
(Apenas usuários autenticados)
Realiza o cancelamento da reserva.
Endpoint: /foco-rac/cancel/${bookingCode} (POST)
Request Body (exemplo):
```json
{
  "bookingCode": "string",
  "cancellationReason": "string"
}
```
Response Body sucesso (exemplo):
```json
{
  "booking": {
    "bookingCode": "string",
    "bookingStatus": "Cancelled",
    "customerLastName": null,
    "customerFirstName": null,
    "coverages": null,
    "optionalAddons": null,
    "coupon": null
  },
  "warnings": [
    {
      "type": "string",
      "code": "string",
      "text": "string"
    }
  ],
  "logRequestResponse": {
    "request": "string",
    "response": "string"
  },
  "errors": [
    {
      "code": "exemplo",
      "message": "exemplo de resposta apenas.",
      "status": "string",
      "type": "string",
      "field": "string"
    }
  ]
}
```