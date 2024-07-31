import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const SwapInterface = () => {
  const [destinationAddr, setDestinationAddr] = useState('');
  const [sourceAsset, setSourceAsset] = useState('');
  const [destinationAsset, setDestinationAsset] = useState('');
  const [depositAddr, setDepositAddr] = useState('');
  const [status, setStatus] = useState('');
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('1');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://perseverance.chainflip-broker.io/swap?apikey=dff049a53a4d4cc499cb5f555e316416&sourceAsset=${sourceAsset}&destinationAsset=${destinationAsset}&destinationAddress=${destinationAddr}`,
      headers: {}
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      setId(response.data.id);
      setDepositAddr(response.data.address);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    console.log("sourceAsset:", sourceAsset);
    console.log("destinationAsset:", destinationAsset);
    console.log("destinationAddress:", destinationAddr);
  };

  const handleSendToken = async () => {
    if (!signer || !provider) {
      setStatus('MetaMask is not connected');
      return;
    }

    if (!depositAddr) {
      setStatus('Recipient address is required');
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setStatus('Invalid amount');
      return;
    }

    let tokenAddress;
    if (sourceAsset === "flip.eth") {
      tokenAddress = '0xdC27c60956cB065D19F08bb69a707E37b36d8086';
    } else if (sourceAsset === "usdt.eth") {
      tokenAddress = "0x27CEA6Eb8a21Aae05Eb29C91c5CA10592892F584";
    } else {
      alert("We don't switch from this source now, we are working on it....");
      return;
    }

    const erc20Abi = [
      "function transfer(address to, uint256 amount) public returns (bool)",
      "function balanceOf(address addr) view returns (uint)"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    console.log('Token Contract:', tokenContract);

    const amountInUnits = ethers.parseUnits(amount, 6);
    console.log('Recipient:', depositAddr);
    console.log('Amount in units:', amountInUnits.toString());

    try {
      console.log('Preparing to send transaction with:', { depositAddr, amountInUnits });
      const tx = await tokenContract.transfer(depositAddr, amountInUnits);
      console.log('Transaction:', tx);
      console.log(await signer, "h");
      console.log(provider, "h");
      await tx.wait();
      setStatus('Transaction confirmed!');
    } catch (error) {
      console.error('Error sending token:', error);
      setStatus('Error sending token');
    }
  };

  useEffect(() => {
    let intervalId;

    const func = async () => {
      if (status === "COMPLETE") {
        return;
      }
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://perseverance.chainflip-broker.io/status-by-id/?apikey=dff049a53a4d4cc499cb5f555e316416&swapId=${id}`,
        headers: {}
      };
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        setStatus(response.data.status.state);
      } catch (error) {
        console.log(error);
      }
    };

    if (depositAddr !== "") {
      func();
      intervalId = setInterval(func, 60000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [depositAddr]);

  useEffect(() => {
    const setupProvider = async () => {
      if (window.ethereum) {
        try {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          console.log('Provider:', newProvider);
          setProvider(newProvider);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const newSigner = await newProvider.getSigner();
          console.log('Signer:', newSigner);
          setSigner(newSigner);
        } catch (error) {
          console.error('Error setting up MetaMask:', error);
          setStatus('Error setting up MetaMask: ' + error);
        }
      } else {
        setStatus('MetaMask is not installed');
      }
    };

    setupProvider();
  }, []);

  const handleDeposit = () => {
    console.log("handleDeposit");
    setLoading(true);
    handleSendToken().finally(() => setLoading(false));
    console.log("Depositted");
  };

  return (
    <div className="p-4 border-t flex flex-col justify-center items-center border-blue-200 bg-gray-100 min-h-screen">
      <div className='text-3xl font-bold text-blue-800 pt-4'>Swap</div>
      <div className="flex w-full h-[90%] p-6">
        <div className="w-1/2 border border-gray-400 p-8 rounded-xl mr-4 flex flex-col justify-center items-center min-h-[300px] bg-white shadow-lg">
          <ul className='items-center w-full text-sm font-medium mb-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-lg sm:flex'>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
              <div className="flex items-center ps-3">
                <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Maya</label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
              <div className="flex items-center ps-3">
                <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">THORChain</label>
              </div>
            </li>
          </ul>
          <div className="flex w-full h-[90%] p-6">
            <div className="w-full border border-gray-400 p-8 rounded-xl mr-4 flex flex-col justify-center items-center min-h-[300px] bg-white shadow-md">
              <form className="max-w-md mx-auto pt-6 my-2">
                <div className="relative z-0 w-full group">
                  <input type="text" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-black border-0 border-b-2 appearance-none bg-transparent focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required value={destinationAddr} onChange={(e) => setDestinationAddr(e.target.value)} />
                  <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Destination address</label>
                </div>
                <div className="relative z-0 pt-6 w-full group">
                  <input type="text" name="floating_amount" id="floating_amount" className="block py-2.5 px-0 w-full text-sm text-black border-0 border-b-2 appearance-none bg-transparent focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <label htmlFor="floating_amount" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Amount to be swapped</label>
                </div>
                <label htmlFor="sourceAsset" className="block mt-4 text-sm font-medium text-black">Select Source Asset</label>
                <select 
                  id="sourceAsset" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={sourceAsset}
                  onChange={(e) => setSourceAsset(e.target.value)}    
                >
                  <option value="" disabled>Choose an asset</option>
                  <option value="eth.eth">eth.eth</option>
                  <option value="flip.eth">flip.eth</option>
                  <option value="usdt.eth">usdt.eth</option>
                </select>
                <label htmlFor="destAsset" className="block mt-4 text-sm font-medium text-gray-900">Select Destination Asset</label>
                <select 
                  id="destAsset" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={destinationAsset}
                  onChange={(e) => setDestinationAsset(e.target.value)}
                >
                  <option value="" disabled>Choose an asset</option>
                  <option value="btc.btc">btc.btc</option>
                  <option value="dot.dot">dot.dot</option>
                  <option value="eth.arb">eth.arb</option>
                  <option value="eth.eth">eth.eth</option>
                  <option value="flip.eth">flip.eth</option>
                  <option value="usdc.arb">usdc.arb</option>
                  <option value="usdt.eth">usdt.eth</option>
                </select>
                <button className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={handleClick} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 11-8 8z"></path>
                      </svg>
                      Swapping...
                    </span>
                  ) : (
                    'Swap'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-1/2 border border-gray-400 p-4 rounded-xl ml-4 flex flex-col justify-start items-start min-h-[300px] bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Info</h2>
          <p className="mb-2 text-gray-700">Deposit Address: {depositAddr || '...'}</p>
          <p className="mb-2 text-gray-700">Time Duration: 24hrs</p>
          
          {depositAddr && (
            <p className="mb-2 text-gray-700">
              {`Deposit ${sourceAsset} to ${depositAddr} address to initiate swap`}
            </p>
          )}
          
          <p className='mb-2 text-gray-700'>{`Status: ${status}`}</p>

          <button onClick={handleDeposit} className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 11-8 8z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Deposit'
            )}
          </button>
          
          {status === 'COMPLETE' && <p className='mt-4 text-green-600'>Swap Completed</p>}
        </div>
      </div>
    </div>
  );
}

export default SwapInterface;
