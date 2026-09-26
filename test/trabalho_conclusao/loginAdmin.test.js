import { expect } from 'chai'

import { api } from '../helpers/api.js'

import 'dotenv/config'

describe('Autentica um administrador e retorna um token JWT', () => {

    it('deve logar como administrador com sucesso', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA
            })

        expect(response.status).to.equal(200)

        const body = response.body
        expect(body).to.have.property('token')
        expect(body.token).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        expect(body.usuario.id).to.equal('admin-principal')
        expect(body.usuario.nome).to.equal('Administrador do Sistema')
        expect(body.usuario.email).to.equal(process.env.ADMIN_EMAIL)
        expect(body.usuario.role).to.equal('admin')
    })

    it('não deve logar quando o email é inválido', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: '404@test.com',
                senha: process.env.ADMIN_SENHA
            })

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('E-mail ou senha inválidos.')
    })

    it('não deve logar quando a senha é inválida', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: 'invalid-password'
            })

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('E-mail ou senha inválidos.')
    })

    it('não deve logar quando o campo email está vazio', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: '',
                senha: process.env.ADMIN_SENHA
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

    it('não deve logar quando o campo senha está vazio', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: ''
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

    it('não deve logar quando o campo email está ausente', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                senha: process.env.ADMIN_SENHA
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

    it('não deve logar quando o campo senha está ausente', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

})
