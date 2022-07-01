import React from 'react';
import logoImg from '../assets/logo.svg';    
import 'bootstrap/dist/css/bootstrap.min.css';

function Menu(){

    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
            
            <img className="navbar-brand" style={{height: '60px'}} src={logoImg} alt="Smoke Meat House" />
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a href="/pedidos" className="nav-link">Pedidos <span className="sr-only"></span></a>
                </li>
                <li className="nav-item">
                    <a href="/produtos" className="nav-link">Produtos <span className="sr-only"></span></a>
                </li>      
                <li className="nav-item">
                    <a href="/frete" className="nav-link">Frete <span className="sr-only"></span></a>                    
                </li>
                </ul>   
            </div>
            </nav>
        </div>
    )
}

export default Menu;