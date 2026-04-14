import AppLayout from '@/AppLayout';
import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getContract } from '../contract';

export default function Home() {
    const [contract, setContract] = useState<Contract | null>(null);
    const [address, setAddress] = useState('');

    const [propertyId, setPropertyId] = useState('');
    const [amount, setAmount] = useState('');

    const [tokens, setTokens] = useState('0');
    const [pending, setPending] = useState('0');
    const [property, setProperty] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    // 🔌 Conectar wallet
    const connectWallet = async () => {
        if (!(window as any).ethereum) {
            alert('Instala MetaMask');
            return;
        }

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();

        const c = await getContract(); // ya usa signer internamente

        setAddress(addr);
        setContract(c);

        alert('Wallet conectada: ' + addr);
    };

    // 🏠 Crear propiedad
    const createProperty = async () => {
        if (!contract) return alert('Conecta la wallet primero');

        setLoading(true);
        const tx = await contract.createProperty();
        await tx.wait();
        setLoading(false);

        alert('Propiedad creada');
    };

    // 🪙 Comprar tokens
    const buyTokens = async () => {
        if (!contract) return alert('Conecta la wallet primero');
        if (!propertyId || !amount) return alert('Datos inválidos');

        setLoading(true);

        const tx = await contract.buyTokens(Number(propertyId), Number(amount));

        await tx.wait();
        await loadData();

        setLoading(false);
        alert('Tokens comprados');
    };

    // 💰 Reclamar ganancias
    const claim = async () => {
        if (!contract) return alert('Conecta la wallet primero');
        if (!propertyId) return alert('Ingresa propertyId');

        setLoading(true);

        const tx = await contract.claim(Number(propertyId));
        await tx.wait();

        await loadData();

        setLoading(false);
        alert('Ganancias reclamadas');
    };

    // 📤 Distribuir ganancias
    const distributeProfit = async () => {
        if (!contract) return alert('Conecta la wallet primero');
        if (!propertyId) return alert('Ingresa propertyId');

        setLoading(true);

        const tx = await contract.distributeProfit(Number(propertyId), {
            value: ethers.parseEther('0.001'),
        });

        await tx.wait();
        await loadData();

        setLoading(false);
        alert('Ganancias distribuidas');
    };

    // 📊 Cargar datos
    const loadData = async () => {
        if (!contract || !propertyId || !address) return;

        try {
            const userTokens = await contract.balances(
                Number(propertyId),
                address,
            );

            const pendingProfit = await contract.getPendingProfit(
                Number(propertyId),
                address,
            );

            const propertyData = await contract.properties(Number(propertyId));

            setTokens(userTokens.toString());
            setPending(pendingProfit.toString());
            setProperty(propertyData);
        } catch (err) {
            console.error('Error cargando datos:', err);
        }
    };

    // 🔄 Auto load
    useEffect(() => {
        if (contract && propertyId && address) {
            loadData();
        }
    }, [contract, propertyId, address]);

    // 💎 Formato ETH
    const formatETH = (value: string) => {
        try {
            return ethers.formatEther(value);
        } catch {
            return '0';
        }
    };

    return (
        <AppLayout>
            <div style={{ padding: '20px', fontFamily: 'Arial' }}>
                <h1>🏠 Real Estate dApp</h1>

                {/* 🔌 Wallet */}
                <button onClick={connectWallet}>Conectar Wallet</button>

                {address && <p>👤 {address}</p>}

                <button onClick={createProperty}>Crear Propiedad</button>

                <hr />

                {/* 🎯 Inputs */}
                <input
                    type="number"
                    placeholder="Property ID"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Cantidad de tokens"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <br />
                <br />

                {/* ⚡ Acciones */}
                <button onClick={buyTokens} disabled={loading}>
                    Comprar Tokens
                </button>

                <button onClick={claim} disabled={loading || pending === '0'}>
                    {pending === '0' ? 'Sin ganancias' : 'Reclamar'}
                </button>

                <button onClick={distributeProfit} disabled={loading}>
                    Distribuir (0.001 ETH)
                </button>

                <hr />

                {/* 📊 DASHBOARD */}
                <h2>📊 Dashboard</h2>

                <p>🏠 Property ID: {propertyId || '-'}</p>

                <p>🪙 Tus tokens: {tokens}</p>

                <p>💰 Ganancias pendientes: {formatETH(pending)} ETH</p>

                {property && (
                    <div>
                        <p>
                            📦 Tokens restantes:{' '}
                            {property.totalTokens.toString()}
                        </p>
                        <p>
                            📈 Profit por token:{' '}
                            {property.profitPerToken.toString()}
                        </p>
                    </div>
                )}

                {loading && <p>⏳ Procesando transacción...</p>}
                <button className="btn btn-primary">Test</button>
            </div>
        </AppLayout>
    );
}
