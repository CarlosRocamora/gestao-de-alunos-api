import { expect } from 'chai'

import { api } from '../helpers/api.js'

import testesDeLogin from '../fixtures/login.json' with { type: 'json' }

import 'dotenv/config'

describe('Data Driven Testing - Login', () => {
    testesDeLogin.forEach(testeDeLogin => {
        it(testeDeLogin.testTitle, async () => {
            const response = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send(testeDeLogin.dadosAluno)

            expect(response.status).to.equal(testeDeLogin.statusCodeEsperado)
        })
    })
})