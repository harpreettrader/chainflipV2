import React, { useState } from 'react';
import ExchangeComponent from './Exchange';
import axios from 'axios';

const SwapInterface: React.FC = () => {
  const [depositAddr, setDepositAddr] = useState<string>('');

  const handleClick = () =>{

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://perseverance.chainflip-broker.io/swap?apikey=dff049a53a4d4cc499cb5f555e316416&sourceAsset=flip.eth&destinationAsset=usdc.arb&destinationAddress=0xfe0442fB1599FE52Bd9Cd40afe0F37F297d867A7',
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setDepositAddr(JSON.stringify(response.data.address));
      alert(depositAddr)
    })
    .catch((error) => {
      console.log(error);
    });

  }

  return (
    <div className="p-4 border-t flex flex-col justify-center items-center border-blue-200">

      {depositAddr}
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
      <div className='text-3xl pt-4'>Swap</div>
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
          <ul className='items-center w-full text-sm font-medium mb-4 text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex '/* dark:bg-gray-700 dark:border-gray-600 dark:text-white*/>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r " /**dark:border-gray-600 */>
                <div className="flex items-center ps-3">
                    <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 " /**dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 */ />
                    <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 " /**dark:text-gray-300 */ >ChainFlip</label>
                </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div className="flex items-center ps-3">
                    <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 " /**dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 */  />
                    <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" /** dark:text-gray-300 */ >Maya</label>
                </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div className="flex items-center ps-3">
                    <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 " /**dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 */  />
                    <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 " /**dark:text-gray-300 */ >THORChain</label>
                </div>
            </li>
          </ul>

          {/** Token select */}

          <ExchangeComponent sellValue={3137.2} buyValue={47.60} priceChange={-39.3} exchangeRate={40} />

          
          <button className="w-full rounded-xl mt-2 p-2 bg-blue-500 text-white" onClick={handleClick}>Swap</button>
        </div>
  
        {/* Info Box */}
        <div className="w-1/2 border border-gray-400 p-4 rounded-xl ml-4 flex flex-col justify-start items-start min-h-[300px] ">
          <h2 className="text-xl font-bold mb-4">Info</h2>
          <p className="mb-2">Gas Fee: ...</p>
          <p className="mb-2">Time Duration: ...</p>
          <p className="mb-2">Affiliate Fee: ...</p>
          <p className="mb-2">TPS: ...</p>
        </div>
      </div>


    </div>
  );
}

export default SwapInterface;
