import {Link, NavbarBrand, NavbarContent, NavbarItem, Navbar} from "@nextui-org/react";
import logo from "../assets/logo.svg";
import {useLocation, useNavigate} from "react-router-dom";

export default function CustomNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Navbar shouldHideOnScroll={true}>
            <NavbarBrand className={"gap-2"}>
                <img src={logo} alt="logo" />
                <Link className={"font-bold text-customGreen cursor-pointer"} onPress={() => navigate("/")}>Recipedia</Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                <NavbarItem isActive={location.pathname === "/"}>
                    <Link className={"cursor-pointer"} color="foreground" onPress={() => navigate("/")}>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/recipes"}>
                    <Link className={"cursor-pointer"} color={"foreground"} onPress={() => navigate("/recipes")}>
                        Recipes
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/about"}>
                    <Link className={"cursor-pointer"} color="foreground" onPress={() => navigate("/about")}>
                        About Us
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end"/>
        </Navbar>
    );
}