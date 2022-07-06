import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Login from './pages/Login';
import NewMenu from './pages/NewMenu';
import EditMenu from './pages/EditMenu';
import Items from './pages/Items';
import Checkout from './pages/Checkout';
import Shipping from './pages/Shipping';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>

        <Route path="/pedidos" component={Orders} />
        <Route path="/pedido-produto/:id" component={Items} />

        
        <Route path="/" exact component={Menu} />
        <Route path="/checkout/:id" component={Checkout} />

        
        <Route path="/frete" component={Shipping} />
        
        <Route path="/login" component={Login} />
        <Route path="/produtos" component={Products} />
        <Route path="/produto/editar/:id" component={EditMenu} />
        <Route path="/produto/novo"  component={NewMenu} />

      </Switch>
    </BrowserRouter>
  );
}