/**
 * Contact Page Component
 */
import { ContactForm } from '@/components/contact/contact-form';
import { fetchProfile } from '@/lib/api';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { EmailButton } from '@/components/email-button';

export default async function ContactPage() {
  const profile = await fetchProfile();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">联系我</h1>
          <p className="text-lg text-muted-foreground">
            如果您有任何问题或合作意向，欢迎随时与我联系
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">联系方式</h2>
              <div className="space-y-4">
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">邮箱</p>
                      <EmailButton
                        email={profile.email}
                        className="text-foreground"
                      />
                    </div>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">位置</p>
                      <p className="text-foreground">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {profile.social_links.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">社交媒体</h2>
                <div className="space-y-3">
                  {profile.social_links.map((link: any) => {
                    const Icon =
                      link.icon === 'github'
                        ? Github
                        : link.icon === 'linkedin'
                          ? Linkedin
                          : Mail;
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {link.platform}
                          </p>
                          <p className="text-foreground font-medium">
                            {link.display_name || link.url}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">发送消息</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
