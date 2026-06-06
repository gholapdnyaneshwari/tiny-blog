const getCurrentUser = () => {
    const user = localStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
};

export { getCurrentUser };