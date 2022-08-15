export const isTimeAvailable = (time) => {
    return new Date().getTime() < new Date(time * 1000).getTime();
};
