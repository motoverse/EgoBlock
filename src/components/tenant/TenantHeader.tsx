import React from 'react'
import {useAuth} from '../../contexts/AuthContext';
import logoSrc from '../../assets/egoblock_white.svg'

import { Container, Navbar } from "react-bootstrap";



export default function TenantHeader() {
    const {user, logout} = useAuth();

    return (

        <Navbar bg="dark" variant="dark" expand="lg" className="p-3 mb-5">
            <Container>
                <Navbar.Brand >
                    <img src={logoSrc} alt="egoblock" className="d-inline-block align-text-top logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="navbar-nav mb-2 mb-lg-0 justify-content-end w-100">
                        <Navbar.Text className="text-light">
                            {user.displayName}
                        </Navbar.Text>
                        <div className="d-flex ms-4" >
                            {user.uid && <button className='btn btn-outline-light btn-sm' onClick={logout}>Logout</button>}
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
