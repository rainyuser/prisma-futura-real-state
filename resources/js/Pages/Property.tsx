import AppLayout from '@/AppLayout';
import { getContract } from '@/contract';
import type { PageProps } from '@/types/inertia';
import { usePage } from '@inertiajs/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

declare global {
    interface Window {
        ethereum?: ethers.Eip1193Provider;
    }
}

type PropertyData = {
    id: number;
    totalTokens: string;
    profitPerToken: string;
    balance: string;
    pending: string;
};

type DbProperty = {
    title: string;
    description: string;
    price: string;
    image: string | null;
};

type Props = PageProps & {
    id: number | string;
};

type ContractType = Awaited<ReturnType<typeof getContract>>;

export default function Property() {
    const { props } = usePage<Props>();
    const id = Number(props.id);

    const [contract, setContract] = useState<ContractType | null>(null);
    const [address, setAddress] = useState('');
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [dbProperty, setDbProperty] = useState<DbProperty | null>(null);

    const [amount, setAmount] = useState('');
    const [profitAmount, setProfitAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // 🧠 FORMATTERS
    const formatETH = (value: string) =>
        parseFloat(ethers.formatEther(value)).toLocaleString(undefined, {
            maximumFractionDigits: 6,
        });

    const formatProfitPerToken = (value: string) => {
        const raw = BigInt(value);
        const normalized = raw / 10n ** 18n;

        return parseFloat(ethers.formatEther(normalized)).toLocaleString(
            undefined,
            {
                maximumFractionDigits: 6,
            },
        );
    };

    const formatPrice = (value?: string) => {
        if (!value) return '0.00';

        const num = Number(value);
        if (isNaN(num)) return '0.00';

        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // 🔌 INIT WALLET (MEJORADO)
    const init = async () => {
        if (!window.ethereum) {
            alert('Install MetaMask');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);

            // 🔥 fuerza conexión wallet
            await provider.send('eth_requestAccounts', []);

            const signer = await provider.getSigner();
            const addr = await signer.getAddress();

            const c = await getContract();

            setAddress(addr);
            setContract(c);
        } catch (err) {
            console.error(err);
            alert('Wallet connection failed');
        }
    };

    // 🧾 DB
    const loadDbProperty = async () => {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        setDbProperty(data);
    };

    // 🔗 BLOCKCHAIN
    const loadProperty = async () => {
        if (!contract || !id || !address) return;

        const prop = await contract.properties(id);
        const balance = await contract.balances(id, address);
        const pending = await contract.getPendingProfit(id, address);

        setProperty({
            id,
            totalTokens: prop.totalTokens.toString(),
            profitPerToken: prop.profitPerToken.toString(),
            balance: balance.toString(),
            pending: pending.toString(),
        });
    };

    // 🟢 BUY
    const buy = async () => {
        if (!contract || !address) {
            alert('Connect wallet first');
            return;
        }

        if (!amount) return;

        setLoading(true);

        try {
            const tx = await contract.buyTokens(id, Number(amount));
            await tx.wait();
            await loadProperty();
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    // 💰 CLAIM (CON CHECK REAL DE WALLET)
    const claim = async () => {
        if (!contract || !address) {
            alert('Connect wallet first');
            await init();
            return;
        }

        setLoading(true);

        try {
            const tx = await contract.claim(id);
            await tx.wait();
            await loadProperty();
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    // 🧪 DEBUG
    const injectProfit = async () => {
        if (!contract) return;

        setLoading(true);

        try {
            const tx = await contract.distributeProfit(id, {
                value: ethers.parseEther(profitAmount || '0'),
            });

            await tx.wait();
            await loadProperty();
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        init();
        loadDbProperty();
    }, []);

    useEffect(() => {
        if (contract && address) {
            loadProperty();
        }
    }, [contract, address]);

    if (!property) {
        return (
            <AppLayout>
                <div className="flex justify-center p-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </AppLayout>
        );
    }

    const hasPending = property && BigInt(property.pending) > 0n;

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* 🧾 LEFT */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-xl">
                            {dbProperty?.image && (
                                <figure>
                                    <img
                                        src={dbProperty.image}
                                        className="h-64 w-full object-cover"
                                    />
                                </figure>
                            )}

                            <div className="card-body">
                                <h1 className="card-title text-2xl">
                                    {dbProperty?.title}
                                </h1>

                                <p className="opacity-80">
                                    {dbProperty?.description}
                                </p>

                                <div className="badge badge-primary">
                                    ${formatPrice(dbProperty?.price)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🔗 RIGHT */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* PROPERTY STATS */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Property Stats</h2>

                                <div className="stats stats-vertical lg:stats-horizontal shadow">
                                    <div className="stat">
                                        <div className="stat-title">ID</div>
                                        <div className="stat-value text-sm">
                                            {property.id}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">
                                            Available Tokens
                                        </div>
                                        <div className="stat-value text-primary">
                                            {property.totalTokens}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">
                                            Profit / Token
                                        </div>
                                        <div className="stat-value text-success text-lg">
                                            {formatProfitPerToken(
                                                property.profitPerToken,
                                            )}{' '}
                                            ETH
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* USER */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Your Position</h2>

                                <div className="stats shadow">
                                    <div className="stat">
                                        <div className="stat-title">Tokens</div>
                                        <div className="stat-value text-primary">
                                            {property.balance}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">
                                            Earnings
                                        </div>
                                        <div className="stat-value text-success text-lg">
                                            {formatETH(property.pending)} ETH
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body space-y-4">
                                <h2 className="card-title">Actions</h2>

                                <input
                                    type="number"
                                    placeholder="Token amount"
                                    className="input input-bordered"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                        onClick={buy}
                                    >
                                        Buy
                                    </button>

                                    <button
                                        className={`btn btn-success ${loading ? 'loading' : ''}`}
                                        onClick={claim}
                                        disabled={loading || !hasPending}
                                    >
                                        {hasPending ? 'Claim' : 'No earnings'}
                                    </button>
                                </div>

                                <div className="divider">Debug</div>

                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="ETH to distribute"
                                    className="input input-bordered"
                                    value={profitAmount}
                                    onChange={(e) =>
                                        setProfitAmount(e.target.value)
                                    }
                                />

                                <div className="flex justify-end">
                                    <button
                                        className={`btn btn-warning btn-sm ${loading ? 'loading' : ''}`}
                                        onClick={injectProfit}
                                    >
                                        Inject Profit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
