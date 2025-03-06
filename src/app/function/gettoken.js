const gettoken = async () => {
    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
        window.location.href = "/login"; // Redirect to login page
        return null;
    }
    const { token } = await JSON.parse(storedData);
    return token;
}
export default gettoken;
