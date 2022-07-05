import React, { useEffect, useState, useRef, useContext } from 'react';
import Pusher from 'pusher-js';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg';
import { useParams } from 'react-router-dom';
import PusherContext from '../../context/PusherContext';

export default function Checkout() {
  const [items, setItems] = useState([]);  
  const {pedido, setPedido} = useContext(PusherContext);
  const [total, setTotal] = useState();
  const [pusher, setPusher] = useState();

  const params = useParams();

  
  useEffect(() => {
      if (params.id > 0) {
        api.get(`pedido-produto/${params.id}`).then(response => {
          setItems(response.data.pedido);
          setTotal(response.data.total);
        })

        api.get(`pedidos/${params.id}`).then(res => {
          setPedido(res.data);
        })

        const pusherInstance = new Pusher('81dfc3beb94ac0494c83', {
          cluster: 'sa1'
        });

        setPusher(pusherInstance);
      }   
  }, []);

      useEffect(() => {
          if(pusher){
            var channel = pusher.subscribe('smokemeat-chanel');
            channel.bind('confirmacao-pedido', function(data) {
              
              setPedido(data)
              
            });      
          }
          return;
      }, [pusher])

  return (
    <div className="checkout-container">
      
      <div className='row'>
      <div className="col- d-flex justify-content-center">
        <img src={logoImg} alt="Smoke Meat House"/>
      </div>
        <div className="col-6">
          
          <p className='h2'>Acompanhamento do pedido</p>
          <p className='h3'>Obrigado pela preferência, {pedido.nome}!</p>
          
          <span>Local: {pedido.localizacao}</span>  
        </div>
        <div className="col-6">
          <section className='card card-body'>  
          <div class="progress">
            {
              pedido.status === "Pedido aguardando confirmação"
              && (
                <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" 
                style={{width: '15%'}}></div>
              )
            }
            {
              pedido.status === "Pedido sendo preparado!"
              && (
                <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" 
                style={{width: '40%'}}></div>
              )
            }
            {
              pedido.status === "Saiu para entrega"
              && (
                <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" 
                style={{width: '60%'}}></div>
              )
            }
            
            
            
          </div>
          <div>{pedido.status}</div>    
          <ul>
            {items.map(items => (
              <li key={items.id}>
                <strong><p>{items.title} <span style={{color:'#a00'}}>x{items.qtd}</span></p></strong>
                <strong><p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(items.value)}</p></strong>
              </li>
            ))}
            <li><strong> <p>Total {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p></strong>  </li>
          </ul>
          
          
          </section>
        </div>
      </div>
    </div>
  );
}