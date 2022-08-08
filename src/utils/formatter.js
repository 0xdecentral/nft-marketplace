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

export const formatTimeDifference = (time) => {
    const date = new Date(time * 1000);
    const now = new Date();

    const seconds = (now.getTime() - date.getTime()) / 1000;
    const minutes = Math.floor((seconds % 3600) / 60);
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const days = Math.floor(seconds / (3600 * 24));

    let timeString = "";

    if (days) timeString = days + "d ";
    if (hours) timeString += hours + "h ";
    if (!days && !hours && minutes) timeString = minutes + "m ";

    return timeString + "ago";
};

export const formatDateString = (time) => {
    const date = new Date(time * 1000);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return (
        date.getMonth() +
        1 +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        strTime
    );
};
