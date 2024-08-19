const Contract = require('web3-eth-contract');
const bluebird = require('bluebird'); // eslint-disable-line no-global-assign
const HDWalletProvider = require("@truffle/hdwallet-provider");
const redis = require("redis");
const {dgtCfg} = require("../config/vars");
bluebird.promisifyAll(redis);
const {setAdminToken} = require('./token.service')
const Web3 = require('web3')
const web3 = new Web3(dgtCfg.providerUrl)


//contract config 
const {getNonce} = require('./priceFeed_service')
const gasPrice = '5000000000'
const maxErc20GasLimit = 500000
const challengeAbi = require("../abi/challengeAbi.json");
const assetAbi = require("../abi/assetAbi.json");

const provider = new HDWalletProvider({ 
    privateKeys: [dgtCfg.contractOwnerPriv], 
    providerOrUrl: dgtCfg.providerUrl,
    pollingInterval: 8000
});

const contractParams = {
    from    : dgtCfg.contractOwnerAddr,
    gasPrice: 25000000000,
    gasLimit: 8500000,
};

Contract.setProvider(provider)

exports.createChallenge = async (req)=>{
    let setAdmin = await setAdminToken({admin: dgtCfg.dgtChallengeAddress});
    console.log("Set admin tx: ", setAdmin.transactionHash)
    let contract = new Contract(challengeAbi, dgtCfg.dgtChallengeAddress);
    let nonce = await getNonce(dgtCfg.contractOwnerAddr);
    try {
        let receipt = await contract.methods.createChallenge(req.challengeId, req.amount).send(Object.assign(contractParams, {nonce: nonce}));
        return receipt;
    } catch (err) {
        return err.message
    }
}

exports.withDraw = async(req) =>{
    let contract = new Contract(assetAbi, dgtCfg.dgtChallengeAddress)
    let nonce = await getNonce(dgtCfg.contractOwnerAddr)
    try {
        let receipt = await contract.methods.withdrawChallenge(req.sender, req.amount).send(Object.assign(contractParams, {nonce: nonce}))
        return receipt
    } catch (err) {
        console.log("withdraw asset err: ", err.message)
        return err.message
    }
}

exports.createChallengeConfig = async(req) =>{
    let contract = new Contract(challengeAbi, dgtCfg.dgtChallengeAddress)
    let nonce = await getNonce(dgtCfg.contractOwnerAddr)
    try {
        let request = [
            req.configId,
            req.challengeId,
            req.duration,
            req.symbol,
            true,
            parseInt(Date.now()/1000),
            parseInt(Date.now()/1000),
            req.bidRate
        ]
        let receipt = await contract.methods.createChallengeConfig(request).send(Object.assign(contractParams, {nonce: nonce}))
        return receipt
    } catch (err) {
        return err.message
    }
}

exports.getChallengeById = async(req) =>{
    let contract = new Contract(challengeAbi, dgtCfg.dgtChallengeAddress)
    let nonce = await getNonce(dgtCfg.contractOwnerAddr)
    try {
        // let request = [
        //     req.configId,
        //     ,
        //     req.duration,
        //     req.symbol,
        //     true,
        //     parseInt(Date.now()/1000),
        //     parseInt(Date.now()/1000),
        //     req.bidRate
        // ]
        let receipt = await contract.methods.getChallengeById(req.challengeId).call()
        console.log("Challenge info: ", receipt)
        return receipt
    } catch (err) {
        return err.message
    }
}

exports.getAssetByAddress = async(req) =>{
    let contract = new Contract(assetAbi, req.assetAddress)
    let nonce = await getNonce(dgtCfg.contractOwnerAddr)
    try {
        let receipt = await contract.methods.getChallengeInfo().call()
        console.log("Asset info: ", receipt)
        return receipt
    } catch (err) {
        console.log("Error get asset: ", err.message)
        return err.message
    }
}