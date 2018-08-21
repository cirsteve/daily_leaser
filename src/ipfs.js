//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-api');
//const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });

//ip4/127.0.0.1/tcp/5001
//run with local daemon
// const ipfsApi = require('ipfs-api');
//const ipfs = new IPFS('/ip4/127.0.0.1/tcp/5001', '', {protocol: 'http'});

export default ipfs;
