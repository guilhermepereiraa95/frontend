import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';
import {usePlacesWidget} from 'react-google-autocomplete';
import { ThreeDots } from  'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Menu() {
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => setLocalizacao(place.formatted_address),
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "br" },
    },
  })
  
  const [loader, setLoader] = useState(false);
  const [nome, setNome] = useState([]);
  const [localizacao, setLocalizacao] = useState([]);
  const [pagamento, setPagamento] = useState(["Débito"]);
  const [observacao, setObservacao] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [menu, setMenu] = useState({});
  const [tipos] = useState([
    {
      id: 1,
      label: 'Lanches',
      value: 'lanche'
    },
    {
      id: 2,
      label: 'Bebidas',
      value: 'bebidas'
    },
    {
      id: 3,
      label: 'Porções',
      value: 'porcoes'
    },
    {
      id: 4,
      label: 'Sobremesas',
      value: 'sobremesas'
    }
  ]);

  const [pagamentos] = useState([
    {
      id: 1,
      label: 'Débito',
      value: 'debito'
    },
    {
      id: 2,
      label: 'Crédito',
      value: 'credito'
    },
    {
      id: 3,
      label: 'Dinheiro',
      value: 'dinheiro'
    }
  ]);

  useEffect(() => {
    api.get('produtos').then(response => {
      const lanches = response.data.lanches.map((item) => ({ ...item, qtd: 0 }));
      const bebidas = response.data.bebidas.map((item) => ({ ...item, qtd: 0 }));
      const porcoes = response.data.porcoes.map((item) => ({ ...item, qtd: 0 }));
      const sobremesas = response.data.sobremesas.map((item) => ({ ...item, qtd: 0 }));
      setMenu({ lanches, bebidas, porcoes, sobremesas });
    });

  }, [])

  const history = useHistory();

  async function handleChange(e) {
    document.getElementById(e).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function getSelectedItem(id, key) {
    return menu[key].find((menu) => {
      return menu.id === id;
    });
  }

  function getMenuByIndex(id, key) {
    return menu[key].findIndex((item) => item.id === id)
  }

  async function addOrRemoveOrder(id, key, operation = 'add') {

    let selectedItem = await getSelectedItem(id, key);

    const foundItem = pedido.find((pedido) => {
      return pedido.id === selectedItem.id
    });

    if (foundItem) {
      const index = getMenuByIndex(foundItem.id, key);
      const newMenu = { ...menu };
      const found = newMenu[key][index];
      found.qtd += operation === 'add' ? 1 : -1;
      setMenu(newMenu);

      if (operation === 'remove' && found.qtd === 0) {
        const novoPedido = pedido.filter(p => {
          return p.id !== found.id;
        });
        setPedido([...novoPedido])

      } else {
        setPedido(pedido.map((p) => {
          return p.id === found.id ? found : p;
        }))
      }

    } else {
      const newMenu = { ...menu };
      newMenu[key][getMenuByIndex(id, key)].qtd++;
      setMenu(newMenu);
      setPedido([...pedido, newMenu[key][getMenuByIndex(id, key)]]);
    }

  }

  useEffect(() => console.log('meus pedidos', pedido), [pedido])


  async function handleRegister(e) {
    e.preventDefault();
    
    setLoader(true);

    const data = {
      nome,
      localizacao,
      pagamento,
      pedido,
      observacao
    };

    try {
      api.post('pedidos', data)
      .then(response => {  
        
        toast.success('Sucesso!');
        if(response.data.id){
          history.push(`/checkout/${response.data.id}`);
        }
      })
      .finally(() => {
        setLoader(false);
      });

    } catch (err) {
      toast.error('Erro no cadastro, tente novamente.', { type: 'error' });
    }
  }  

  return (
    <div className="register-container">
      <Toaster></Toaster>
      <div className="content">
        <section>
          <img src={logoImg} alt="Smoke Meat House" />
          <p>Peça agora lanches artesanais e porções com carnes defumadas da melhor qualidade!</p>
        </section>

        <form onSubmit={handleRegister}>
          <input
            placeholder="Seu nome"            
            className="form-control mt-2"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />

          <input            
            ref={ref}
            className="form-control mt-2"
            type="localizacao"
            placeholder="Local"
            value={localizacao}
            onChange={e => setLocalizacao(e.target.value)}
          />

          <select className="form-select form-select-lg my-3" onChange={e => handleChange(e.target.value)}>
            {tipos.map((tipos) => (
              <option key={tipos.id} value={tipos.value}>{tipos.label}</option>
            ))}
          </select>

          <div className="menu-items">
            {Object.keys(menu).map(key => (
              <div key={key}>
                <h3 id={key}>{key}</h3>
                {menu[key].map((comida) => {
                  return (
                    <section key={comida.id}>
                      <div className="card-menu">
                        <div className="card-right">
                          <strong>{comida.title}</strong>

                          <p>{comida.description}</p>
                        </div>
                        <div className="card-left noselect">
                          <p> 
                            {comida.qtd > 0 && 
                            (Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(comida.value * comida.qtd))}
                            {comida.qtd === 0 && 
                            (Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(comida.value))}                          
                          </p>
                          <div className="btn-group" role="group">
                            <a type="button"
                              onClick={e => comida.qtd === 0 ? null : addOrRemoveOrder(comida.id, key, 'remove')}
                              className="btn btn-danger">
                              <FiMinus size={20} color="#fff"></FiMinus>
                            </a>
                            <span className="input-group-text">{comida.qtd}</span>
                            <a type="button"
                            onClick={e => addOrRemoveOrder(comida.id, key)}
                            className="btn btn-danger">
                            <FiPlus size={20} color="#fff"></FiPlus></a>
                          </div>
                          
                        </div>
                      </div>
                    </section>
                  )
                }
                )}
              </div>
            ))}
          </div>

          <select className="form-select form-select-lg my-3" onChange={e => setPagamento(e.target.value)}>
            {pagamentos.map((pagamentos) => (
              <option key={pagamentos.id} value={pagamentos.value}>{pagamentos.label}</option>
            ))}
          </select>

          <input
            placeholder="Observações"
            className="form-control mt-2"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
          />

          <button className="button d-flex justify-content-center" type="submit">
            {!loader && 'Realizar pedido'}  
            {loader && 
            (<ThreeDots
              height="50px"
              width="50px"
              color="white"
              ariaLabel="loading"
            />)}          
            </button>
        </form>
      </div>
    </div>
  );
}