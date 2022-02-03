import React, { Fragment, useState } from "react";
import { Link, Redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ethers } from 'ethers';
const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleMetamaskConnection = async () => {
      const ethereum = window.ethereum
      try{
        if(!ethereum) throw Error('No metamask found')
        const [account] = await window.ethereum.request({method:"eth_requestAccounts"});
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ 
                chainId: '0x38',
            }],
        });
          navigate('/dashboard')
      }
      catch(err){
        if(err.code === 4902){
            try {
                await window.ethereum.request({ method: 'wallet_addEthereumChain', 
                    params: [{
                        chainId: '0x38',
                        chainName: 'BSC Mainnet',
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB',
                            decimals: 18
                        },
                        rpcUrls: ['https://bsc-dataseed1.binance.org/'],
                        blockExplorerUrls: ['https://bscscan.com/']
                    }]
                })
                console.log('Success')
            } catch (err) {
                console.log(err.message);
            }
        }
        alert(err.message);
      }
      
  }

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch(
        "http://localhost:5000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Logged in Successfully");
        navigate('/dashboard')
          console.log('serfase')
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Login</h1>
      <button onClick = {handleMetamaskConnection} type="button" class="btn btn-primary w-100">Metamask</button>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          placeholder='email'
          name="email"
          value={email}
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <input
          placeholder='password'
          type="password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <button class="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register">register</Link>
    </Fragment>
  );
};

export default Login;
