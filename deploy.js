const HDWalletProvider  = require('truffle-hdwallet-provider')
const Web3              = require('web3')

const { interface, bytecode } = require('./compile')

const provider = new HDWalletProvider(
    'soccer dizzy fabric bubble bulk tube once grain symptom mammal space knee',
    'https://rinkeby.infura.io/jjgKScNhZpUo4uMrlrew'
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy with funds from account: ', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x' + bytecode})
    .send({ gas: '1000000', from: accounts[0]})

    console.log(result.options.address)
}

deploy()