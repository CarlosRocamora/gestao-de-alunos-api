import { api } from '../../helpers/api.js'
import { expect } from 'chai'
import { comTokenDeAdmin } from '../../helpers/auth.js'
import { novoAluno } from '../../factories/alunosFactory.js'
import { novaDisciplina } from '../../factories/disciplinasFactory.js'
import  testesDeMatriculas  from '../../fixtures/matriculas.json' with { type: 'json'}

describe('Matrícula de Aluno em Disciplina', () => {
    testesDeMatriculas.forEach(testeDeMatricula => {
        it(testeDeMatricula.testTitle, async () => {
            // Arrange
            const cadastradoAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosAluno)

            let alunoId = cadastradoAlunoResposta.body.id

            const cadastradoDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosDisciplina)

            let disciplinaId = cadastradoDisciplinaResposta.body.id

            // Act
            const cadastradoMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send({
                    alunoId: alunoId
                })

            // Assert
            expect(cadastradoMatriculaResposta.status).to.equal(testeDeMatricula.statusCodeEsperado)
            expect(cadastradoMatriculaResposta.body.alunoId).to.equal(alunoId)
            expect(cadastradoMatriculaResposta.body.disciplinaId).to.equal(disciplinaId)
        })
    })
    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        // Arrange
        const cadastradoAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novoAluno())

        let alunoId = cadastradoAlunoResposta.body.id

        const cadastradoDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novaDisciplina())

        let disciplinaId = cadastradoDisciplinaResposta.body.id

        // Act
        const cadastradoMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                alunoId: alunoId
            })

        // Assert
        expect(cadastradoMatriculaResposta.status).to.equal(201)
        expect(cadastradoMatriculaResposta.body.alunoId).to.equal(alunoId)
        expect(cadastradoMatriculaResposta.body.disciplinaId).to.equal(disciplinaId)
    })

})