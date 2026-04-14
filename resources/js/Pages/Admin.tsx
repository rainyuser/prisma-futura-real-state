import AppLayout from '@/AppLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { getContract } from '../contract';

export default function Admin() {
    const { properties = [], flash } = usePage<any>().props;

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, processing, reset } = useForm({
        title: '',
        description: '',
        price: '',
        image: null as File | null,
    });

    // 🧠 FORMAT PRICE
    const formatPrice = (value?: string | number) => {
        if (value === null || value === undefined || value === '')
            return '0.00';

        const num = Number(value);
        if (isNaN(num)) return '0.00';

        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // 📸 IMAGE
    const handleImage = (e: any) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // 🟢 CREATE PROPERTY
    const submit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const contract = await getContract();

            // ✅ Leer ANTES del TX — ese valor ES el ID que createProperty usará
            const currentId = await contract.nextPropertyId();
            const blockchainId = Number(currentId);

            const tx = await contract.createProperty();
            await tx.wait();

            router.post(
                '/properties',
                {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    image: data.image,
                    blockchain_id: String(blockchainId),
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        reset();
                        setPreview(null);
                    },
                    onError: (errors) => {
                        alert('Errors: ' + JSON.stringify(errors));
                    },
                    onFinish: () => setLoading(false),
                },
            );
        } catch (err: any) {
            console.error('Error:', err);
            alert('Error: ' + err.message);
            setLoading(false);
        }
    };

    // 🔴 DELETE
    const deleteProperty = (id: number) => {
        if (!confirm('Delete property?')) return;
        router.delete(`/properties/${id}`);
    };

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                {/* FLASH MESSAGE */}
                {flash?.success && (
                    <div className="alert alert-success shadow">
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* CREATE FORM */}
                <div className="card bg-base-100 max-w-md shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Create Property</h2>

                        <form onSubmit={submit} className="space-y-4">
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />

                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                required
                            />

                            <input
                                type="number"
                                className="input input-bordered w-full"
                                placeholder="Price"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                                required
                            />

                            <input
                                type="file"
                                onChange={handleImage}
                                className="file-input file-input-bordered w-full"
                                required
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    className="w-full rounded-xl border object-cover"
                                />
                            )}

                            <button
                                className={`btn btn-primary w-full ${
                                    loading ? 'loading' : ''
                                }`}
                                disabled={processing || loading}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST */}
                <div>
                    <h2 className="mb-4 text-xl font-bold">Properties</h2>

                    {properties.length === 0 && (
                        <div className="alert">
                            <span>No properties yet</span>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-3">
                        {properties.map((p: any) => (
                            <div
                                key={p.id}
                                className="card bg-base-100 shadow-xl"
                            >
                                <figure>
                                    <img
                                        src={p.image}
                                        className="h-48 w-full object-cover"
                                    />
                                </figure>

                                <div className="card-body">
                                    <h3 className="card-title">{p.title}</h3>

                                    <p className="text-sm opacity-80">
                                        {p.description}
                                    </p>

                                    <p className="text-primary font-semibold">
                                        ${formatPrice(p.price)}
                                    </p>

                                    <p className="text-xs opacity-60">
                                        ID: {p.blockchain_id}
                                    </p>

                                    <div className="card-actions justify-end">
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => deleteProperty(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
