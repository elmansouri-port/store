import { PricingBento, PricingPlan } from '@/components/ui/bento-pricing-component';

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started and personal projects.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: '1 User', included: true },
      { text: '500 MB Storage', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Community Support', included: true },
      { text: 'Custom Domain', included: false },
      { text: 'Advanced Security', included: false },
    ],
    ctaText: 'Get Started Free',
    gridClasses: 'lg:col-span-1', // Default 1 column span on large screens
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Unlock essential features for small teams and growing needs.',
    monthlyPrice: 19,
    yearlyPrice: 199, // ~16.58/month, so savings: (19 - 16.58) / 19 = ~12.7%
    features: [
      { text: '5 Users', included: true },
      { text: '5 GB Storage', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Email Support', included: true },
      { text: 'Custom Domain', included: false },
      { text: 'Priority Support', included: false },
      { text: 'API Access', included: false },
    ],
    ctaText: 'Start 14-day Free Trial',
    gridClasses: 'lg:col-span-1', // Default 1 column span on large screens
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Everything you need for growing businesses and serious projects.',
    monthlyPrice: 49,
    yearlyPrice: 499, // ~41.58/month, so savings: (49 - 41.58) / 49 = ~15.2%
    features: [
      { text: 'Unlimited Users', included: true },
      { text: '50 GB Storage', included: true },
      { text: 'Real-time Analytics & Reporting', included: true },
      { text: 'Priority Email & Chat Support', included: true },
      { text: 'Custom Domain', included: true },
      { text: 'Dedicated Account Manager', included: false },
      { text: 'Advanced Security & SSO', included: true },
      { text: 'Full API Access', included: true },
    ],
    isPopular: true,
    popularBadgeText: 'Recommended',
    // This plan spans 2 columns on medium, large and extra-large screens
    // This creates the bento effect by making it visually larger.
    gridClasses: 'md:col-span-2 lg:col-span-2 xl:col-span-2',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions and dedicated support for large organizations.',
    monthlyPrice: 99, // Placeholder for display
    yearlyPrice: 999, // Placeholder for display
    features: [
      { text: 'Unlimited Users & Storage', included: true },
      { text: 'Advanced Security & Compliance', included: true },
      { text: '24/7 Phone & On-site Support', included: true },
      { text: 'Dedicated Account Manager', included: true },
      { text: 'Custom Integrations & SLAs', included: true },
      { text: 'SAML SSO & Audit Logs', included: true },
      { text: 'White-glove Onboarding', included: true },
    ],
    ctaText: 'Contact Sales',
    gridClasses: 'md:col-span-2 lg:col-span-2 xl:col-span-4',
  },
];

export default function PricingBentoDemo() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <PricingBento plans={pricingPlans} />
    </div>
  );
}
