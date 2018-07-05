const assert = require('assert')
const ganache = require('ganache-cli')
const provider = ganache.provider()
const Web3 = require('web3')
const web3 = new Web3(provider)

const { interface, bytecode } = require('../compile.js')

let accounts
let lottery

beforeEach( async () => {
    accounts = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
        data: `0x${bytecode}`
    })
    .send({
       from: accounts[0],
       gas: '1000000'
    })
})

describe('Lottery Contract', () => {
    it('should deploy', async () => {
        assert.ok(lottery.options.address)
    })

    it('should allow player to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.5', 'ether')
        })

        let players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0])
    })


    it('should allow multiple players to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.5', 'ether')
        })

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.5', 'ether')
        })

        let players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(2, players.length)
    })
})