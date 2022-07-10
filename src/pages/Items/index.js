import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';

import toast, { Toaster } from 'react-hot-toast';

import api from '../../services/api';

import './styles.css';
import PusherContext from '../../context/PusherContext';

import { useParams } from 'react-router-dom';
import Menu from '../../components/menu';

export default function Items() {
  const [items, setItems] = useState([]);  
  const {pedido, setPedido} = useContext(PusherContext); 
  const [total, setTotal] = useState({});

  const history = useHistory();

  const token = localStorage.getItem('token');
  // const session = jwt_decode(token)

  const params = useParams();

  useEffect(() => {
    if(params.id > 0){

        api.get(`pedido-produto/${params.id}`,{
          headers: {
            Authorization: token,
          }
        }).then(response => {
            setItems(response.data);
            let total = 0;
            response.data.map(items =>{
              total =+ (total + items.value) * items.qtd;
            })
            setTotal(total)
        }).catch((err) => {
          toast.error(err.message)
        });

        api.get(`pedidos/${params.id}`).then(res => {
          setPedido(res.data);    
        }).catch((err) => {
          toast.error(err.message)
        });
    }
  }, []);

  function handlePlay() {
    pedido.status = 'Pedido sendo preparado!';
    pedido.cor = '#0a0';
    api.put(`pedidos/${params.id}`, {
      pedido
    },{
      headers: {
        Authorization: token,
      }
    }).then(() => {
      toast.success('Pedido confirmado para o cliente!');
    }).catch((err) => {
      toast.error(err.message)
    });
  }

  return (
    <div>
    <Menu />
    <div className="profile-container">
      <Toaster></Toaster>
      <h1 className="text-center">Pedido {params.id}</h1>
      <header className="pb-1">
        
        <span>Local: {pedido.localizacao}</span>

        <button onClick={handlePlay} type="button">
          <FiPlay    size={18} color="#E02041" />
        </button>
      </header>


      <table className="table noselect table-hover text-center">
          <tbody>
          <tr>
            <td>Item</td>
            <td>Quantidade</td>
            <td>Valor</td>
          </tr>
          {items.map(items => (
            <tr key={items.id}>
              <td>{items.title}</td>
              <td>{items.qtd}</td>
              <td>
              {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(items.value * items.qtd)}
              </td>
            </tr>
          ))}
          </tbody>
      </table>
      <ul>
            <li>Observação: {pedido.observacao}</li>
            <li>Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</li>              
      </ul>
    </div>
    </div>
  );
}