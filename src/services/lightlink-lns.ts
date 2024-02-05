import { LNS } from 'lnsjs'
import { BlockchainIdentifier } from 'lnsjs/utils/blockchainIdentifiers'
import { ethers } from 'ethers'
import { getSecondsFromYear } from '../lib/utils'

const providerUrl = process.env.REACT_APP_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

export const isAvailable = async (name: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const isAvailable = await LNSInstance.getAvailable(name)
    return { error: false, response: !!isAvailable }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getPriceOnYear = async (name: string, duration: number) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const price = await LNSInstance.getPrice(name, getSecondsFromYear(duration))
    return { error: true, response: price }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getUserXp = async (address: string) => {
  try {
    const LNSInstance = new LNS();
    await LNSInstance.setProvider(provider);
    const xpWei = await LNSInstance.getUserXp(address);
    if (typeof xpWei !== 'boolean' && xpWei !== undefined) {
      // Convert Wei to Ether assuming xpWei is of BigNumber type
      const xpEther = ethers.utils.formatEther(xpWei);
      return { error: false, response: xpEther };
    } else {
      // Handle unexpected xpWei type (boolean or undefined)
      console.error('Unexpected type for xpWei:', xpWei);
      return { error: true, response: 'Unexpected response type' };
    }
  } catch (error) {
    console.error('Error fetching user XP:', error);
    return { error: true, response: (error as Error).message };
  }
};

export const getUserLevel = async (address: string) => {
  try {
    console.log(address)
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const level = await LNSInstance.getUserLevel(address)
    console.log(level)
    return { error: true, response: level }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

//  Set Addr
export const setAddr = async (domainName: string, value: string) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.setAddr(domainName, {
      address: String(value),
      coinType: BlockchainIdentifier.LIGHTLINKP,
    })
    await res.wait()
    localStorage.removeItem('domain-underpurchase')
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const registerDomain = async (
  name: string,
  address: string,
  duration: number,
  price: string,
) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    if (await isAvailable(name)) {
      const res = await LNSInstance.registerName(name, {
        owner: address,
        duration: getSecondsFromYear(duration),
        secret: process.env.REACT_APP_LIGHTLINK_SECRET || '',
        value: ethers.utils.parseUnits(price, 18),
      })
      await res.wait()
      if (res.hash) {
        return { error: false, response: res.hash }
      } else {
        return { error: true, response: 'Something went wrong' }
      }
    } else {
      return { error: true, response: 'Domain is not available' }
    }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getProfile = async (domainName: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const profile = await LNSInstance.getProfile(domainName)
    return { error: false, response: profile }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getAddress = async (domainName: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const address = await LNSInstance.getAddress(
      domainName,
      BlockchainIdentifier.LIGHTLINKP,
    )
    return { error: false, response: address }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getContentHash = async (domainName: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const contentHash = await LNSInstance.getContent(domainName)
    if (!contentHash?.protocolType || !contentHash?.decoded) {
      return {
        error: false,
        response: '',
      }
    }
    return {
      error: false,
      response: `${contentHash?.protocolType}://${contentHash?.decoded}`,
    }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}

export const getNameFromAddress = async (address: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const node = await LNSInstance.getNameNode(address)
    const name = await LNSInstance.getAddrName(node)
    console.log('NAME: ', name, address)
    return { error: false, response: name }
  } catch (error) {
    console.log(error)
    return { error: true, response: (error as Error).message }
  }
}

export const getExpiry = async (domainName: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const expiry = await LNSInstance.getExpiry(domainName)
    return { error: false, response: expiry?.expiry }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}
//  Set Content Hash
export const setContentHash = async (
  domainName: string,
  value: string,
  callback: (step: string) => void,
) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    callback('tx-confirm')
    const res = await LNSInstance.setContentHash(domainName, value)
    callback('tx-started')
    await res.wait()
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getOwnerNames = async (address: string) => {
  try {
    const LNSInstance = new LNS()
    await LNSInstance.setProvider(provider)
    const names = await LNSInstance.getOwnerNames(address)
    return { error: false, response: names }
  } catch (error) {
    console.log(error)
    return { error: true, response: (error as Error).message }
  }
}

export const setTextRecord = async (
  domainName: string,
  key: string,
  value: string,
) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.setTxtRecord(domainName, { key, value })
    await res.wait()
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const grantXpPoint = async (
  address: string,
  point: number,
) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.grantXpPoint(address, point)
    await res.wait()
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const burnXpToken = async (
  address: string,
  percentage: number,
  value: string,
) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.burnXpToken(address, percentage)
    await res.wait()
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getTextRecord = async (domainName: string, key: string) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.getTxtRecord(domainName, key)
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const getRecords = async (domainName: string) => {
  try {
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.getRecords(domainName)
    return { error: false, response: res }
  } catch (error) {
    console.log('ERROR: ', error)
    return { error: true, response: (error as Error).message }
  }
}

export const renewNames = async (
  name: string,
  duration: number,
  price: string,
) => {
  try {
    console.log(name)
    const LNSInstance = new LNS()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await LNSInstance.setProvider(provider)
    const res = await LNSInstance.renewNames(name, {
      duration: getSecondsFromYear(duration),
      value: ethers.utils.parseUnits(price, 18),
    })
    await res.wait()
    const address = getAddress(name);
    const grantXp = await LNSInstance.grantXpPoint(String(address), 50);
    await grantXp.wait()
    if (res.hash) {
      return { error: false, response: res.hash }
    } else {
      return { error: true, response: 'Something went wrong' }
    }
  } catch (error) {
    return { error: true, response: (error as Error).message }
  }
}
