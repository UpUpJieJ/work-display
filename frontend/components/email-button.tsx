/**
 * Email Button Component
 * Click to copy email with friendly feedback
 */
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface EmailButtonProps {
    email: string;
    className?: string;
}

export function EmailButton({ email, className = "" }: EmailButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-1 hover:text-primary transition-colors ${className}`}
            title="点击复制邮箱"
        >
            {email}
            {copied ? (
                <Check className="w-3 h-3 text-green-500" />
            ) : (
                <Copy className="w-3 h-3" />
            )}
        </button>
    );
}
