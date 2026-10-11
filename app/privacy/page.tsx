import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Privacy Policy</h1>
        <p className="text-white/60 mb-12 text-center">Last updated: {currentDate}</p>
        
        <div className="space-y-8 text-white/80">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>
              This Privacy Policy explains how we collect, use, and protect your personal data when you use the Da Costa Music website. By using our site, you agree to the terms of this policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p>
              We may collect the following personal information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Contact details</li>
              <li>Usage and browsing data (e.g., IP address, browser type)</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p>
              The information we collect is used to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and maintain our services</li>
              <li>Improve user experience</li>
              <li>Send relevant communications</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Sharing of Information</h2>
            <p>
              We do not share your personal information with third parties unless required by law or with your explicit consent.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
            <p>
              Under the GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request the deletion of your information</li>
              <li>Restrict or object to processing</li>
              <li>Port your data to another service</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Marketing Cookies and Meta Pixel</h2>
            <p>
              Essential browser storage keeps your shopping cart available. If you accept marketing cookies, we load the Meta Pixel to measure page visits and advertising performance on Facebook and Instagram. Meta receives browsing data, including page URLs, browser information and cookie identifiers. We do not load the Pixel before you accept marketing cookies.
            </p>
            <p className="mt-3">
              You can reject marketing cookies or withdraw your consent through Cookie settings in the website footer. Rejecting marketing cookies does not prevent you from using the shop.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">8. International Data Transfers</h2>
            <p>
              If we transfer your data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place as required by the GDPR.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We recommend reviewing this page regularly to stay informed about any changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, contact us at:<br />
              Email: <a href="mailto:socials@dacosta-music.com" className="text-white hover:underline">socials@dacosta-music.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
