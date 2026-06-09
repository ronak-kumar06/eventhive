export default function PricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Simple, transparent pricing</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            No hidden fees. No surprise charges. Choose the plan that best fits your club's needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-background/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <p className="text-foreground/50 mb-6">For small clubs and societies.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-foreground/50">/month</span>
            </div>
            <ul className="space-y-4 mb-8 text-foreground">
              <li className="flex items-center gap-2">✓ Up to 5 events/month</li>
              <li className="flex items-center gap-2">✓ 1GB media storage</li>
              <li className="flex items-center gap-2">✓ Basic analytics</li>
              <li className="flex items-center gap-2">✓ Standard support</li>
            </ul>
            <button className="w-full py-3 rounded-full border border-white/20 hover:bg-background/10 transition-colors font-medium">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-blue-500/20 to-[#C1D5C0]/20 border border-blue-500/50 rounded-3xl p-8 backdrop-blur-xl relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-500 text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-foreground/50 mb-6">For active campus organizations.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-foreground/50">/month</span>
            </div>
            <ul className="space-y-4 mb-8 text-foreground">
              <li className="flex items-center gap-2">✓ Unlimited events</li>
              <li className="flex items-center gap-2">✓ 100GB media storage</li>
              <li className="flex items-center gap-2">✓ AI facial recognition</li>
              <li className="flex items-center gap-2">✓ Advanced analytics</li>
              <li className="flex items-center gap-2">✓ Priority support</li>
            </ul>
            <button className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-foreground transition-colors font-medium">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-background/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-foreground/50 mb-6">For universities and student unions.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            <ul className="space-y-4 mb-8 text-foreground">
              <li className="flex items-center gap-2">✓ Unlimited everything</li>
              <li className="flex items-center gap-2">✓ Custom domain setup</li>
              <li className="flex items-center gap-2">✓ White-label platform</li>
              <li className="flex items-center gap-2">✓ SSO Integration</li>
              <li className="flex items-center gap-2">✓ 24/7 Phone support</li>
            </ul>
            <button className="w-full py-3 rounded-full border border-white/20 hover:bg-background/10 transition-colors font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
