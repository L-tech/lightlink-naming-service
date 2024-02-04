enum ChainType {
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export interface IConfig {
  web3: {
    CHAIN_ID: number
    TYPE: ChainType
    NETWORK: {
      chainName: string
      nativeCurrency: {
        name: string
        symbol: string
        decimals: number
      }
      blockExplorerUrls: string[]
    }
  }
  domainRecordsKey: {
    address: {
      LINK: string
      ETH: string
      BTC: string
    }
    social: {
      DISCORD: string
      GITHUB: string
      REDDIT: string
      TWITTER: string
      TELEGRAM: string
    }
    text: {
      URL: string
      AVATAR: string
      EMAIL: string
      DESCRIPTION: string
    }
  }
}

const NODE_ENV: string = process.env.REACT_APP_STAGE || 'local'

const local: IConfig = {
  web3: {
    CHAIN_ID: 1891,
    TYPE: ChainType.TESTNET,
    NETWORK: {
      chainName: 'Lightlink Pegasus Testnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://pegasus.lightlink.io'],
    },
  },

  domainRecordsKey: {
    address: {
      LINK: 'link',
      ETH: 'eth',
      BTC: 'btc',
    },
    social: {
      DISCORD: 'discord',
      GITHUB: 'github',
      REDDIT: 'reddit',
      TWITTER: 'twitter',
      TELEGRAM: 'telegram',
    },
    text: {
      URL: 'URL',
      AVATAR: 'avatar',
      EMAIL: 'email',
      DESCRIPTION: 'description',
    },
  },
}

const production: IConfig = {
  web3: {
    CHAIN_ID: 1890,
    TYPE: ChainType.MAINNET,
    NETWORK: {
      chainName: 'Lightlink Phoenix Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://phoenix.lightlink.io'],
    },
  },
  domainRecordsKey: {
    address: {
      LINK: 'link',
      ETH: 'eth',
      BTC: 'btc',
    },
    social: {
      DISCORD: 'discord',
      GITHUB: 'github',
      REDDIT: 'reddit',
      TWITTER: 'twitter',
      TELEGRAM: 'telegram',
    },
    text: {
      URL: 'URL',
      AVATAR: 'avatar',
      EMAIL: 'email',
      DESCRIPTION: 'description',
    },
  },
}

const config: {
  [name: string]: IConfig
} = {
  local,
  production,
}

export default config[NODE_ENV]
