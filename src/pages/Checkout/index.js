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
  const [progress, setProgress] = useState('width: 50%');
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
      
      
      <header>
        
      <p className='h2'>Acompanhamento do pedido</p>
      <p className='h3'>Obrigado pela preferência, {pedido.nome}!</p>
      
      <span>Local: {pedido.localizacao}</span>  
      {/* <img src={logoImg} className= alt="Smoke Meat House" />  */}
      </header>
       
      <section className='card card-body'>  
      <div class="progress">
        <div class="progress-bar progress-bar-striped" role="progressbar" 
        aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
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
  );
}