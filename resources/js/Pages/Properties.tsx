import AppLayout from '@/AppLayout';
import { Link } from '@inertiajs/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getContract } from '../contract';

export default function Properties() {
    const [contract, setContract] = useState<any>(null);
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 🔥 FORMATTERS
    const formatNumber = (value: string) => Number(value).toLocaleString();

    const formatProfitPerToken = (value: string) => {
        try {
            const raw = BigInt(value);

            // ⚠️ quitar escala del contrato (1e18)
            const normalized = raw / 10n ** 18n;

            return Number(ethers.formatEther(normalized)).toLocaleString(
                undefined,
                { maximumFractionDigits: 6 },
            );
        } catch {
            return '0';
        }
    };

    // 🔌 INIT CONTRACT
    const init = async () => {
        const c = await getContract();
        setContract(c);
    };

    // 📡 LOAD DATA
    const loadProperties = async () => {
        if (!contract) return;

        setLoading(true);

        try {
            const res = await fetch('/api/properties');
            const dbProperties = await res.json();

            const list = [];

            for (const dbProp of dbProperties) {
                const prop = await contract.properties(dbProp.blockchain_id);

                if (!prop.exists) continue;

                list.push({
                    id: dbProp.blockchain_id,
                    totalTokens: prop.totalTokens.toString(),
                    profitPerToken: prop.profitPerToken.toString(),
                    title: dbProp.title,
                    image: dbProp.image,
                });
            }

            setProperties(list);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (contract) loadProperties();
    }, [contract]);

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl space-y-6 p-6">
                {/* HEADER */}
                <h1 className="text-2xl font-bold">Properties</h1>

                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && properties.length === 0 && (
                    <div className="alert">
                        <span>No properties available</span>
                    </div>
                )}

                {/* GRID */}
                <div className="grid gap-6 md:grid-cols-3">
                    {properties.map((p) => (
                        <div key={p.id} className="card bg-base-100 shadow-xl">
                            {/* IMAGE */}
                            <figure>
                                {p.image && (
                                    <img
                                        src={p.image}
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                            </figure>

                            <div className="card-body">
                                {/* TITLE */}
                                <h2 className="card-title">{p.title}</h2>

                                {/* STATS */}
                                <div className="stats stats-vertical shadow">
                                    <div className="stat">
                                        <div className="stat-title">ID</div>
                                        <div className="stat-value text-sm">
                                            {p.id}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">Tokens</div>
                                        <div className="stat-value text-primary text-lg">
                                            {formatNumber(p.totalTokens)}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">
                                            Profit / Token
                                        </div>
                                        <div className="stat-value text-success text-lg">
                                            {formatProfitPerToken(
                                                p.profitPerToken,
                                            )}{' '}
                                            ETH
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="card-actions mt-4 justify-end">
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
