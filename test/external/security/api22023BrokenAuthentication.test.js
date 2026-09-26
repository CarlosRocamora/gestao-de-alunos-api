import { api } from '../../helpers/api.js'
import { expect } from 'chai'
import { novoAluno } from '../../factories/alunosFactory.js'

describe('API2:2023 Broken Authentication - OWASP', () => {
    it('Doesnt validate the JWT expiration date', async () => {
        const tokenExpirado = 'colar-token-expirado'

        const cadastradoAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenExpirado}`)
            .send(novoAluno())

        expect(cadastradoAlunoResposta.status).to.equal(401)
    })
})