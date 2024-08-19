const cronPriceFeed = require('node-cron');
const { publishSignal } = require('../service/vaultSignal.service')

cronPriceFeed.schedule('*/10 * * * * *', async function() {
    let signal = {
        "symbol": "SUI_signal",
        "token_adr": "0x9118c6781bc32772731e4e4777698d4c97cdf2a6",
        "amount":2411,
        "provider":"pqd_provider",
        "vault_adr": "0xF7FCCFc3DE0789362B5B998782992a27b12040c8",
        "created_at": 2024,
        "end_at": 2411,
        "signal_type": "keep holding",
        "market_trend": 1
    }

    console.log("running a signal generator cron every 10 second"); 
    for(let i = 0; i < 2; i++){
        let resp = await publishSignal(signal);
        if(resp.transactionHash == undefined){
            console.log("Error generating signal: ", resp)
        }else{
            console.log("Resp generating signal: ", resp.transactionHash);    
        }
    } 
})