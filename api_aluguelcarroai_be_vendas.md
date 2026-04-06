## API Aluguel de carro AI VENDAS

O token precisa ser passado no header da requisição com key = "Authorization" e value = "Bearer VALORDOTOKEN".

**BaseURL**: https://api.alugueldecarro.ai/

**RentalCompanyId:**
Sempre que tiver "rentalCompanyId" ou "rentalCompaniesIds". O Id de cada locadora está configurado da seguinte forma:
- 1 = Movida
- 2 = Localiza
- 3 = Unidas
- 4 = Foco

### Login:
Endpoint utilizado para fazer login no portal de vendas:
#### Endpoint: /portal/login (POST)
**Request Body (exemplo):**
```json 
{
  "loginName": "string",
  "password": "string"
}
```
**Response Body sucesso (exemplo):**
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
**Response Body caso campo vazio (exemplo):**
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

### Verificar primeiro acesso do usuário:

Verifica se é primeiro acesso do usuário.

#### Endpoint: /portal/login/isFirstAccess/{loginName} (GET)

**Response Body sucesso (exemplo):**
```json
{
  "isFirstAccess": false,
  "errors": null
}
```

### Criar usuário: 

**(apenas usuários nível "administrator")**

Cria usuário para o portal de vendas.


#### Endpoint: /portal/user (POST)
**Request Body (exemplo):**
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

**Response Body sucesso (exemplo):**
```json
{
  "userId": 4,
  "errors": null
}
```

### Recuperar dados do usuário: 

**(apenas usuários nível "administrator")**

Recupera dados do usuário do portal de vendas.

#### Endpoint: /portal/user/{userId} (GET)

**Response Body sucesso (exemplo):**
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

### Editar dados do usuário:

**(apenas usuários nível "administrator")**

Edita informações de um usuário do portal de vendas.

#### Endpoint: /portal/user/{userId} (PUT)

**Request Body (exemplo):**
``` json
{
  "name": "STRING",
  "surname": "STRING",
  "email": "STRING",
  "active": true,
  "role": "STRING"
}
```
**Response Body sucesso (exemplo):**
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

### Recuperar roles: 

**(apenas usuários nível "administrator")**

Recupera "roles" disponíveis no sistema:

#### Endpoint: /portal/user/roles (GET)

**Response Body sucesso (exemplo):**
``` json
{
  "roles": [
    "administrator",
    "operator"
  ]
}
```

### Salvar primeira senha do usuário:
Salva a senha do usuário do portal de vendas se for o primeiro acesso dele.

#### Endpoint: /portal/user/registerFirstPassword (POST)

**Request Body (exemplo):**
``` json
{
  "loginName": "string",
  "password": "string"
}
```

**Response Body sucesso (exemplo):**
``` json
{
  "success": true,
  "errors": null
}
```

### Resetar senha do usuário: 

**(apenas usuários nível "administrator")**

Reseta a senha de um usuário do portal de vendas.

#### Endpoint: /portal/user/resetPassword/{UserId} (GET)

**Response Body sucesso (exemplo):**
```json
{
  "success": true,
  "errors": null
}
```

### Recuperar lista de usuário: 

**(apenas usuários nível "administrator")**

Recupera lista de usuários do portal de vendas.

**Observações:**
- não passar nenhum dos query params, gera uma busca na página 1, sem criterio de busca, ordenado em ordem decrescente por Id.

#### Endpoint: /portal/userlist?search={string}&sortBy={string}&sortOrder=desc&page=1&pageSize=10 (GET)

**Response Body sucesso (exemplo):**
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

### Buscar lojas:

**(Apenas usuários autenticados)**

Buscar lojas de locadoras através de um termo. Sempre utilizar "search"

#### Endpoint: /searchStores (POST)

**Request Body (exemplo):**
```json
{
  "rentalCompaniesIds": [
    1
  ],
  "search": "rio de janeiro",
  "neighborhood": "",
  "city": "",
  "airport": "",
  "isApp": false
}
```

**Response Body sucesso (exemplo):**
```json
{
  "rentalCompanies": [
    {
      "rentalCompanyId": 1,
      "rentalCompanyName": "Movida",
      "stores": [
        {
          "acronym": "",
          "name": "",
          "street": "",
          "number": "",
          "neighborhood": "",
          "city": "",
          "region": "",
          "zipCode": "",
          "mapsLocation": "",
          "distanceToMainStore": 0,
          "app": false,
          "airport": {
            "name": "",
            "iata": ""
          },
          "storeOperationTimes": [
            {
              "dayOfTheWeek": "",
              "openingTime": "",
              "closingTime": ""
            }
          ]
        }
      ],
      "airports": {
        "name": "",
        "storeCount": 1,
        "stores": [
          "sigla"
        ]
      },
      "cities": {
        "name": "",
        "storeCount": 1,
        "stores": [
          "sigla"
        ]
      },
      "neighborhoods": {
        "name": "",
        "storeCount": 1,
        "stores": [
          "sigla"
        ]
      }
    }
  ],
  "errors": [
    {
      "code": "",
      "message": "",
      "status": "",
      "type": "",
      "field": ""
    }
  ]
}
```


### Disponibilidade:

**(Apenas usuários autenticados)**

Realiza várias buscas de disponibilidade em diversas locadoras.

#### Endpoint: /availability (POST)

**Request Body (exemplo):**
```json
{
  "availabilities": [
    {
      "rentalCompanyId": 0,
      "pickupDateTime": "2025-11-13T15:47:28.079Z",
      "returnDateTime": "2025-11-13T15:47:28.079Z",
      "pickupStore": "string",
      "returnStore": "string",
      "couponCode": "string",
      "chosenGroups": [
        "string"
      ]
    }
  ]
}
```

**Response Body sucesso (exemplo):**
```json
{
  "availabilities": [
    {
      "rentalCompanyId": 0,
      "rentalCompanyName": "",
      "availableVehicles": [
        {
          "vehicleData": {
            "model": "",
            "category": "",
            "vehicleGroup": "",
            "vehicleGroupAcronym": "",
            "rateQualifier": "",
            "agencyName": "",
            "agencyCode": 0,
            "vehicleCode": "",
            "agencyGroup": "",
            "numberOfDoors": 0,
            "numberOfSeats": 0,
            "luggageCapacity": 0,
            "hasAirConditioning": false,
            "isAutomaticTransmission": false,
            "imageUrl": "",
            "totalValue": 0,
            "dailyValue": 0,
            "administrativeFeePercentage": 0,
            "bookingValue": 0,
            "numberOfDays": 0,
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
            "totalDeductibleValue": 0,
            "isUnlimitedKm": false,
            "dailyKmLimit": 0,
            "isMonthly": false,
            "totalMonthlyDailyRateValue": 0
          },
          "optionalAddonsData": [
            {
              "name": "",
              "description": "",
              "addonCode": "",
              "totalValue": 0,
              "dailyValue": 0,
              "fee": {
                "percentage": 0,
                "totalValue": 0
              },
              "maximumQuantity": 0,
              "maximumChargeableDays": 0
            }
          ],
          "coveragesData": [
            {
              "coverageCode": "",
              "name": "",
              "description": "",
              "totalValue": 0,
              "dailyValue": 0,
              "isRequired": false,
              "sortOrder": 0,
              "acronym": ""
            }
          ],
          "coupon": {
            "coupon": "",
            "valid": false
          },
          "rentalSearch": {
            "pickupStoreName": "",
            "returnStoreName": "",
            "pickupStoreCode": "",
            "returnStoreCode": "",
            "pickupDateTime": "2025-11-03T20:43:37.3580189Z",
            "returnDateTime": "2025-11-03T20:43:37.3580277Z",
            "distanceToMainStore": 0
          }
        }
      ],
      "search": [
        {
          "agencyCode": 0,
          "pickupStore": "",
          "returnStore": "",
          "pickupDateTime": "2025-11-03T20:43:37.3585373Z",
          "returnDateTime": "2025-11-03T20:43:37.3585467Z",
          "logRequestResponse": {
            "request": "",
            "response": ""
          }
        }
      ],
      "bookingValueFilter": {
        "maxAvailabilityValue": 0,
        "minAvailabilityValue": 0
      },
      "warnings": [
        {
          "type": "",
          "code": "",
          "text": ""
        }
      ],
      "errors": [
        {
          "code": "",
          "message": "",
          "status": "",
          "type": "",
          "field": ""
        }
      ]
    }
  ],
  "errors": null
}
```

### Realizar Reserva:

**(Apenas usuários autenticados)**

Realiza reserva na locadora selecionada

**Observações:**
- Campo "documentType" possui apenas 3 opções salvas em banco. "1" para CPF, "2" para CNPJ e "3" Passaporte.
- Telefone tem que ser nesse formato "+xx (xx) xxxxxxxxx".

#### Endpoint: /booking (POST)

**Request Body (exemplo):**
```json
{
  "rentalCompanyId": 1,
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

**Response Body sucesso (exemplo):**
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

### Detalhes da reserva:

**(Apenas usuários autenticados)**

Busca na locadora, através do código da reserva, as informações da reserva.

#### Endpoint: /booking/getDetails (POST)

**Request Body (exemplo):**
```json
{
  "rentalCompanyId": 1,
  "bookingCode": "teste"
}
```

**Response Body sucesso (exemplo):**
``` json
{
  "status": "Approved",
  "bookingCode": "MV1JO2L7VHBR",
  "pickupDateTime": "2025-11-17T10:00:00",
  "returnDateTime": "2025-11-18T10:00:00",
  "pickupStore": "SAO PAULO  GUARULHOS AEROPORTO",
  "returnStore": "SAO PAULO  GUARULHOS AEROPORTO",
  "pickupStoreCode": "GRU",
  "returnStoreCode": "GRU",
  "group": {
    "name": "GRUPO AX  COMPACTO COM AR CONDICIONADO",
    "code": "ECMM"
  },
  "customer": {
    "name": "Silva da Costa",
    "document": "73172136086",
    "phoneNumber": "+55 (21) 982917447",
    "email": "teste@zoss.com.br"
  },
  "kilometerCap": null,
  "partner": {
    "partner": "",
    "code": ""
  },
  "totalValue": "228.23",
  "coverage": {
    "name": "PROTECAO BASICA",
    "code": "BAS"
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

### Editar Reserva:

**(Apenas usuários autenticados)**

Envia alterações na reserva na locadora selecionada.

**Observações:**
- Campo "tipoDocumento" possui apenas 3 opções salvas em banco. "1" para CPF, "2" para CNPJ e "3" Passaporte.
- Telefone tem que ser nesse formato "+xx (xx) xxxxxxxxx".

#### Endpoint: /booking/update (PUT)

**Request Body (exemplo):**
``` json
{
  "rentalCompanyId": 0,
  "bookingCode": "string",
  "pickupDateTime": "2025-10-30T20:08:18.856Z",
  "returnDateTime": "2025-10-30T20:08:18.856Z",
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

**Response Body sucesso (exemplo):**
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
    "bookingStatus": "string",
    "customerLastName": "string",
    "customerFirstName": "string",
    "coverages": [
      {
        "isRequired": true,
        "coverageType": "24",
        "coverageCode": "BAS",
        "coverageTypeTitle": "Supplement",
        "coverageTypeDetails": "PROTEÇÃO PARCIAL",
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
    "totalValue": 241.02,
    "estimatedValue": 277.17,
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


### Cancelar Reserva

**(Apenas usuários autenticados)**

Realiza o cancelamento da reserva na locadora selecionada.

#### Endpoint: /booking/cancel (POST)

**Request Body (exemplo):**
```json
{
  "rentalCompanyId": 0,
  "bookingCode": "string",
  "cancellationReason": "string"
}
```

**Response Body sucesso (exemplo):**
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