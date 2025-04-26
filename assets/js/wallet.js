export let walletData = null;
document.getElementById('connect-wallet').addEventListener('click', connectWallet);
async function connectWallet() {
    const isPhantomInstalled = window.phantom?.solana?.isPhantom
    const getProvider = () => {
        if ('phantom' in window) {
          const provider = window.phantom?.solana;
      
          if (provider?.isPhantom) {
            return provider;
          }
        }
        window.open('https://phantom.app/', '_blank');
      };
    if(isPhantomInstalled){
        const provider = getProvider(); // see "Detecting the Provider"
        try {
            const resp = await provider.connect();
            walletData = {
                publicKey: resp.publicKey.toString(),
                connected: true,
                provider: provider
            };
            console.log(resp.publicKey.toString());
        } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
            console.log(err);
        }
    }else{
        console.log('Phantom not installed');
    }
}
window.phantomWalletAPI = {
    connect: connectWallet,
    getWalletData: () => walletData
};