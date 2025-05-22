import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Terms of Service</h1>
        <p className="text-white/60 mb-12 text-center">Last updated: {currentDate}</p>
        
        <div className="space-y-8 text-white/80">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Da Costa Music website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Use of the Site</h2>
            <p>
              You agree to use the website for lawful purposes only and not to infringe the rights of others or restrict their use of the site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Intellectual Property</h2>
            <p>
              All content on the site, including text, images, logos, and other materials, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without prior authorization.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Limitation of Liability</h2>
            <p>
              The Da Costa Music website is provided "as is" without any warranties. We do not guarantee that the site will be available uninterrupted or error-free.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will take effect immediately upon being posted on the site. You are encouraged to review the terms regularly.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and interpreted in accordance with the laws of the European Union and the jurisdiction in which our operations are based.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, contact us at:<br />
              Email: <a href="mailto:socials@dacosta-music.com" className="text-white hover:underline">socials@dacosta-music.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 