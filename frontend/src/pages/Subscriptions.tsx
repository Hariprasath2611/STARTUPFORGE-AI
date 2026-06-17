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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">Subscription Portal</h1>
        <p className="text-xs text-textSecondary mt-1">Upgrade your tier structure to increase AI agent validation usage limits and unlock team seats.</p>
      </div>

      {billingInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Subscription status */}
          <div className="glass-panel p-6 rounded-2xl h-fit space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              Active Subscription
            </h3>
            
            <div className="p-4 bg-surface rounded-xl border border-borderBg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-textSecondary font-semibold">Current Plan:</span>
                <span className="text-xs font-extrabold uppercase text-primary tracking-wider">{billingInfo.subscription.plan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-textSecondary font-semibold">Billing Status:</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-success/20 text-success font-extrabold uppercase tracking-wider">{billingInfo.subscription.status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-textSecondary font-semibold">Renewal Date:</span>
                <span className="text-white font-medium">{new Date(billingInfo.subscription.currentPeriodEnd).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] text-textSecondary uppercase font-bold mb-1">
                  <span>AI tokens used</span>
                  <span>{billingInfo.subscription.aiUsageCount} / {billingInfo.subscription.aiUsageLimit} Scans</span>
                </div>
                <div className="w-full bg-[#1b212c] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all" 
                    style={{ width: `${(billingInfo.subscription.aiUsageCount / billingInfo.subscription.aiUsageLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {billingInfo.subscription.plan !== 'free' && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full py-2 bg-transparent hover:bg-error/10 border border-error/30 text-error font-semibold text-xs rounded-lg transition-all"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Pricing tier updates */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Starter Upgrade Card */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Upgrade Option</span>
                  <h4 className="font-display text-lg font-bold text-white">Starter Accelerator</h4>
                  <p className="text-[10px] text-textSecondary leading-relaxed">Boost validation limit caps to 100 scans, generate complete product spec roadmap files.</p>
                  <span className="text-xl font-extrabold text-white block pt-1">$29 <span className="text-xs font-normal text-textSecondary">/mo</span></span>
                </div>
                <button
                  onClick={() => handleUpgrade('starter')}
                  disabled={loading || billingInfo.subscription.plan === 'starter'}
                  className="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-black font-semibold text-xs transition-all disabled:opacity-50"
                >
                  {billingInfo.subscription.plan === 'starter' ? "Current Plan" : "Upgrade to Starter"}
                </button>
              </div>

              {/* Pro Upgrade Card */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-primary/30 relative">
                <div className="absolute top-2 right-2 bg-primary text-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded">Popular</div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Upgrade Option</span>
                  <h4 className="font-display text-lg font-bold text-white">Pro Accelerator</h4>
                  <p className="text-[10px] text-textSecondary leading-relaxed">Increase limit caps to 500 scans, enable VC matching marketplace pitch decks submissions.</p>
                  <span className="text-xl font-extrabold text-white block pt-1">$79 <span className="text-xs font-normal text-textSecondary">/mo</span></span>
                </div>
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={loading || billingInfo.subscription.plan === 'pro'}
                  className="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-black font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
                >
                  {billingInfo.subscription.plan === 'pro' ? "Current Plan" : "Upgrade to Pro"}
                </button>
              </div>
            </div>

            {/* Payment invoice list */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Payment History Receipts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-borderBg text-textSecondary uppercase text-[9px] tracking-wider">
                      <th className="pb-3 pr-2">Date</th>
                      <th className="pb-3 pr-2">Invoice Ref</th>
                      <th className="pb-3 pr-2">Plan</th>
                      <th className="pb-3 pr-2">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingInfo.payments.map((p: any, idx: number) => (
                      <tr key={idx} className="border-b border-borderBg/50 hover:bg-surface/20">
                        <td className="py-3 pr-2 text-textSecondary">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 pr-2 text-textSecondary">{p.stripePaymentIntentId}</td>
                        <td className="py-3 pr-2 font-semibold text-white uppercase">{p.plan}</td>
                        <td className="py-3 pr-2 text-white">${p.amount}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-success/20 text-success text-[9px] font-bold uppercase">{p.status}</span>
                        </td>
                      </tr>
                    ))}
                    {billingInfo.payments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-textSecondary">No payments recorded. Upgrade to write billing logs.</td>
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
