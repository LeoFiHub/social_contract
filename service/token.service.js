const Contract = require('web3-eth-contract');
const {dgtCfg, contractParams} = require('../config/vars')
const {getNonce} = require('./priceFeed_service')

const tokenAbi = require("../abi/tokenAbi.json");
const {provider} = require('../utils/provider')

Contract.setProvider(provider)

exports.setAdminToken = async(req) =>{
    let contract = new Contract(tokenAbi, dgtCfg.dgtTokenAddress)
    let nonce = await getNonce(dgtCfg.contractOwnerAddr)
    try {
        let receipt = await contract.methods.addWhiteListAddress(req.admin).send(Object.assign(contractParams, {nonce: nonce}))
        return receipt
    } catch (err) {
        console.log("Error set admin: ", err.message)
        return err.message
    }
}