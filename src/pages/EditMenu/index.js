import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';
import { useParams } from 'react-router-dom';

export default function EditMenu() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
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

  const params = useParams();  

  useState(() => {
    try{
      if(params.id > 0){
        api.get(`produtos/${params.id}`, {
          headers: {
            Authorization: token,
          }
        }).then(response => {  
          setTitle(response.data[0].title)
          setDescription(response.data[0].description)
          setValue(response.data[0].value)
          setType(response.data[0].type)
        });
      }
    } catch (err) {
      alert('Erro na consulta caso, tente novamente.');
    }
   
  });

  async function handleChange(e) {
    setType(e);
  }

  async function handleEditMenu(e) {
    e.preventDefault();

    const data = {
      title,
      type,
      description,
      value
    };

    try {
      await api.put(`produtos/${params.id}`, data, {
        headers: {
          Authorization: token,
        }
      });

      history.push('/produtos');
    } catch (err) {
      alert('Erro ao cadastrar caso, tente novamente.');
    }
  }

  return (
    <div className="edit-menu-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Smoke Meat"/>

          <h1>Editar item {title} do cardápio</h1>

          <Link className="back-link" to="/produtos">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar
          </Link>
        </section>

        <form onSubmit={handleEditMenu}>
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

          <select className="form-select form-select-lg my-3" onChange={e => handleChange(e.target.value)} value={type}>
            {tipos.map((tipos) => (
              <option key={tipos.id} value={tipos.value}>{tipos.label}</option>
            ))}
          </select>

          <input 
            placeholder="Valor em reais"
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          <button className="button" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  )
}