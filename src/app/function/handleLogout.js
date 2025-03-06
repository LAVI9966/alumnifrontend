const handleLogout = () => {
    localStorage.removeItem("alumni");
    window.location.href = "/login"; // Redirect to login page
};
export default handleLogout;
