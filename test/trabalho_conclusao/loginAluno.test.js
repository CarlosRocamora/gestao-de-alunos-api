import { expect } from 'chai'

import { api } from '../helpers/api.js'
import { comTokenDeAdmin } from '../helpers/auth.js'
import { novoAluno } from '../factories/alunosFactory.js'

describe('Autentica um aluno e retorna um token JWT', () => {

    let aluno

    beforeEach(async () => {
        aluno = novoAluno()

        const alunoResponse = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(aluno)

        expect(alunoResponse.status).to.equal(201)
    })

    it('deve logar como aluno com sucesso', async () => {
        const loginResponse = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: aluno.email,
                senha: aluno.senha
            })

        expect(loginResponse.status).to.equal(200)

        const body = loginResponse.body
        expect(body).to.have.property('token')
        expect(body.token).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        expect(body.usuario).to.have.property('id')
        expect(body.usuario.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        expect(body.usuario.nome).to.equal(aluno.nome)
        expect(body.usuario.email).to.equal(aluno.email)
        expect(body.usuario.role).to.equal('aluno')
    })

    it('não deve logar quando o email é inválido', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: '404@test.com',
                senha: aluno.senha
            })

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('E-mail ou senha inválidos.')
    })

    it('não deve logar quando a senha é inválida', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: aluno.email,
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
                senha: aluno.senha
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

    it('não deve logar quando o campo senha está vazio', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: aluno.email,
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
                senha: aluno.senha
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

    it('não deve logar quando o campo senha está ausente', async () => {
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: aluno.email,
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"email\" e \"senha\" são obrigatórios.')
    })

})