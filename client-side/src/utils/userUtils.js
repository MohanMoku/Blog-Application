export const normalizeUserData = (data) => {
    // If data is already in the correct format, return it
    if (!data.user && data._id) {
        return data;
    }
    // If data has a nested user object, return the user object
    if (data.user) {
        return data.user;
    }
    // If neither case matches, return the original data
    return data;
};