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





------------------------------------------

// Fluxo, inicial de gereciamento de senhas

// Clica em chamar próximo, até o momento não exibe nenhuma senha, ele busca na lista e coloca a atual como atendimento
// Você precisa definir o setor para enviar a senha (direcionar)
// Você não tem como Chamar o próximo sem direcionar a senha atual

// ESTADO: AGUARDANDO / EM ATENDIMENTO/ ATENDIDO

// Quando chamamos o próximo, ele passa a ser EM ATENDIMENTO
// Se eu encerrar o atendimento, vira ATENDIDO
// Se eu NÃO direcionar o paciente e clicar em chamar pŕoximo, vira ATENDIDO
// Se eu direcionar a senha, ele volta para AGUARDANDO só que com o ID do place novo, com updated_at E preenche a tabela password_service_log com os dados anteriores que fica sendo o histórico de chamadas




------------------------------------------









Backend
    - [V] Setup da aplicação
    - [V] Criar conta
    - [V] Login
    - [V] Logout
    - [V] Crud de usuários
    - [V] Crud de lugares/setores
    - [V] Lógica das senhas
    - [V] Lógica de redirecionar senhas existente
    - [] Lógica de chamar novamente uma senha
    - [] Lógica de chamar a pŕoxima senha
    - [] Lógica de encerrar atendimento da senha
    - [v] Lógica de redefinir todas as senhas
    - [V] Lógica do totem (emitir as senhas)
    - [] Lógica do monitor (tela de chamadas da senha)

Frontend
    Lógica dos usuários
        - [V] Criar novo usuário
        - [V] Excluir usuário
        - [V] Listar todos os usuários
        - [V] Colocar um campo opcional guide, pois quando clicar em chamar senha, preenche o guiche
        - [] Editar usuário
    Lógica dos lugares/setores
        - [V] Criar local/setor
        - [V] Excluir local/setor
        - [V] Listar todos local/setor
        - [] Editar local/setor
    Lógica do painel administrativo
        - [V] Selecionar um local para os botões funcionarem (gerenciar o setor selecionado)
        - [] Enviar senha para o setor desejado (select com botão)
        - [] Exibir senha atual
        - [] Chamar novamente uma senha
        - [] voltar senha
        - [] Chamar próxima senha
        - [] Encerrar senha
        - [] Mostrar últimas chamadas
    Lógica do totem (emitir senha)
        - [V] Ao clicar, emitir a senha para o setor desejado
    Lógica do monitor (onde os pacientes vêem suas senhas)
        - [] mostrar senha atual com setor, e nome se houver preenchido
        - [] mostrar histórico de senhas chamadas


        
Lógica de redefinir todas as senhas
Lógica do totem (emitir as senhas para o setor desejado)
Crud de lugares/setores
   



    // Vou pegar o id_service_password e todas as suas infos, e duplicar para uma tabela de password_logs
    // Após duplicar o registro, apenas vou alterar o place_id da senha atual para um novo, trocar o status para "aguardando" e redirect true.