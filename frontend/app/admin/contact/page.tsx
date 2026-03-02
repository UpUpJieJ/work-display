/**
 * Contact Messages Admin Page
 * Display and manage contact form submissions
 */
"use client";

import { useEffect, useState } from "react";
import { getContactSubmissions, getProfile, ContactSubmission } from "@/lib/admin-api";
import { Profile } from "@/lib/types";
import { Mail, MessageSquare, Calendar, User, Loader2, Copy, Reply, Check } from "lucide-react";

export default function ContactPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [submissionsData, profileData] = await Promise.all([
                getContactSubmissions(),
                getProfile(),
            ]);
            setSubmissions(submissionsData);
            setProfile(profileData);
            setError(null);
        } catch (err) {
            setError("加载数据失败");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            setCopiedEmail(email);
            setTimeout(() => setCopiedEmail(null), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }
    };

    const handleReply = () => {
        if (!selectedSubmission) return;

        // 跳转到 QQ 邮箱
        window.open("https://mail.qq.com/", "_blank");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">联系消息</h1>
                <span className="text-sm text-muted-foreground">
                    共 {submissions.length} 条消息
                </span>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无联系消息</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((submission) => (
                        <div
                            key={submission.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${selectedSubmission?.id === submission.id ? "border-primary bg-muted" : ""
                                }`}
                            onClick={() => setSelectedSubmission(submission)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{submission.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <Mail className="w-4 h-4" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyEmail(submission.email);
                                            }}
                                            className="hover:underline flex items-center gap-1"
                                        >
                                            {submission.email}
                                            {copiedEmail === submission.email ? (
                                                <Check className="w-3 h-3 text-green-500" />
                                            ) : (
                                                <Copy className="w-3 h-3" />
                                            )}
                                        </button>
                                    </div>
                                    {submission.subject && (
                                        <p className="font-medium mb-1">{submission.subject}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {submission.message}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(submission.submitted_at)}
                                </div>
                            </div>

                            {selectedSubmission?.id === submission.id && (
                                <div className="mt-4 pt-4 border-t">
                                    <h3 className="font-medium mb-2">完整消息内容:</h3>
                                    <p className="whitespace-pre-wrap text-sm bg-muted p-3 rounded">
                                        {submission.message}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReply();
                                            }}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
                                        >
                                            <Reply className="w-4 h-4" />
                                            回复邮件
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
