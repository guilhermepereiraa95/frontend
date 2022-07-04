import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import jwt from 'jsonwebtoken';
import { ThreeDots } from  'react-loader-spinner';
import *  as Yup from 'yup';
import { Formik, useFormik } from 'formik';


import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';
import heroesImg from '../../assets/heroes.png';

const ValidationSchema = Yup.object().shape({
  login: Yup.string().required('Campo obrigatório'),
  password: Yup.string().required('Campo obrigatório')
})


export default function Login() {

  const { handleChange, submitForm, values, validateForm, errors } = useFormik({
    initialValues: {
      login: '',
      password: ''
    },
    validationSchema: ValidationSchema,
    onSubmit: values => {
      handleLogin(values)
    }
  })
  
  const [loader, setLoader] = useState(false);

  const history = useHistory();

  async function validar() {
    validateForm().then(erros => {
      if(Object.keys(erros).length){
        alert(JSON.stringify(erros))
      } else {
        submitForm();
      }
    })
  }

  async function handleLogin(values) {
    setLoader(true);

    try {
    
      const response = await api.post('session',
      {
        login: values.login,
        password: values.password
      });

      if(response.data.token){
        let t = jwt.decode(response.data.token);
        localStorage.setItem('token', response.data.token);
      }

      history.push('/pedidos');
    } catch (err) {
      alert('Falha no login, tente novamente.');
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Smoke Meat House"/>

        <div className='form-group'>
          <h1>Faça seu logon</h1>
          <input 
            className="form-control"
            placeholder="Seu login"
            name="login"
            value={values.login}
            // onChange={e => setLogin(e.target.value)}
            onChange={handleChange}
          />

          {errors.login && <p className="text-danger">{errors.login}</p>}
          
          <input 
            type="password"
            className="form-control mt-3"
            placeholder="Sua senha"
            name="password"
            value={values.password}
            // onChange={e => setPassword(e.target.value)}
            onChange={handleChange}
          /> 

          {errors.password && <p className="text-danger">{errors.password}</p>}
          <button onClick={() => validar()} className="button d-flex justify-content-center" type="submit">
          {!loader && 'Entrar'}  
            {loader && (<ThreeDots
              height="50px"
              width="50px"
              color="white"
              ariaLabel="loading"
            />)}    
          </button>

          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#E02041" />
            Não tenho cadastro
          </Link>
        </div>
      </section>

      <img src={heroesImg} alt="People" />
    </div>
  );
}
