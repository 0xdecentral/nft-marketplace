import TokenAmount from "../lib/TokenAmount";

export const getStartingPrice = (orders) => {
    const { startingPrice, payToken } = orders[orders.length - 1];

    //todo
    const decimals = 18;

    const tokenAmount = new TokenAmount(startingPrice, decimals);

    return tokenAmount.fixed();
};

export const formatTokenAmount = (amount, isFixed = true) => {
    //todo
    const decimals = 18;

    const tokenAmount = new TokenAmount(amount, decimals, isFixed);

    return isFixed ? tokenAmount.fixed() : tokenAmount.toWei().toString();
};
