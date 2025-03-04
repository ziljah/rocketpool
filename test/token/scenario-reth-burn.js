import { RocketTokenRETH } from '../_utils/artifacts';


// Burn rETH for ETH
export async function burnReth(amount, txOptions) {

    // Load contracts
    const rocketTokenRETH = await RocketTokenRETH.deployed();

    // Get parameters
    let rethExchangeRate = await rocketTokenRETH.getExchangeRate.call();

    // Get balances
    function getBalances() {
        return Promise.all([
            rocketTokenRETH.totalSupply.call(),
            rocketTokenRETH.balanceOf.call(txOptions.from),
            web3.eth.getBalance(txOptions.from).then(value => web3.utils.toBN(value)),
        ]).then(
            ([tokenSupply, userTokenBalance, userEthBalance]) =>
            ({tokenSupply, userTokenBalance, userEthBalance})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    txOptions.gasPrice = gasPrice;

    // Burn tokens & get tx fee
    let txReceipt = await rocketTokenRETH.burn(amount, txOptions);
    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.receipt.gasUsed));

    // Get updated balances
    let balances2 = await getBalances();

    // Calculate values
    let burnAmount = web3.utils.toBN(amount);
    let expectedEthTransferred = await rocketTokenRETH.getEthValue(burnAmount);

    // Check balances
    assert(balances2.tokenSupply.eq(balances1.tokenSupply.sub(burnAmount)), 'Incorrect updated token supply');
    assert(balances2.userTokenBalance.eq(balances1.userTokenBalance.sub(burnAmount)), 'Incorrect updated user token balance');
    assert(balances2.userEthBalance.eq(balances1.userEthBalance.add(expectedEthTransferred).sub(txFee)), 'Incorrect updated user ETH balance');

}

