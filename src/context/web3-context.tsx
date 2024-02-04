import React, { createContext, useState } from 'react'
import config from '../config'
import { getUserBalance } from '../lib/utils'
import { getNameFromAddress } from '../services/lightlink-lns'

export const Web3Context: any = createContext<any>({} as any)

const { ethereum } = window as any

const Web3ContextProvider: any = ({ children }: any) => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [currentAccountName, setCurrentAccountName] = useState(null)
  const [userBalance, setUserBalance] = useState('')

  const getAdressName = async (address: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await getNameFromAddress(address)
      if (!res.error) {
        setCurrentAccountName(res.response)
      }
    } catch (error) {
      console.log('Error in getting domain name ->', error)
    }
  }

  const disconnectWallet = async () => {
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      })
      console.log(accounts)
      setCurrentAccount(null)
    } catch (error) {}
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application');
      return;
    }
  
    try {
      const chainId = `0x${Number(config.web3.CHAIN_ID).toString(16)}`;
      const windowChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const decimalConfigChainId = parseInt(chainId, 16);
      const decimalWindowChainId = parseInt(windowChainId, 16);
      if (decimalWindowChainId !== decimalConfigChainId) {
        console.log("Yeah yeah");
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainId,
              rpcUrls: [process.env.REACT_APP_RPC_URL],
              chainName: config.web3.NETWORK.chainName,
              nativeCurrency: {
                name: config.web3.NETWORK.nativeCurrency.name,
                symbol: config.web3.NETWORK.nativeCurrency.symbol,
                decimals: config.web3.NETWORK.nativeCurrency.decimals,
              },
              blockExplorerUrls: config.web3.NETWORK.blockExplorerUrls,
            },
          ],
        });
      }
  
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
      getAdressName(accounts[0]);
      const userBalanceRes = await getUserBalance(accounts[0]);
      setUserBalance(userBalanceRes);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to connect to Ethereum');
    }
  };
  

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
        setCurrentAccount,
        userBalance,
        currentAccountName,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
export default Web3ContextProvider
