import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiEdit2 } from 'react-icons/fi';
import jwt_decode from 'jwt-decode';
import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';
import Menu from '../../components/menu';

export default function Products() {
  const [menu, setMenu] = useState([]);
  const m = useRef([]);

  const history = useHistory();

  const token = localStorage.getItem('token');
  const session = jwt_decode(token);

  const [filtro] = useState([
    {
      id: 1,
      label: 'Título',
      value: 'title'
    },
    {
      id: 2,
      label: 'Descrição',
      value: 'description'
    },
    {
      id: 3,
      label: 'Tipo',
      value: 'type'
    }
  ]);

  useState(() => {
    api.get('produtos', {
      headers: {
        Authorization: token,
      }
    }).then(response => {
      setMenu(response.data.produtos)
      m.current = response.data.produtos;
    })
  });

  async function handleEditMenu(id) {
    try {
    
    await api.get(`produtos/${id}`, {
      headers: {
        Authorization: token,
      }
    }).then(() => {
      
      setMenu(menu.filter(menu => menu.id !== id));
        
      history.push(`produto/editar/${id}`);
    });

    
    } catch (err) {
      alert('Erro ao item caso, tente novamente.');
    }
  }


  async function handleSearch(e){
    var option = document.getElementById("filtro").value;
      if (option === 'title'){
        var filtered = m.current.filter((item) => {
          return item.title.toLowerCase().indexOf(e.toLowerCase()) >= 0;
          });
        setMenu(filtered);
      } else if (option === 'description') {
        var filtered = m.current.filter((item) => {
          return item.description.toLowerCase().indexOf(e.toLowerCase()) >= 0;
          });
        setMenu(filtered);
      } else if (option === 'type') {
        var filtered = m.current.filter((item) => {
          return item.type.toLowerCase().indexOf(e.toLowerCase()) >= 0;
          });
        setMenu(filtered);
      }
  }

  async function handleDeleteMenu(id) {
    try {
      await api.delete(`produtos/${id}`, {
        headers: {
          Authorization: token
        }
      });

      setMenu(menu.filter(menu => menu.id !== id));
    } catch (err) {
      alert('Erro ao item caso, tente novamente.');
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
          <h1>Produtos</h1>
        </div>
        <div className="col-3">
          <Link className="btn btn-lg btn-danger" to="/produto/novo">Cadastrar novo item</Link>
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
            <td>Título</td>
            <td>Descrição</td>            
            <td>Tipo</td>
            <td>Valor</td>
            <td></td>
            <td></td>
          </tr>
          {menu.map(menu => (
            <tr key={menu.id}>
              <td>{menu.id}</td>
              <td>{menu.title}</td>
              <td>{menu.description}</td>
              <td>{menu.type}</td>
              <td>
              {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(menu.value)}
              </td>
              <td>
              <button onClick={() => handleEditMenu(menu.id)} type="button" className="btn btn-warning">
              <FiEdit2 size={20} color="#FFF" />
              </button>
              </td>
              <td>
              <button onClick={() => handleDeleteMenu(menu.id)} type="button" className="btn btn-danger">
              <FiTrash2 size={20} color="#FFF" />
              </button>
              </td>
            </tr>
          ))}
          </tbody>
      </table>
      
    </div>
    </div>
  );
}