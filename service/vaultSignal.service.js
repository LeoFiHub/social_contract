const bluebird = require('bluebird'); // eslint-disable-line no-global-assign
const axios = require('axios');
const {dgtCfg, dgtPriceURL, vaultSignalParams} = require('../config/vars')
const redis = require("redis");
bluebird.promisifyAll(redis);
//smart contract info
const vaultSignalAbi = require("../abi/vaultSignalAbi.json");
const {adminProvider} = require('../utils/provider')

const Web3 = require('web3')
const web3 = new Web3(adminProvider)
let contract = new web3.eth.Contract(vaultSignalAbi, dgtCfg.dgtVaultSignalAddress);

exports.getNonce = async (address) => {
    let config = {
    method  : 'post',
    url     : dgtCfg.providerUrl,
    headers : { 'Content-Type': 'application/json' },
    data    : JSON.stringify({
        "jsonrpc" : "2.0",
        "method"  : "eth_getTransactionCount",
        "params"  : [ address, "latest" ],
        "id"      : 1
    })
    };

    let response = await axios(config);
    if (!response.data || !response.data.result) throw new Error(`Failed to get address ${address} nonce.`);
    return parseInt(response.data.result, 16);
}

exports.publishSignal = async (data) =>{
    let nonce = await this.getNonce(dgtCfg.dgtAdminAddress);

    //generate vault signal 
    try {
        let txResp = await contract.methods.publishSignal(
            data.symbol,
            data.token_adr,
            data.amount,
            data.provider,
            data.vault_adr,
            data.created_at,
            data.end_at,
            data.signal_type,
            data.market_trend
        ).send(Object.assign(vaultSignalParams))
        return txResp
    } catch (err) {
        return err.message
    }
}

exports.getSignal = async(req) =>{
    try {
        let signal = await contract.methods.getSignal(req).call();
        return signal
    } catch (err) {
        return err.message
    }
}