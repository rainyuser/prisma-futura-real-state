//import Footer from '@/components/Footer';
//import Header from '@/components/Header';
import logo from '@/assets/Logotipo.png';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                {/* Mobile viewport */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />

                {/* Browser compatibility & theme color */}
                <meta name="theme-color" content="#ffffff" />

                {/* Apple iOS web app */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="Prisma Futura"
                />

                {/* Android */}
                <meta name="mobile-web-app-capable" content="yes" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />

                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>

            {/*<Header />*/}

            <main className="font-libreBaskerville w-dvw flex-1 overflow-x-hidden bg-white">
                <div className="drawer lg:drawer-open">
                    <input
                        id="my-drawer-3"
                        type="checkbox"
                        className="drawer-toggle"
                    />
                    <div className="drawer-content flex flex-col items-center justify-center">
                        {/* Page content here */}
                        <label
                            htmlFor="my-drawer-3"
                            className="btn drawer-button lg:hidden"
                        >
                            Open drawer
                        </label>
                        <div className="bg-base-300 h-screen w-full overflow-x-hidden overflow-y-auto">
                            {children}
                        </div>
                    </div>
                    <div className="drawer-side">
                        <label
                            htmlFor="my-drawer-3"
                            aria-label="close sidebar"
                            className="drawer-overlay"
                        ></label>

                        <ul className="menu bg-base-200 min-h-full w-80 p-4">
                            <li className="my-20">
                                <img className="mx-auto w-50" src={logo} />
                            </li>

                            {/* Sidebar content */}
                            <li>
                                <Link href={'/portfolio'}>Portfolio</Link>
                            </li>
                            <li>
                                <Link href={'/properties'}>Properties</Link>
                            </li>
                            <li>
                                <Link href={'/admin'}>Admin</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            {/*<WhatsApp />
            {/*<Footer />*/}
        </>
    );
}
