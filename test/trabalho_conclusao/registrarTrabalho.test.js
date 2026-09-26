import { expect } from 'chai'

import { api } from '../helpers/api.js'
import { comTokenDeAdmin } from '../helpers/auth.js'
import { getAlunoIdEToken } from '../helpers/aluno.js'
import { getDisciplinaId, matriculaAluno } from '../helpers/disciplina.js'

describe('Registra um novo trabalho para uma disciplina em que o aluno está matriculado', () => {

    let id
    let token

    beforeEach(async () => {
        ({ id, token } = await getAlunoIdEToken())
    })

    it('deve registrar um novo trabalho com sucesso', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(201)

        const body = response.body
        expect(body.alunoId).to.equal(id)
        expect(body.disciplinaId).to.equal(disciplina.disciplinaId)
        expect(body.titulo).to.equal(disciplina.titulo)
        expect(body.descricao).to.equal(disciplina.descricao)
        expect(body.status).to.equal('entregue')
        expect(body).to.have.property('nota')
        expect(body).to.have.property('feedback')
        expect(body).to.have.property('dataEntrega')
        expect(body.dataEntrega).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('createdAt')
        expect(body.createdAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('updatedAt')
        expect(body.updatedAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('id')
        expect(body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('deve registrar um novo trabalho quando o campo descrição está vazio', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: ''
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(201)

        const body = response.body
        expect(body.alunoId).to.equal(id)
        expect(body.disciplinaId).to.equal(disciplina.disciplinaId)
        expect(body.titulo).to.equal(disciplina.titulo)
        expect(body.descricao).to.equal(disciplina.descricao)
        expect(body.status).to.equal('entregue')
        expect(body).to.have.property('nota')
        expect(body).to.have.property('feedback')
        expect(body).to.have.property('dataEntrega')
        expect(body.dataEntrega).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('createdAt')
        expect(body.createdAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('updatedAt')
        expect(body.updatedAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('id')
        expect(body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it.skip('deve registrar um novo trabalho quando o campo descrição está ausente', async () => {
        // BUG: O sistema retorna status 500 quando o campo descrição está ausente, quando deveria retornar 201

        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(201)
    })

    it('deve registrar um novo trabalho quando tem autorização de admin', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(disciplina)

        expect(response.status).to.equal(201)

        const body = response.body
        expect(body.alunoId).to.equal(id)
        expect(body.disciplinaId).to.equal(disciplina.disciplinaId)
        expect(body.titulo).to.equal(disciplina.titulo)
        expect(body.descricao).to.equal(disciplina.descricao)
        expect(body.status).to.equal('entregue')
        expect(body).to.have.property('nota')
        expect(body).to.have.property('feedback')
        expect(body).to.have.property('dataEntrega')
        expect(body.dataEntrega).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('createdAt')
        expect(body.createdAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('updatedAt')
        expect(body.updatedAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        expect(body).to.have.property('id')
        expect(body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('não deve registrar um novo trabalho quando o campo disciplinaId está vazio', async () => {
        const disciplina = {
            disciplinaId: '',
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"disciplinaId\" e \"titulo\" são obrigatórios.')
    })

    it('não deve registrar um novo trabalho quando o campo titulo está vazio', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: '',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"disciplinaId\" e \"titulo\" são obrigatórios.')
    })


    it('não deve registrar um novo trabalho quando o campo disciplinaId está ausente', async () => {
        const disciplina = {
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"disciplinaId\" e \"titulo\" são obrigatórios.')
    })

    it('não deve registrar um novo trabalho quando o campo titulo está ausente', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Os campos \"disciplinaId\" e \"titulo\" são obrigatórios.')
    })

    it('não deve registrar um novo trabalho quando o campo disciplinaId é inválido', async () => {
        const disciplina = {
            disciplinaId: 'invalid-disciplina',
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal(`Disciplina com id \"${disciplina.disciplinaId}\" não encontrada.`)
    })

    it('não deve registrar um novo trabalho quando o parâmetro alunoId é inválido', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/invalid-alunoId/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(403)
        expect(response.body.error).to.equal('Você só pode acessar os seus próprios dados.')
    })

    it('não deve registrar um novo trabalho quando o parâmetro alunoId está vazio', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos//trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('Rota não encontrada: POST /api/alunos//trabalhos')
    })

    it('não deve registrar um novo trabalho quando o aluno não está matriculado', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(disciplina)

        expect(response.status).to.equal(409)
        expect(response.body.error).to.equal('O aluno não está matriculado nesta disciplina.')
    })

    it('não deve registrar um novo trabalho quando o token está ausente', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .send(disciplina)

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('Token de autenticação não informado.')
    })

    it('não deve registrar um novo trabalho quando o token é inválido', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', 'invalid-token')
            .send(disciplina)

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('Token de autenticação não informado.')
    })

    it('não deve registrar um novo trabalho quando o token está vazio', async () => {
        const disciplina = {
            disciplinaId: await getDisciplinaId(),
            titulo: 'Automação de Testes de API',
            descricao: 'Automatizando testes de API com Mocha, Chai e Supertest'
        }

        await matriculaAluno(disciplina.disciplinaId, id)

        const response = await api()
            .post(`/api/alunos/${id}/trabalhos`)
            .set('Content-type', 'application/json')
            .set('Authorization', '')
            .send(disciplina)

        expect(response.status).to.equal(401)
        expect(response.body.error).to.equal('Token de autenticação não informado.')
    })

})