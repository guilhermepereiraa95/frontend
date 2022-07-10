import React, { useEffect, useState, useRef, useContext } from 'react';
import Pusher from 'pusher-js';
import { FiActivity, FiClock, FiHome, FiPlayCircle, FiZap } from 'react-icons/fi'
import api from '../../services/api';
import './styles.css';
import toast, { Toaster } from 'react-hot-toast';

import logoImg from '../../assets/logo.svg';
import { useParams } from 'react-router-dom';
import PusherContext from '../../context/PusherContext';
import { ThreeDots } from 'react-loader-spinner';

export default function Checkout() {
  const [items, setItems] = useState([]);
  const { pedido, setPedido } = useContext(PusherContext);
  const [total, setTotal] = useState();
  const [pusher, setPusher] = useState();
  const [loader, setLoader] = useState(true);
  const params = useParams();


  useEffect(() => {
    if (params.id > 0) {
      api.get(`pedido-produto/${params.id}`).then(response => {
        setItems(response.data);
        let total = 0;
        response.data.map(items => {
          total = + (total + items.value) * items.qtd;
        })
        setTotal(total)
      }).then(
        api.get(`pedidos/${params.id}`)
        .finally(() => setLoader(false))
        .then(res => {
          setPedido(res.data);
        }).catch((err) => {
          toast.error(err.message)
        })
      ).catch((err) => {
        toast.error(err.message)
      });



      const pusherInstance = new Pusher('81dfc3beb94ac0494c83', {
        cluster: 'sa1'
      });

      setPusher(pusherInstance);
    }

  }, []);

  useEffect(() => {

    if (pusher) {
      var channel = pusher.subscribe('smokemeat-chanel');
      channel.bind('confirmacao-pedido', function (data) {
        setPedido(data)
      });
    }
    return;
  }, [pusher])

  return (
    <div className="checkout-container">
      <Toaster></Toaster>
      {
        loader && (<ThreeDots
              height="50px"
              width="50px"
              color="red"
              ariaLabel="loading"
            />)
      }
      {!loader &&
        (<div className='row'>
          <div className="col-12 d-flex justify-content-center">
            <img src={logoImg} alt="Smoke Meat House" />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <section className='card card-body'>
              <p className='h2 text-center'>Acompanhamento do pedido {pedido.id} - {pedido.data}</p>
              <p className='h3 text-center'>Obrigado pela preferência, {pedido.nome}!</p>
              <p>Local: {pedido.localizacao}</p>
              <p className='d-flex align-items-center'>
                <FiClock></FiClock>&nbsp;{pedido.hora}
              </p>
              {pedido.status === "Pedido sendo preparado!" && (
                <p className='d-flex align-items-center'><FiPlayCircle></FiPlayCircle>&nbsp;{pedido.hora}</p>
              )}
              {pedido.status === "Saiu para entrega" && (
                <p className='d-flex align-items-center'><FiHome></FiHome>&nbsp;{pedido.hora}</p>
              )}
              <div className="progress">
                {
                  pedido.status === "Pedido aguardando confirmação"
                  && (
                    <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar"
                      style={{ width: '15%' }}></div>
                  )
                }
                {
                  pedido.status === "Pedido sendo preparado!"
                  && (
                    <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar"
                      style={{ width: '40%' }}></div>
                  )
                }
                {
                  pedido.status === "Saiu para entrega"
                  && (
                    <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar"
                      style={{ width: '60%' }}></div>
                  )
                }
              </div>
              <div>{pedido.status}</div>
              <ul>
                {items.map(items => (
                  <li key={items.id}>
                    <strong><p>{items.title} <span style={{ color: '#a00' }}>x{items.qtd}</span></p></strong>
                    <strong><p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(items.value)}</p></strong>
                  </li>
                ))}
                <li><strong> <p>Total {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p></strong>  </li>
              </ul>
            </section>

          </div>
        </div>)
      }
    </div>
  );
}