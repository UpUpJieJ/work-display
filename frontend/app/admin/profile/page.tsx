/**
 * Admin Profile Edit Page
 */
"use client";

import { useEffect, useState } from "react";
import { Profile, SocialLink } from "@/lib/types";
import { Save, Eye } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("获取个人资料失败");

      const data: Profile = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载个人资料失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "保存个人资料失败");
      }

      setMessage("个人资料保存成功！");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存个人资料失败");
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const links = (profile.social_links as SocialLink[] | undefined) || [];
    const newLinks = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setProfile({
      ...profile,
      social_links: newLinks,
    });
  };

  const addSocialLink = () => {
    const links = (profile.social_links as SocialLink[] | undefined) || [];
    setProfile({
      ...profile,
      social_links: [
        ...links,
        { platform: "", url: "", icon: "", display_name: "" },
      ],
    });
  };

  const removeSocialLink = (index: number) => {
    const links = (profile.social_links as SocialLink[] | undefined) || [];
    const newLinks = links.filter((_, i) => i !== index);
    setProfile({
      ...profile,
      social_links: newLinks,
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...(profile.experience || [])];
    newExp[index] = { ...newExp[index], [field]: value };
    setProfile({ ...profile, experience: newExp });
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">编辑个人资料</h1>
        <a
          href="/about"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-muted dark:hover:bg-gray-700"
        >
          <Eye className="w-4 h-4" />
          预览
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-sm">
            {message}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                姓名 *
              </label>
              <input
                id="name"
                type="text"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                职位 *
              </label>
              <input
                id="title"
                type="text"
                value={profile.title || ""}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium mb-2">
                标语
              </label>
              <input
                id="tagline"
                type="text"
                value={profile.tagline || ""}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              个人简介 *
            </label>
            <textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">社交链接</h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-sm text-primary hover:underline"
            >
              新增链接
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            示例：platform 填 GitHub / LinkedIn / Email，url 填实际链接，icon 可选（如 github、linkedin 等），display_name 为展示名称。
          </p>
          <div className="space-y-4">
            {((profile.social_links as SocialLink[] | undefined) || []).map(
              (link, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start"
                >
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) =>
                      updateSocialLink(index, "platform", e.target.value)
                    }
                    placeholder="平台（如 GitHub）"
                    className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(index, "url", e.target.value)
                    }
                    placeholder="链接地址"
                    className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 md:col-span-2"
                  />
                  <input
                    type="text"
                    value={link.icon || ""}
                    onChange={(e) =>
                      updateSocialLink(index, "icon", e.target.value)
                    }
                    placeholder="图标（可选）"
                    className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={link.display_name || ""}
                      onChange={(e) =>
                        updateSocialLink(index, "display_name", e.target.value)
                      }
                      placeholder="显示名称"
                      className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="px-3 py-2 text-xs border border-destructive text-destructive rounded-md hover:bg-destructive/10"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )
            )}
            {(((profile.social_links as SocialLink[] | undefined) || []).length ===
              0) && (
              <p className="text-xs text-muted-foreground">
                暂无社交链接，点击「新增链接」开始添加。
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : "保存修改"}
          </button>
        </div>
      </form>
    </div>
  );
}
