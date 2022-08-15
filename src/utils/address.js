export const formatAddress = (address) =>
    address
        ? address.substring(0, 4) +
          "..." +
          address.substring(address.length - 4)
        : "";

export const getESLink = (address) => `https://etherscan.io/address/${address}`;
