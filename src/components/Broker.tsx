import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { USDC_ADDR } from '../utils/arbitrum';
import { abi } from '../utils/abi';


const SwapInterface: React.FC = () => {
  const [destinationAddr, setDestinationAddr] = useState<string>('');
  const [sourceAsset, setSourceAsset] = useState<string>('');
  const [destinationAsset, setDestinationAsset] = useState<string>('');
  const [depositAddr, setDepositAddr] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [amount, setAmount] = useState<string>('1');
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);


  const handleClick = (e : any) =>{
    e.preventDefault();

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://perseverance.chainflip-broker.io/swap?apikey=dff049a53a4d4cc499cb5f555e316416&sourceAsset=${sourceAsset}&destinationAsset=${destinationAsset}&destinationAddress=${destinationAddr}`,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setId(JSON.stringify(response.data.id));
      setDepositAddr(JSON.stringify(response.data.address));
    })
    .catch((error) => {
      console.log(error);
    });

    console.log("sourceAsset: " , sourceAsset);
    console.log("destinationAsset: " , destinationAsset);
    console.log("destinationAddress: " , destinationAddr);
  }
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
      // setAmount('10')
      setStatus('Invalid amount');
      return;
    }
    console.log(amount)

    try {
      // ERC-20 token contract address (USDC in this case)
      const tokenAddress = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d';

      // Define the ERC-20 contract ABI
      const erc20Abi = [
        // Only include the transfer function ABI
        "function transfer(address to, uint256 amount) public returns (bool)"
      ];

      // Create a contract instance
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      // Convert amount to the appropriate units (assuming USDC has 6 decimals)
      const amountInUnits = ethers.formatUnits(amount, 6);

      // Send the transaction
      const tx = await tokenContract.transfer(depositAddr, amountInUnits);
      setStatus('Transaction sent. Waiting for confirmation...');

      // Wait for the transaction to be mined
      await tx.wait();
      setStatus('Transaction confirmed!');
    } catch (error) {
      console.error('Error sending token:', error);
      setStatus('Error sending token');
    }
  };


  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const func = async () => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://perseverance.chainflip-broker.io/status-by-id/?apikey=dff049a53a4d4cc499cb5f555e316416&swapId=${id}`,
        headers: {}
      };

      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        setStatus(JSON.stringify(response.data.status.state));
      } catch (error) {
        console.log(error);
      }
    };

    if (depositAddr !== "") {
      func(); // Execute function immediately when depositAddress is not empty

      intervalId = setInterval(func, 60000); // Set interval to call the function every 1 minute
    }
    return () => {
      if (intervalId) clearInterval(intervalId); // Clear interval on component unmount or when depositAddress changes
    };
  }, [depositAddr]);


  useEffect(() => {
    const setupProvider = async () => {
      if (window.ethereum) {
        try {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);
          await newProvider.send('eth_requestAccounts', []);
          const newSigner = newProvider.getSigner();
          setSigner(newSigner);
        } catch (error) {
          // setStatus('Error setting up MetaMask: ' + error.message);
          console.log('Error setting up MetaMask: ' + error);
        }
      } else {
        setStatus('MetaMask is not installed');
      }
    };

    setupProvider();
  }, []);

  const handleDeposit = () => {
    console.log("handleDeposit")
    handleSendToken();
    console.log("Depositted")
  }

  return (
    <div className="p-4 border-t flex flex-col justify-center items-center border-blue-200">

      {/* <div className="mb-4">
        <label htmlFor="token-select" className="block text-sm font-medium text-gray-700">Token</label>
        <select id="token-select" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
          <option>ETH</option>
          <option>ETC</option>
        </select>
      </div>
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
        Swap
      </button> */}
      <div className='text-3xl pt-4'>Swap through broker chanel</div>
      {/* <div className='flex justify-center items-center mt-4 w-full h-full border'>
        <div className='w-1/2 p-10'>
          A
        </div>
        <div className='w-1/2 p-10 '>B</div>
      </div> */}
      
      <div className="flex w-full h-[90%] p-6">
        {/* Swap Box */}
        <div className="w-1/2 border border-gray-400 p-8 rounded-xl mr-4 flex flex-col justify-center items-center min-h-[300px] ">
          
          {/** Chain select */}
         
          {/** Token select */}


          {/* <div className="w-full ">
            <label className="block mb-2">Select Token:</label> 
            <select className="w-full p-2 border border-gray-400">
              <option>ETH/FLIP</option>
              <option>FLIP/ARB</option>
              <option>FLIP/RUIN</option>
            </select>
          </div>
          <div className='flex justify-end items-center py-4 pt-2'>
            <div className="w-full mr-2">
              <label className="block mb-2"> </label>
              Balance: XYZ
            </div>
            <button className="p-2 bg-gray-500 text-white">Full/MAX</button >
          </div>
          <div className="w-full mb-4">
            <label className="block mb-2">Select Token:</label>
            <select className="w-full p-2 border border-gray-400">
              <option>ETH/FLIP</option>
              <option>FLIP/ARB</option>
              <option>FLIP/RUIN</option>
            </select>
          </div>  */}

            <form className="max-w-md mx-auto">
                <div className="relative z-0 w-full group">
                    <input type="text" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-black border-0 border-b-2 appearance-none bg-transparent focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required value={destinationAddr} onChange={(e) => setDestinationAddr(e.target.value)} />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Destination address</label>
                </div>
                <label htmlFor="sourceAsset" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Source Asset</label>
                <select 
                    id="sourceAsset" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={sourceAsset}
                    onChange={(e) => setSourceAsset(e.target.value)}    
                >
                    <option selected>Choose an asset</option>
                    <option value="btc.btc">btc.btc</option>
                    <option value="dot.dot">dot.dot</option>
                    <option value="eth.arb">eth.arb</option>
                    <option value="eth.eth">eth.eth</option>
                    <option value="flip.eth">flip.eth</option>
                    <option value="usdc.arb">usdc.arb</option>
                    <option value="usdt.eth">usdt.eth</option>
                </select>
                <label htmlFor="destiAsset" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Destination Asset</label>
                <select 
                    id="destAsset" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={destinationAsset}
                    onChange={(e) => setDestinationAsset(e.target.value)}
                >
                    <option selected>Choose an asset</option>
                    <option value="btc.btc">btc.btc</option>
                    <option value="dot.dot">dot.dot</option>
                    <option value="eth.arb">eth.arb</option>
                    <option value="eth.eth">eth.eth</option>
                    <option value="flip.eth">flip.eth</option>
                    <option value="usdc.arb">usdc.arb</option>
                    <option value="usdt.eth">usdt.eth</option>
                </select>
                <button className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleClick}>Swap</button>
            </form>

          
        </div>
  
        {/* Info Box */}
        <div className="w-1/2 border border-gray-400 p-4 rounded-xl ml-4 flex flex-col justify-start items-start min-h-[300px] ">
          <h2 className="text-xl font-bold mb-4">Info</h2>
          <p className="mb-2">Desposit Address: {depositAddr ? `${depositAddr}` : '...'}</p>
          <p className="mb-2">Time Duration: 24hrs</p>
          
          {depositAddr ? <p className="mb-2">{`Deposit ${sourceAsset} to ${depositAddr} address to initiate swap` }</p>: null}
          <p className='mb-2'>{`Status : ${status}`}</p>

          <button onClick={handleDeposit}>Deposit</button>
          {status === 'COMPLETE' && <p className='mb-2'>Swap Completed </p>}
        </div>
      </div>


    </div>
  );
}

export default SwapInterface;
