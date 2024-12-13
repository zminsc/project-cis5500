import {Link, NavbarBrand, NavbarContent, NavbarItem, Navbar} from "@nextui-org/react";
import logo from "../assets/logo.svg";
import {useLocation} from "react-router-dom";

export default function CustomNavbar() {
    const location = useLocation();

    return (
        <Navbar shouldHideOnScroll>
            <NavbarBrand className={"gap-2"}>
                <img src={logo} alt="logo" />
                <Link className={"font-bold text-customGreen"} href={"#"}>Recipedia</Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                <NavbarItem isActive={location.pathname === "/"}>
                    <Link color="foreground" href="/">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/recipes"}>
                    <Link color={"foreground"} href="/recipes">
                        Recipes
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/about"}>
                    <Link color="foreground" href="/about">
                        About Us
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end"/>
        </Navbar>
    );
}