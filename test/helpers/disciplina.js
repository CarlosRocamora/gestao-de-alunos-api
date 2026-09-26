import { expect } from 'chai'

import { comTokenDeAdmin } from '../helpers/auth.js'
import { api } from '../helpers/api.js'

import { novaDisciplina } from '../factories/disciplinasFactory.js'

export async function getDisciplinaId() {
    const response = await api()
        .post('/api/admin/disciplinas')
        .set('Content-type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send(novaDisciplina())

    return response.body.id
}

export async function matriculaAluno(disciplinaId, alunoId) {
    const response = await api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send({ alunoId })

    expect(response.status).to.equal(201)
}