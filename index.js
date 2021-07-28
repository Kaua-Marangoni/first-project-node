/*
    - Query params => meusite.com/users?nome=kaua&age=17   // FILTROS
    - Route params => /users/10   // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => { "name": "Kaua", "age": 17}

    - GET - Leitura (Apenas informações, sem alteração)    
    - POST - Criação (Envia e guarda informações)
    - PUT - Atualização (Atualizando algo que já existe. Ex, quando for alterar diversos dados)
    - PATCH - Atualização parcial (Quando for atualizar apenas alguma coisa. Ex, alterar apenas e-mail)
    - DELETE - Deleção (Deletar algum informação. Ex, quando for deletar uma conta)

    - Middleware => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
*/

const { response } = require("express")
const express = require("express")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get("/users", (request, response) => {
    return response.json(users)
})

app.post("/users", (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
})

app.put("/users/:id", checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser)
})

app.delete("/users/:id", checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json(users)
})


app.listen(port, () => {
    console.log(`🚀️ Server started on port ${port}`)
})