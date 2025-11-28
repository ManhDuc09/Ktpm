import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
            navigate(`/users/${user.id}`, { replace: true });
        }
    }, [navigate]);

    return children;
};

export default RedirectIfLoggedIn;
