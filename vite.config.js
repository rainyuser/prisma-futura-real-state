import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            // Limitar las rutas que Vite vigila
            refreshPaths: [
                'resources/views/**',
                'resources/js/**',
                'routes/**',
                'app/Http/Controllers/**'
            ],
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // Permite conexiones externas
        port: 5173,
        strictPort: true,
        // Configuración crítica para VPS
        watch: {
            // Usar polling en lugar de eventos del sistema
            usePolling: true,
            // Intervalo de polling en ms
            interval: 2000,
            // Intervalo binario para directorios
            binaryInterval: 3000,
            // Ignorar carpetas pesadas
            ignored: [
                '**/vendor/**',
                '**/node_modules/**',
                '**/storage/**',
                '**/bootstrap/cache/**',
                '**/.git/**',
                '**/public/build/**',
                '**/public/hot/**',
                '**/tests/**',
                '**/database/**'
            ]
        },
        // Prevenir errores CORS si es necesario
        cors: true,
        // Optimización para desarrollo remoto
        hmr: {
            host: 'prisma-futura.com', // O la IP de tu VPS
            protocol: 'ws',
        },
    },
    // Optimizar dependencias
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@inertiajs/react',
            '@inertiajs/react/server'
        ],
        // Excluir dependencias que causan problemas
        exclude: ['@inertiajs/ssr'],
    },
    // Configuración para SSR
    ssr: {
        noExternal: ['@inertiajs/server'],
    },
    // Definir variables de entorno
    define: {
        'process.env.VITE_USE_POLLING': true,
    },
});