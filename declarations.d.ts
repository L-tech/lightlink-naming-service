interface Window {
    ethereum?: {
      _metamask: any;
      request: (...args: any[]) => Promise<any>;
      chainId?: string;
      // Add any other properties and methods you need from the ethereum object
    };
  }