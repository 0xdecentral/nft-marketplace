export const isAddressSame = (addr1, addr2) => {
    if (!addr1 || !addr2) return false;

    return addr1.toLowerCase() === addr2.toLowerCase();
};

export const convertToUnixTimestamp = (dateStr) => {
    const date = new Date(dateStr);

    return Math.floor(date.getTime() / 1000);
};

export const currentUnixTimestamp = () => {
    const date = new Date();

    return Math.floor(date.getTime() / 1000);
};
