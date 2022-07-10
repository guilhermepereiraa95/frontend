import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Menu from '../../components/menu';
import toast, {Toaster} from 'react-hot-toast';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function NewMenu() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lanche');
  const [value, setValue] = useState('');
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
  ]
  );

  const history = useHistory();

  const token = localStorage.getItem('token');

  async function handleNewMenu(e) {
    e.preventDefault();

    const data = {
      title,
      type,
      description,
      value,
      token
    };

    try {

      await api.post('produtos', data, {
        headers: {
          Authorization: token,
        }
      }).catch((err) => {
        toast.error(err.message)
      });

      history.push('/produtos');
    } catch (err) {
      alert('Erro ao cadastrar caso, tente novamente.');
    }
  }

  async function handleChange(e) {
    setType(e);
  }

  return (
    
    <div>
    <Menu />
    <div className="new-menu-container">
      <Toaster></Toaster>
      <div className="content">
        <section>
          <img src={logoImg} alt="Smoke Meat House"/>

          <h1>Cadastrar novo item no cardápio</h1>

          <Link className="back-link" to="/produtos">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar
          </Link>
        </section>

        <form onSubmit={handleNewMenu}>
          <input 
            placeholder="Nome do item"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea 
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <select className="form-select form-select-lg my-3" onChange={e => handleChange(e.target.value)}>
            {tipos.map((tipos) => (
              <option key={tipos.id} value={tipos.value}>{tipos.label}</option>
            ))}
          </select>

          <input 
            placeholder="Valor em reais"
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
    </div>
  )
}