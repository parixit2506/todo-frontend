import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodosEdit from "./TodosEdit.js"
import Header from "./common/Header.js";
import Footer from "./common/Footer.js";


export default function Edit() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    });

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <TodosEdit />            
            <Footer />
        </div>
    )
}