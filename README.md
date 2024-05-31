## Description

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ OR nest start --watch
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```




## FLUXO


### Usuários ao se regritar

```
URL: localhost:3001/auth/register

RESPONSE JSON:
{
	"clinic_name" : "PRO IMAGEM 2",
    "name" : "julios samora",
	"email": "julios@gmail.com",
	"password": "123456"
}
```

Isso gera um id_clinic que será usado para persistir no banco a criação do usuário
retornando esse formato:

```
REQUEST JSON: 
{
    "user": {
		"id": 2,
		"id_clinic": 8,
		"name": "julios samora",
		"email": "julios@gmail.com",
		"role": 1
	}
}
```

<hr>





Ao clicar para emitir uma senha, 
ele verifica se existe na servicePasswordGroup com deleted 0 (NÃO RESETADO) e utiliza ela como parametro para gerar as senhas sequenciais


### Resetar senhas
```service_password_groups/reset```
Reseta todas as senhas, simplismente pega o id_clinic da sessão e coloca todos como deleted TRUE, quando for criado uma nova senha, ele verifica que não tem um grupo com deleted false e crie um novo grupo de senhas, as novas senhas irão usar esse grupo.