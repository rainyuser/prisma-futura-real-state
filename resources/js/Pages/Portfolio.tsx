import AppLayout from '@/AppLayout';
import { Link } from '@inertiajs/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getContract } from '../contract';

export default function Portfolio() {
    const [contract, setContract] = useState<any>(null);
    const [address, setAddress] = useState('');
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const init = async () => {
        if (!(window as any).ethereum) return;

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();

        const c = await getContract();

        setAddress(addr);
        setContract(c);
    };

    const loadPortfolio = async () => {
        if (!contract || !address) return;

        setLoading(true);

        try {
            // 🧠 1. Traer propiedades de Laravel
            const res = await fetch('/api/properties');
            const dbProperties = await res.json();

            const list = [];

            for (const dbProp of dbProperties) {
                const id = dbProp.blockchain_id;

                const balance = await contract.balances(id, address);
                const pending = await contract.getPendingProfit(id, address);

                if (balance > 0n) {
                    list.push({
                        id,
                        title: dbProp.title,
                        image: dbProp.image,
                        tokens: balance.toString(),
                        pending: pending.toString(),
                    });
                }
            }

            setPortfolio(list);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (contract && address) {
            loadPortfolio();
        }
    }, [contract, address]);

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold">My Portfolio</h1>
                    <p className="text-sm break-all opacity-70">{address}</p>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && portfolio.length === 0 && (
                    <div className="alert">
                        <span>You don't have tokens in any property</span>
                    </div>
                )}

                {/* GRID */}
                <div className="grid gap-6 md:grid-cols-3">
                    {portfolio.map((p) => (
                        <div key={p.id} className="card bg-base-100 shadow-xl">
                            {/* IMAGE */}
                            {p.image && (
                                <figure>
                                    <img
                                        src={p.image}
                                        className="h-40 w-full object-cover"
                                    />
                                </figure>
                            )}

                            <div className="card-body">
                                {/* ✅ TITLE DESDE LARAVEL */}
                                <h2 className="card-title">{p.title}</h2>

                                <p className="text-xs opacity-60">ID: {p.id}</p>

                                {/* STATS */}
                                <div className="stats shadow">
                                    <div className="stat">
                                        <div className="stat-title">Tokens</div>
                                        <div className="stat-value text-primary">
                                            {p.tokens}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">
                                            Pending
                                        </div>
                                        <div className="stat-value text-success text-lg">
                                            {ethers.formatEther(p.pending)}
                                        </div>
                                        <div className="stat-desc">ETH</div>
                                    </div>
                                </div>

                                {/* ✅ BUTTON */}
                                <div className="card-actions justify-end">
                                    <Link
                                        href={`/property/${p.id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
