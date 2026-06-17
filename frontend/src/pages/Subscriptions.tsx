import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { 
  CreditCard, CheckCircle2, ShieldAlert, Sparkles, 
  HelpCircle, RefreshCw, Layers, Lock
} from 'lucide-react';

export default function Subscriptions() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState<any>(null);

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      const response = await axios.get('/api/subscriptions/status');
      setBillingInfo(response.data);
    } catch (err) {
      console.warn("API Offline, populating mock billing details");
      setBillingInfo({
        subscription: {
          plan: "free",
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          aiUsageLimit: 20,
          aiUsageCount: 4,
          maxStartups: 1
        },
        payments: []
      });
    }
  };

  const handleUpgrade = async (plan: 'starter' | 'pro' | 'enterprise') => {
    setLoading(true);
    try {
      const response = await axios.post('/api/subscriptions/checkout', { plan });
      alert(`Upgraded to ${plan} successfully! Check your payment history below.`);
      fetchBilling();
    } catch (err) {
      alert("Error upgrading plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to downgrade to the Free tier? Your AI limits will reset.")) return;
    setLoading(true);
    try {
      await axios.post('/api/subscriptions/cancel');
      alert("Subscription canceled successfully.");
      fetchBilling();
    } catch (err) {
      alert("Error canceling subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold font-display">Subscription Portal</h1>
        <p class="text-xs text-textSecondary mt-1">Upgrade your tier structure to increase AI agent validation usage limits and unlock team seats.</p>
      </div>

      {billingInfo && (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Subscription status */}
          <div class="glass-panel p-6 rounded-2xl h-fit space-y-4">
            <h3 class="font-display font-bold text-sm uppercase tracking-wider flex items-center">
              <CreditCard class="h-4 w-4 mr-2 text-primary" />
              Active Subscription
            </h3>
            
            <div class="p-4 bg-surface rounded-xl border border-borderBg space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs text-textSecondary font-semibold">Current Plan:</span>
                <span class="text-xs font-extrabold uppercase text-primary tracking-wider">{billingInfo.subscription.plan}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-textSecondary font-semibold">Billing Status:</span>
                <span class="text-[9px] px-2 py-0.5 rounded bg-success/20 text-success font-extrabold uppercase tracking-wider">{billingInfo.subscription.status}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-textSecondary font-semibold">Renewal Date:</span>
                <span class="text-white font-medium">{new Date(billingInfo.subscription.currentPeriodEnd).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Progress indicators */}
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-[10px] text-textSecondary uppercase font-bold mb-1">
                  <span>AI tokens used</span>
                  <span>{billingInfo.subscription.aiUsageCount} / {billingInfo.subscription.aiUsageLimit} Scans</span>
                </div>
                <div class="w-full bg-[#1b212c] h-1.5 rounded-full overflow-hidden">
                  <div 
                    class="bg-primary h-full rounded-full transition-all" 
                    style={{ width: `${(billingInfo.subscription.aiUsageCount / billingInfo.subscription.aiUsageLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {billingInfo.subscription.plan !== 'free' && (
              <button
                onClick={handleCancel}
                disabled={loading}
                class="w-full py-2 bg-transparent hover:bg-error/10 border border-error/30 text-error font-semibold text-xs rounded-lg transition-all"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Pricing tier updates */}
          <div class="md:col-span-2 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Starter Upgrade Card */}
              <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div class="space-y-1.5">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-primary">Upgrade Option</span>
                  <h4 class="font-display text-lg font-bold text-white">Starter Accelerator</h4>
                  <p class="text-[10px] text-textSecondary leading-relaxed">Boost validation limit caps to 100 scans, generate complete product spec roadmap files.</p>
                  <span class="text-xl font-extrabold text-white block pt-1">$29 <span class="text-xs font-normal text-textSecondary">/mo</span></span>
                </div>
                <button
                  onClick={() => handleUpgrade('starter')}
                  disabled={loading || billingInfo.subscription.plan === 'starter'}
                  class="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-black font-semibold text-xs transition-all disabled:opacity-50"
                >
                  {billingInfo.subscription.plan === 'starter' ? "Current Plan" : "Upgrade to Starter"}
                </button>
              </div>

              {/* Pro Upgrade Card */}
              <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-primary/30 relative">
                <div class="absolute top-2 right-2 bg-primary text-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded">Popular</div>
                <div class="space-y-1.5">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-primary">Upgrade Option</span>
                  <h4 class="font-display text-lg font-bold text-white">Pro Accelerator</h4>
                  <p class="text-[10px] text-textSecondary leading-relaxed">Increase limit caps to 500 scans, enable VC matching marketplace pitch decks submissions.</p>
                  <span class="text-xl font-extrabold text-white block pt-1">$79 <span class="text-xs font-normal text-textSecondary">/mo</span></span>
                </div>
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={loading || billingInfo.subscription.plan === 'pro'}
                  class="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-black font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
                >
                  {billingInfo.subscription.plan === 'pro' ? "Current Plan" : "Upgrade to Pro"}
                </button>
              </div>
            </div>

            {/* Payment invoice list */}
            <div class="glass-panel p-6 rounded-2xl space-y-4">
              <h3 class="font-display font-bold text-sm uppercase tracking-wider">Payment History Receipts</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-borderBg text-textSecondary uppercase text-[9px] tracking-wider">
                      <th class="pb-3 pr-2">Date</th>
                      <th class="pb-3 pr-2">Invoice Ref</th>
                      <th class="pb-3 pr-2">Plan</th>
                      <th class="pb-3 pr-2">Amount</th>
                      <th class="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingInfo.payments.map((p: any, idx: number) => (
                      <tr key={idx} class="border-b border-borderBg/50 hover:bg-surface/20">
                        <td class="py-3 pr-2 text-textSecondary">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td class="py-3 pr-2 text-textSecondary">{p.stripePaymentIntentId}</td>
                        <td class="py-3 pr-2 font-semibold text-white uppercase">{p.plan}</td>
                        <td class="py-3 pr-2 text-white">${p.amount}</td>
                        <td class="py-3">
                          <span class="px-2 py-0.5 rounded bg-success/20 text-success text-[9px] font-bold uppercase">{p.status}</span>
                        </td>
                      </tr>
                    ))}
                    {billingInfo.payments.length === 0 && (
                      <tr>
                        <td colSpan={5} class="text-center py-6 text-textSecondary">No payments recorded. Upgrade to write billing logs.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
