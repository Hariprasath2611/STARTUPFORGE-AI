import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Wallet, ShieldAlert, Sparkles, 
  HelpCircle, RefreshCw, BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function SimulationEngine() {
  // Numeric controls
  const [capital, setCapital] = useState(150000);
  const [monthlySpend, setMonthlySpend] = useState(12000);
  const [baseRevenue, setBaseRevenue] = useState(3000);
  const [growthRate, setGrowthRate] = useState(15); // %
  const [cac, setCac] = useState(60); // $

  const [scenario, setScenario] = useState<'average' | 'best' | 'worst'>('average');
  const [chartData, setChartData] = useState<any[]>([]);
  const [runwayMonths, setRunwayMonths] = useState(12);
  const [netBurn, setNetBurn] = useState(9000);

  useEffect(() => {
    calculateProjections();
  }, [capital, monthlySpend, baseRevenue, growthRate, cac, scenario]);

  const calculateProjections = () => {
    let currentCash = capital;
    let currentRevenue = baseRevenue;
    
    // Growth adjustments based on scenario
    let revenueMultiplier = 1 + (growthRate / 100);
    let spendMultiplier = 1.02; // inflation/team growth
    
    if (scenario === 'best') {
      revenueMultiplier = 1 + ((growthRate * 1.4) / 100);
      spendMultiplier = 1.01;
    } else if (scenario === 'worst') {
      revenueMultiplier = 1 + ((growthRate * 0.5) / 100);
      spendMultiplier = 1.04;
    }

    const dataPoints = [];
    let monthsOfSurvival = 0;
    let survivalChecked = false;

    for (let month = 1; month <= 12; month++) {
      const netMonthlyBurn = monthlySpend - currentRevenue;
      currentCash = currentCash - netMonthlyBurn;

      if (currentCash < 0) {
        currentCash = 0;
      } else if (!survivalChecked) {
        monthsOfSurvival = month;
      }

      dataPoints.push({
        name: `Month ${month}`,
        CashBalance: Math.round(currentCash),
        MonthlyRevenue: Math.round(currentRevenue),
        MonthlySpend: Math.round(monthlySpend * Math.pow(spendMultiplier, month))
      });

      // Update values for next round
      currentRevenue = currentRevenue * revenueMultiplier;
    }

    if (currentCash > 0) {
      setRunwayMonths(12); // Survived the year
    } else {
      setRunwayMonths(monthsOfSurvival);
    }

    setNetBurn(Math.round(monthlySpend - baseRevenue));
    setChartData(dataPoints);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">Startup Simulation Engine</h1>
        <p className="text-xs text-textSecondary mt-1">Stress-test your financial model. Toggle between scenarios to map cash depletion curves.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Param inputs panel */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-5">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center">
            <Wallet className="h-4 w-4 mr-2 text-primary" />
            Financial Inputs
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-textSecondary font-semibold uppercase tracking-wider mb-2">Starting Capital ($)</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full form-input"
              />
            </div>
            <div>
              <label className="block text-textSecondary font-semibold uppercase tracking-wider mb-2">Monthly Expenses ($)</label>
              <input
                type="number"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full form-input"
              />
            </div>
            <div>
              <label className="block text-textSecondary font-semibold uppercase tracking-wider mb-2">Starting Monthly Revenue ($)</label>
              <input
                type="number"
                value={baseRevenue}
                onChange={(e) => setBaseRevenue(Number(e.target.value))}
                className="w-full form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-textSecondary font-semibold uppercase tracking-wider mb-2">Revenue Growth (%)</label>
                <input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  className="w-full form-input"
                />
              </div>
              <div>
                <label className="block text-textSecondary font-semibold uppercase tracking-wider mb-2">Target CAC ($)</label>
                <input
                  type="number"
                  value={cac}
                  onChange={(e) => setCac(Number(e.target.value))}
                  className="w-full form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projections charts panels */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Estimated Runway</span>
              <h3 className={`font-display text-2xl font-extrabold mt-2 ${runwayMonths >= 12 ? 'text-success' : 'text-error'}`}>
                {runwayMonths >= 12 ? "12+ Months" : `${runwayMonths} Months`}
              </h3>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Current Net Burn</span>
              <h3 className="font-display text-2xl font-extrabold text-white mt-2">${netBurn}/mo</h3>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Target valuation</span>
              <h3 className="font-display text-2xl font-extrabold text-primary mt-2">
                ${Math.round(baseRevenue * 12 * (scenario === 'best' ? 15 : 8) / 1000) * 1000}
              </h3>
            </div>
          </div>

          {/* Chart visual block */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Runway Projections Curve</h3>
              <div className="flex space-x-1.5 text-[10px] font-semibold">
                {[
                  { id: 'worst', label: 'Worst Case' },
                  { id: 'average', label: 'Average Case' },
                  { id: 'best', label: 'Best Case' }
                ].map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc.id as any)}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      scenario === sc.id 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'border-borderBg hover:bg-surface/50 text-textSecondary'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B3342" />
                  <XAxis dataKey="name" stroke="#A0AEC0" fontSize={10} />
                  <YAxis stroke="#A0AEC0" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#161A22', borderColor: '#2B3342', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="CashBalance" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#colorCash)" name="Cash Runway ($)" />
                  <Area type="monotone" dataKey="MonthlyRevenue" stroke="#22C55E" strokeWidth={1.5} fillOpacity={0} name="Monthly Rev ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
