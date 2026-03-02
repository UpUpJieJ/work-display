/**
 * 404 Not Found Page
 */
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
                <p className="text-muted-foreground mb-6">
                    抱歉，您访问的页面不存在或已被移除。
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    返回首页
                </Link>
            </div>
        </div>
    );
}
