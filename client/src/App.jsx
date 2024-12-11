import { useState } from 'react'
import './App.css'
import {AvatarIcon, Button, Link, LinkIcon, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import logo from "./assets/logo.svg"
import search from "./assets/search.svg"
import HomePage from "./pages/home.jsx";
import Container from "./components/Container.jsx";

function App() {
  const [activePage, setActivePage] = useState(0);

  return (
    <Container>
       <Navbar shouldHideOnScroll>
           <NavbarBrand className={"gap-2"}>
               <img src={logo} alt="logo" />
               <Link className={"font-bold text-customGreen"} href={"#"}>Recipedia</Link>
           </NavbarBrand>
           <NavbarContent className="hidden sm:flex gap-10" justify="center">
               <NavbarItem isActive={activePage === 0}>
                   <Link color="foreground" href="#" onPress={() => setActivePage(0)}>
                       Home
                   </Link>
               </NavbarItem>
               <NavbarItem isActive={activePage === 1}>
                   <Link color={"foreground"} href="#" onPress={() => setActivePage(1)}>
                       Recipes
                   </Link>
               </NavbarItem>
               <NavbarItem isActive={activePage === 2}>
                   <Link color="foreground" href="#" onPress={() => setActivePage(2)}>
                       Community
                   </Link>
               </NavbarItem>
               <NavbarItem isActive={activePage === 3}>
                   <Link color="foreground" href="#" onPress={() => setActivePage(3)}>
                       About Us
                   </Link>
               </NavbarItem>
           </NavbarContent>
           <NavbarContent justify="end"/>
        </Navbar>
        <div className="py-5">
            <HomePage />
        </div>
    </Container>
  )
}

export default App
