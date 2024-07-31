import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const SwapInterface: React.FC = () => {
  const [destinationAddr, setDestinationAddr] = useState<string>('');
  const [sourceAsset, setSourceAsset] = useState<string>('');
  const [destinationAsset, setDestinationAsset] = useState<string>('');
  const [depositAddr, setDepositAddr] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [amount] = useState<string>('1');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = (e: any) => {
    e.preventDefault();
    setLoading(true);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://perseverance.chainflip-broker.io/swap?apikey=dff049a53a4d4cc499cb5f555e316416&sourceAsset=${sourceAsset}&destinationAsset=${destinationAsset}&destinationAddress=${destinationAddr}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setId(JSON.stringify(response.data.id));
        setDepositAddr(response.data.address);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    console.log("sourceAsset: ", sourceAsset);
    console.log("destinationAsset: ", destinationAsset);
    console.log("destinationAddress: ", destinationAddr);
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
      setStatus('Invalid amount');
      return;
    }
    console.log(amount);

    try {
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

      console.log('Preparing to send transaction with:', { depositAddr, amountInUnits });
      const tx = await tokenContract.transfer(depositAddr, amountInUnits);
      console.log('Transaction:', tx);

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
      if (status === "COMPLETE") {
        return;
      }
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
          setProvider(newProvider as ethers.BrowserProvider);

          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const newSigner = await newProvider.getSigner();
          console.log('Signer:', newSigner);
          setSigner(newSigner);
        } catch (error) {
          console.error('Error setting up MetaMask:', error);
        }
      } else {
        setStatus('MetaMask is not installed');
      }
    };

    setupProvider();
  }, []);

  const handleDeposit = () => {
    console.log("handleDeposit");
    handleSendToken();
    console.log("Deposited");
  }

  return (
    <div className="p-4 border-t flex flex-col justify-center items-center border-blue-200 ">
      <div className='text-3xl pt-4 text-black'>Swap through broker channel</div>
      <div className="flex w-full h-[90%] p-6 ">
        <div className="w-1/2 border border-gray-400 p-8 rounded-xl mr-4 flex flex-col justify-center items-center min-h-[300px] bg-gray-500">
          <form className="max-w-md mx-auto">
            <div className="relative z-0 w-full group">
              <input type="text" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-black border-0 border-b-2 appearance-none bg-transparent focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required value={destinationAddr} onChange={(e) => setDestinationAddr(e.target.value)} />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-800 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Destination address</label>
            </div>
            <label htmlFor="sourceAsset" className="block mt-4 text-sm font-medium text-black ">Select Source Asset</label>
            <select 
              id="sourceAsset" 
              className="bg-gray-500 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            <label htmlFor="destiAsset" className="block mt-4 text-sm font-medium text-gray-900 ">Select Destination Asset</label>
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
            <button className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleClick}>
              {loading ? 'Loading...' : 'Swap'}
            </button>
          </form>
        </div>

        <div className="w-1/2 border border-gray-400 p-4 rounded-xl ml-4 flex flex-col justify-start items-start min-h-[300px] overflow-auto bg-gray-500">
          <h2 className="text-xl font-bold mb-4">Info</h2>
          <p className="mb-2 break-all">Deposit Address: {depositAddr ? `${depositAddr}` : '...'}</p>
          <p className="mb-2">Time Duration: 24hrs</p>
          {depositAddr ? <p className="mb-2 break-all">{`Deposit ${sourceAsset} to ${depositAddr} address to initiate swap`}</p> : null}
          <p className='mb-2 break-all'>{`Status : ${status}`}</p>
          <button onClick={handleDeposit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            {loading ? 'Loading...' : 'Deposit'}
          </button>
          {status === 'COMPLETE' && <p className='mb-2'>Swap Completed</p>}
        </div>
      </div>
    </div>
  );
}

export default SwapInterface;
