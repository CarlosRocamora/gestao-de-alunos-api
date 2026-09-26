import { expect } from 'chai'

import { comTokenDeAdmin, getToken } from '../helpers/auth.js'
import { api } from '../helpers/api.js'

import { novoAluno } from '../factories/alunosFactory.js'

export async function getAlunoIdEToken() {
    const aluno = novoAluno()

    const adminResponse = await api()
        .post('/api/admin/alunos')
        .set('Content-type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send(aluno)

    expect(adminResponse.status).to.equal(201)

    const response = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            email: aluno.email,
            senha: aluno.senha
        })

    return {
        id: response.body.usuario.id,
        token: response.body.token
    }
}