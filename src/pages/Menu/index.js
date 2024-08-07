import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { usePlacesWidget } from 'react-google-autocomplete';
import { ThreeDots } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';

import *  as Yup from 'yup';
import { Formik, useFormik } from 'formik';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg';

const ValidationSchema = Yup.object().shape({
  nome: Yup.string().required('Campo obrigatório'),
  localizacao: Yup.string().required('Campo obrigatório'),
  pagamento: Yup.string().required('Campo obrigatório'),
  observacao: Yup.string(),
})


export default function Menu() {
  const { handleChange, submitForm, values, validateForm, errors, setFieldValue } = useFormik({
    initialValues: {
      nome: '',
      localizacao: '',
      pagamento: '',
      observacao: ''
    },
    validationSchema: ValidationSchema,
    onSubmit: values => {
      handleSubmitForm(values)
    }
  })

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => { setFieldValue('localizacao', place.formatted_address) },
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "br" },
    },
  })

  const [loader, setLoader] = useState(true);
  // const [nome, setNome] = useState([]);
  const [total, setTotal] = useState([0]);
  // const [localizacao, setLocalizacao] = useState([]);
  // const [pagamento, setPagamento] = useState(["Débito"]);
  // const [observacao, setObservacao] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [menu, setMenu] = useState({});
  const [tipos] = useState([
    {
      id: 1,
      label: 'Lanches',
      value: 'lanches'
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
    }).finally(() => {
      setLoader(false)
    }).catch((err) => {
      toast.error(err.message)
    });

  }, [])

  async function validar() {
    validateForm().then(erros => {
      if (Object.keys(erros).length) {
        toast.error('Há campos não preenchidos!')
      } else {
        if (pedido.length > 0) {
          handleRegister();
        } else toast.error('Você não inseriu itens no pedido!')
      }
    })
  }

  const history = useHistory();

  async function handleChangeSelect(e) {
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

  useEffect(() => { console.log(pedido) }, [pedido])

  async function handleSubmitForm(values) {

    try {
      toast.promise(
        api.post('pedidos', {
          nome: values.nome,
          localizacao: values.localizacao,
          observacao: values.observacao,
          pagamento: values.pagamento,
          pedido
        })
          .then(response => {
            if (response.status == 200) {

              setInterval(() => {
                if (response.data.id) {
                  history.push(`/checkout/${response.data.id}`);
                }
              }, 1300);


            } else {
              toast.error('Erro ao realizar pedido. ', response.statusText);
              return;
            }
          })
          .finally(() => {
            setLoader(false)
          }),
        {
          loading: 'Enviando...',
          success: <b>Pedido enviado!</b>,
          error: <b>Erro ao enviar pedido.</b>,
        }
      );

    } catch (error) {
      toast.error('Erro no cadastro', error)
    }

  }
  async function handleRegister() {
    var total = 0;
    for (let p of pedido) {
      total = total + p.value;
    }
    setLoader(true);
    console.log(pedido)
    toast((t) => (
      <span>
        <strong>Confira seu pedido:</strong>
        <p>{values.nome}</p>
        <p>{values.localizacao}</p>
        <p>{values.pagamento}</p>
        <p>{values.observacao}</p>
        {
          pedido.map((p) => {

            return (
              <>
                <table className="table" key={p.id}>
                  <td>{p.title} x{p.qtd}</td>
                  <td>
                    {
                      Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(p.value * p.qtd)
                    }
                  </td>
                </table>
              </>
            )
          })
        }

        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
        <div className='d-flex justify-content-around'>
          <button className="btn btn-sm btn-danger" onClick={() => {
            toast.dismiss(t.id)
            setLoader(false);
          }
          }>
            Cancelar pedido
          </button>
          <button className="btn btn-sm btn-success" onClick={() => {
            submitForm(values);
            toast.dismiss(t.id)

          }
          }>
            Confirmar pedido
          </button>
        </div>

      </span>
    ), { persistent: true });
  }


  return (
    <div className="register-container">
      <Toaster></Toaster>
      <div className="content">
        <section>
          <img src={logoImg} alt="Smoke Meat House" />
          <p>Peça agora lanches artesanais e porções com carnes defumadas da melhor qualidade!</p>
        </section>

        <div id="form">
          <input
            placeholder="Seu nome"
            className="form-control mt-2"
            name="nome"
            value={values.nome}
            onChange={handleChange}
          />
          {errors.nome && <p className="text-danger">{errors.nome}</p>}

          <input
            ref={ref}
            className="form-control mt-2"
            name="localizacao"
            placeholder="Local"
            value={values.localizacao}
            onChange={handleChange}
          />

          {errors.localizacao && <p className="text-danger">{errors.localizacao}</p>}

          <select className="form-select form-select-lg my-3" onChange={e => handleChangeSelect(e.target.value)}>
            {tipos.map((tipos) => (
              <option key={tipos.id} value={tipos.value}>{tipos.label}</option>
            ))}
          </select>
          {loader && (
          <div className="menu-items">
            <ThreeDots
            style="justify-content:center"
            height="50px"
            width="50px"
            color="red"
            ariaLabel="loading"
            className="d-flex justify-content-center align-items-center"
          />
          </div>)}
          {!loader && (<div className="menu-items">
            {Object.keys(menu).map(key => (
              <div key={key}>
                <h3 id={key}>{key}</h3>
                {menu[key].map((comida) => {
                  return (
                    <section key={comida.id}>
                      <div className="card-menu">
                      <div className="col-4 border border-dark p-1 rounded">
                          <img className="img-fluid border-black" src={logoImg} alt="Smoke Meat House" />
                      </div>
                        <div className="col-4">
                          <strong>{comida.title}</strong>

                          <p className='p-1'>{comida.description}</p>
                        </div>                        
                        <div className="col-4 noselect">
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
          )}

          <select name="pagamento" value={values.pagamento} className="form-select form-select-lg my-3" onChange={handleChange}>
            {pagamentos.map((pagamentos) => (
              <option key={pagamentos.id} value={pagamentos.value}>{pagamentos.label}</option>
            ))}
          </select>
          {errors.pagamento && <p className="text-danger">{errors.pagamento}</p>}
          <input
            placeholder="Observações"
            name="observacao"
            className="form-control mt-2"
            value={values.observacao}
            onChange={handleChange}
          />

          <button onClick={() => validar()} className="button d-flex justify-content-center" type="submit">
            {!loader && 'Realizar pedido'}
            {loader && (<ThreeDots
              className="d-flex justify-content-center align-items-center"
              height="50px"
              width="50px"
              color="white"
              ariaLabel="loading"
            />)}
          </button>
        </div>
      </div>
    </div>
  );
}