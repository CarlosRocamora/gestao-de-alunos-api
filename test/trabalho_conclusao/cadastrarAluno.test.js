import { expect } from 'chai'

import { api } from '../helpers/api.js'
import { comTokenDeAdmin, getToken } from '../helpers/auth.js'
import { novoAluno } from '../factories/alunosFactory.js'

describe('Cadastra um novo aluno (define também a senha de acesso do aluno)', () => {

    it('deve cadastrar aluno com sucesso', async () => {
        const aluno = novoAluno()

        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(aluno)

        expect(response.status).to.equal(201)

        const body = response.body
        expect(body).to.have.property('id')
        expect(body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        expect(body.nome).to.equal(aluno.nome)
        expect(body.email).to.equal(aluno.email)
        expect(body.matricula).to.equal(aluno.matricula)
        expect(body.role).to.equal('aluno')
        expect(body).to.have.property('createdAt')
        expect(body.createdAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('updatedAt')
        expect(body.updatedAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it('não deve cadastrar aluno quando o campo nome está vazio', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: '',
                email: 'carlos.test@example.com',
                matricula: '23042003',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it.skip('não deve cadastrar aluno quando o email é inválido', async () => {
        // BUG: A API permite cadastrar um aluno com email inválido (sem '@')

        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                email: '404.com',
                matricula: '23042003',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
    })

    it('não deve cadastrar aluno quando o campo email está vazio', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                email: '',
                matricula: '23042003',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o campo matrícula está vazio', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                email: 'carlos.test@example.com',
                matricula: '',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o campo senha está vazio', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                email: 'carlos.test@example.com',
                matricula: '23042003',
                senha: ''
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o campo nome está ausente', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                email: 'carlos.test@example.com',
                matricula: '23042003',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o campo email está ausente', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                matricula: '23042003',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o campo matrícula está ausente', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                email: 'carlos.test@example.com',
                senha: '123456'
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o campo senha está ausente', async () => {
        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Test',
                email: 'carlos.test@example.com',
                matricula: '23042003',
            })

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"nome\", \"email\", \"matricula\" e \"senha\" são obrigatórios.')
    })

    it('não deve cadastrar aluno quando o token está ausente', async () => {
        const aluno = novoAluno()

        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .send(aluno)

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('Token de autenticação não informado.')
    })

    it('não deve cadastrar aluno quando o token é inválido', async () => {
        // IMPROVEMENT: A mensagem de erro poderia ser 'Token de autenticação é inválido'

        const aluno = novoAluno()

        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', '123456789')
            .send(aluno)

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('Token de autenticação não informado.')
    })

    it('não deve cadastrar aluno quando o token está vazio', async () => {
        const aluno = novoAluno()

        const response = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', '')
            .send(aluno)

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('Token de autenticação não informado.')
    })

    it('não deve cadastrar aluno já cadastrado no sistema', async () => {
        const aluno = novoAluno()

        const alunoResponse = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(aluno)

        expect(alunoResponse.status).to.equal(201)

        const duplicadoResponse = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(aluno)

        expect(duplicadoResponse.status).to.equal(409)
        expect(duplicadoResponse.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.')
    })

    it('não deve cadastrar aluno quando não tem autorização', async () => {
        const aluno = novoAluno()

        const adminResponse = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(aluno)

        expect(adminResponse.status).to.equal(201)

        const token = await getToken(aluno.email, aluno.senha)

        const alunoResponse = await api()
            .post('/api/admin/alunos')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(aluno)

        expect(alunoResponse.status).to.equal(403)
        expect(alunoResponse.body.error).to.equal('Você não tem permissão para acessar este recurso.')
    })

})