import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import jwt_decode from 'jwt-decode';
import Menu from '../../components/menu';
import Pusher from 'pusher-js';

import './styles.css';


export default function Profile() {
  const [orders, setOrders] = useState([]);  
  const o = useRef([]);
  const [pusher, setPusher] = useState();

  const history = useHistory();

  const token = localStorage.getItem('token');
  const session = jwt_decode(token);

  const [filtro] = useState([
    {
      id: 1,
      label: 'Nome',
      value: 'nome'
    },
    {
      id: 2,
      label: 'Localização',
      value: 'localizacao'
    }
  ]);
  

  useEffect(() => {
    api.get('pedidos',{
      headers: {
        Authorization: token
      }
    }).then(response => {
      setOrders(response.data);
      o.current = response.data;
    })

    const pusherInstance = new Pusher('81dfc3beb94ac0494c83', {
      cluster: 'sa1'
    });

    setPusher(pusherInstance);
  }, []);

  useEffect(() => {
    if(pusher){
      var channel = pusher.subscribe('smokemeat-chanel');
      channel.bind('criacao-pedido', function(data) {
        api.get('pedidos',{
          headers: {
            Authorization: token
          }
        }).then(response => {
          setOrders(response.data);
        })
      });      
    }
    return;
}, [pusher])

  async function handleSearch(e){
      var option = document.getElementById("filtro").value;
      if (option === 'nome'){
        var filtered = o.current.filter((item) => {
          return item.nome.toLowerCase().indexOf(e.toLowerCase()) >= 0;
          });
        setOrders(filtered);
      } else if (option === 'localizacao'){
        var filtered = o.current.filter((item) => {
          return item.localizacao.toLowerCase().indexOf(e.toLowerCase()) >= 0;
          });
        setOrders(filtered);
      } 
      
  }

  function handleLogout() {
    localStorage.clear();

    history.push('/');
  }

  return (
    
    <div>
    <Menu />
    <div className="container">
      <header className="row py-3">
        <div className="col-9">
          <h1>Pedidos</h1>
        </div>
      </header>
      <div className='row'>
        <div className='col-9'>
          <input
            className="form-control"
            placeholder="Pesquise o pedido"
            onKeyUp={e => handleSearch(e.target.value)}
          />
        </div>
        <div className='col-3'>
          <select  id='filtro' className="form-select">
              {filtro.map((filtro) => (
                <option key={filtro.id} value={filtro.value}>{filtro.label}</option>
              ))}
          </select>
        </div>
      </div>

      <table className="table table-secondary table-striped table-bordered table-hover text-center">
          <tbody>
          <tr>
            <td>ID</td>
            <td>Nome</td>
            <td>Endereço</td>            
            <td>Pagamento</td>
            <td></td>
          </tr>
          {orders.map(orders => (
            <tr key={orders.id}>
              <td>{orders.id}</td>
              <td>{orders.nome}</td>
              <td>{orders.localizacao}</td>
              <td>{orders.pagamento}</td>
              <td>
                <a data-bs-toggle="tooltip" data-bs-placement="bottom" title={orders.status}
                type="button" href={`/pedido-produto/${orders.id}`}  className="btn btn-danger position-relative">
                  Ver
                  <span className="position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle" 
                  style={{backgroundColor: orders.cor}}>
                  </span>
                </a>
              </td>
            </tr>
          ))}
          </tbody>
      </table>
    </div>
  </div>
  );
}