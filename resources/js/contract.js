import { ethers } from 'ethers';

const contractAddress = '00x6ba2c572dC2FC96DeA80827c4e893c26ea4b4CB0';

const abi = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'propertyId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'buyTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'propertyId',
                type: 'uint256',
            },
        ],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'createProperty',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'propertyId',
                type: 'uint256',
            },
        ],
        name: 'distributeProfit',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'propertyId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'buyer',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'TokensBought',
        type: 'event',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'balances',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'entryProfitPerToken',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'propertyId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'getPendingProfit',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'nextPropertyId',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'properties',
        outputs: [
            {
                internalType: 'uint256',
                name: 'totalTokens',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'profitPerToken',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'exists',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

// =====================
// 🔒 SINGLETON STATE
// =====================
let provider = null;
let signer = null;
let contract = null;
let connecting = null;

// =====================
// 🔑 CONNECT WALLET (SAFE)
// =====================
export async function getSigner() {
    if (!window.ethereum) {
        throw new Error('Instala MetaMask');
    }

    if (signer) return signer;

    if (connecting) return connecting;

    connecting = (async () => {
        provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send('eth_requestAccounts', []);

        signer = await provider.getSigner();
        return signer;
    })();

    const result = await connecting;
    connecting = null;

    return result;
}

// =====================
// 📦 GET CONTRACT (CACHED)
// =====================
export async function getContract() {
    if (contract) return contract;

    const signer = await getSigner();

    contract = new ethers.Contract(contractAddress, abi, signer);

    return contract;
}

// =====================
// 🔄 RESET (usar si hay error de conexión)
// =====================
export function resetContract() {
    provider = null;
    signer = null;
    contract = null;
    connecting = null;
}
