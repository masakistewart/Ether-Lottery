const assert = require('assert')
const ganache = require('ganache-cli')
const provider = ganache.provider()
const Web3 = require('web3')
const web3 = new Web3(provider)

const { interface, bytecode } = require('../compile.js')
let fetchedAccounts
let inbox

beforeEach( async () => {
    fetchedAccounts = await web3.eth.getAccounts()

    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
        data: bytecode,
        arguments: ['hello'] 
    })
    .send({
        from: fetchedAccounts[0],
        gas: '1000000'
    })

    inbox.setProvider(provider)
})

describe('#Inbox', () => {
    it('has a default message', async () => {
        const message = await inbox.methods.message().call()
        assert.equal(message, 'hello')
    })

    it('should update the message', async () => {
        await inbox.methods.setMessage('bang bang').send({
            from: fetchedAccounts[0],
            gas: '1000000'
        })

        message = await inbox.methods.message().call()

        assert.equal(message, 'bang bang')
    })
})