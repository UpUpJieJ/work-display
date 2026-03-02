/**
 * Global Error Boundary
 * Catches errors in the application
 */
'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">出现了一些问题</h2>
                <p className="text-muted-foreground mb-6">
                    抱歉，页面加载时发生了错误。请尝试刷新页面。
                </p>
                {error.digest && (
                    <p className="text-sm text-muted-foreground mb-4">
                        错误代码: {error.digest}
                    </p>
                )}
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    刷新页面
                </button>
            </div>
        </div>
    );
}
