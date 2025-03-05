const gettoken = async () => {
    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
        router.push("/signup");
        return;
    }
    const { token } = await JSON.parse(storedData);
    return token;
}
export default gettoken;
