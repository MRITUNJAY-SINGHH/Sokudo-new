/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Meter from "/meter_v1.png";

const EmiCalculation = () => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(6);
  const [loanTenure, setLoanTenure] = useState(12);
  const [dailyDistance, setDailyDistance] = useState(15);
  const [emi, setEmi] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [effectiveEmi, setEffectiveEmi] = useState(0);

  useEffect(() => {
    const monthlyRate = interestRate / 100 / 12;
    const emiAmount =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
      (Math.pow(1 + monthlyRate, loanTenure) - 1);

    const petrolCostPerKm = 2.5;
    const electricCostPerKm = 0.3;
    const monthlyKm = dailyDistance * 30;
    const savings = (petrolCostPerKm - electricCostPerKm) * monthlyKm;

    setEmi(Math.round(emiAmount));
    setMonthlySavings(Math.round(savings));
    setEffectiveEmi(Math.round(emiAmount - savings));
  }, [loanAmount, interestRate, loanTenure, dailyDistance]);

  const loanProgress = Math.max(2, Math.min(98, (loanAmount / 180000) * 100));
  const distanceProgress = Math.max(
    2,
    Math.min(98, ((dailyDistance - 15) / (212 - 15)) * 100)
  );

  const emiRotation = Math.min((emi / 8000) * 180, 180);
  const savingsRotation = Math.min((monthlySavings / 1500) * 180, 180);

  const interestRateOptions = [5, 6, 7, 8, 9, 10, 12, 15];
  const tenureOptions = [6, 12, 18, 24, 36, 48];

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16">

      {/* ---------- TITLE ---------- */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="heading mb-2">EMI Calculator SOKUDO Electric</h2>
        <p className="text-[#666666] text-xl sm:text-2xl mt-3">
          A Scooter that Pays for Itself
        </p>
      </div>

      {/* ========================= DESKTOP LAYOUT ========================= */}
      <div className="page-width bg-white border border-gray-300 rounded-3xl p-5 sm:p-8 hidden md:block">
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          Tap on the cards to learn how the amount is calculated.
        </p>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">

          {/* ================= Sliders + Dropdowns (LEFT) ================= */}
          <div className="bg-[#E3EAF1] rounded-2xl p-2 sm:p-3 flex flex-col lg:flex-row gap-5 justify-start">

            {/* ------- Loan + Distance Sliders ------- */}
            <div className="bg-white p-5 sm:p-6 flex-1 rounded-2xl border border-[#cccccc]">
              <p className="text-black mb-6 sm:mb-8 text-sm sm:text-base">
                Adjust the sliders below to calculate your savings.
              </p>

              {/* LOAN SLIDER */}
              <div>
                <div className="flex justify-between mb-3 sm:mb-4 items-center gap-4">
                  <label className="font-medium text-black text-sm sm:text-base">
                    Loan Amount (₹)
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[72px] text-center">
                    <span className="font-semibold text-black text-sm sm:text-base">
                      {loanAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Static value labels */}
                <div className="flex justify-between text-[10px] sm:text-xs md:text-sm text-black px-1">
                  <span>0</span>
                  <span>30k</span>
                  <span>60k</span>
                  <span>90k</span>
                  <span>1.2L</span>
                  <span>1.5L</span>
                  <span>1.80L</span>
                </div>

                {/* Slider */}
                <div className="relative mt-2">
                  <div className="h-2 bg-black rounded-full relative">
                    <motion.div
                      className="h-full bg-[#FFB200] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${loanProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />

                    <label className="invisible">Price</label>

                    <input
                      type="range"
                      min="0"
                      max="180000"
                      step="5000"
                      value={loanAmount}
                      aria-label="Loan amount"
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* DISTANCE SLIDER */}
              <div className="mt-6 sm:mt-8">
                <div className="flex justify-between mb-3 sm:mb-4 items-center gap-4">
                  <label className="font-medium text-black text-sm sm:text-base">
                    Daily Distance (km)
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[56px] text-center">
                    <span className="font-semibold text-black text-sm sm:text-base">
                      {dailyDistance}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] sm:text-[11px] md:text-xs lg:text-sm text-black px-1">
                  {["15", "25", "50", "75", "100", "125", "175", "200", "212"].map(
                    (v) => (
                      <span key={v}>{v}</span>
                    )
                  )}
                </div>

                <div className="relative mt-2">
                  <div className="h-2 bg-black rounded-full relative">
                    <motion.div
                      className="h-full bg-[#FE0000] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${distanceProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />

                    
                      <label className="invisible">Range</label>
                    <input
                      type="range"
                      min="15"
                      max="212"
                      step="1"
                      value={dailyDistance}
                      onChange={(e) =>
                        setDailyDistance(Number(e.target.value))
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                  </div>
                </div>
              </div>
            </div>

            {/* ------- Dropdowns ------- */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 w-full lg:w-[30%] space-y-6 border border-[#cccccc]">
              <div>
                <label className="block text-black font-medium mb-2 text-sm sm:text-base">
                  Interest Rate
                </label>
                <select
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full p-2.5 sm:p-3 bg-white border-b border-black text-sm sm:text-base outline-none"
                >
                  {interestRateOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black font-medium mb-2 text-sm sm:text-base">
                  Loan Tenure
                </label>
                <select
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full p-2.5 sm:p-3 bg-white border-b border-black text-sm sm:text-base outline-none"
                >
                  {tenureOptions.map((t) => (
                    <option key={t} value={t}>
                      {t} months
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ================= RIGHT GAUGES ================= */}
          <div className="space-y-4">

            {/* EMI Gauge */}
            <motion.div
              className="rounded-3xl flex justify-start px-5 sm:px-6 py-4 sm:py-5 text-white relative w-full"
              style={{ backgroundColor: "#FFB200" }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="w-1/2 sm:w-[60%] relative h-20 sm:h-24 flex justify-center">
                <motion.div
                  className="pointer absolute w-8 h-8 z-10"
                  animate={{ rotate: emiRotation }}
                >
                  <img src={Meter} alt="" className="max-w-full" />
                </motion.div>
              </div>

              <div className="w-1/2 sm:w-[40%] flex flex-col justify-center">
                <p className="text-white/90 font-medium text-sm sm:text-base">
                  EMI
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹ {emi.toLocaleString()}
                </p>
              </div>
            </motion.div>

            {/* Monthly Savings Gauge */}
            <motion.div
              className="rounded-3xl flex justify-start px-5 sm:px-6 py-4 sm:py-5 text-white w-full"
              style={{ backgroundColor: "#16AA51" }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-1/2 sm:w-[60%] relative h-20 sm:h-24 flex justify-center">
                <motion.div
                  className="pointer absolute w-8 h-8 z-10"
                  animate={{ rotate: savingsRotation }}
                >
                  <img src={Meter} alt="" className="max-w-full" />
                </motion.div>
              </div>

              <div className="w-1/2 sm:w-[40%] flex flex-col justify-center">
                <p className="text-white/90 font-medium text-sm sm:text-base">
                  Avg. Monthly Savings
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹ {monthlySavings.toLocaleString()}
                </p>
              </div>
            </motion.div>

            {/* Effective EMI */}
            <div className="bg-white rounded-2xl p-5 sm:p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-gray-800 font-semibold text-base sm:text-lg mb-2">
                    Effective EMI
                  </p>
                  <p className="text-black text-xs sm:text-sm">
                    Net price you pay as EMI after savings.
                  </p>
                </div>

                <div className="text-right min-w-[100px] sm:min-w-[140px]">
                  <p className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">
                    ₹ {effectiveEmi.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================= MOBILE LAYOUT ========================= */}
      <div className="page-width md:hidden bg-white border border-gray-300 rounded-2xl p-4">

        <h3 className="text-xl font-bold text-black mb-4 text-center">
          EMI Calculator
        </h3>

        <div className="space-y-6">

          {/* Loan Slider */}
          <div>
            <label className="font-medium text-sm">Loan Amount (₹)</label>
            <input
              type="range"
              min="0"
              max="180000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-2"
            />
            <p className="text-right font-semibold text-sm">
              ₹ {loanAmount.toLocaleString()}
            </p>
          </div>

          {/* Distance Slider */}
          <div>
            <label className="font-medium text-sm">Daily Distance (km)</label>
            <input
              type="range"
              min="15"
              max="212"
              value={dailyDistance}
              onChange={(e) => setDailyDistance(Number(e.target.value))}
              className="w-full mt-2"
            />
            <p className="text-right font-semibold text-sm">
              {dailyDistance} km
            </p>
          </div>

          {/* Dropdowns */}
          <div className="space-y-4">
            <select
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border rounded-md p-2 bg-white"
            >
              {interestRateOptions.map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </select>

            <select
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full border rounded-md p-2 bg-white"
            >
              {tenureOptions.map((t) => (
                <option key={t} value={t}>
                  {t} months
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Results */}
          <div className="bg-[#FFF7D1] rounded-xl p-4">
            <p className="text-gray-700 text-sm">EMI</p>
            <p className="text-2xl font-bold">₹ {emi.toLocaleString()}</p>
          </div>

          <div className="bg-[#E4F9EA] rounded-xl p-4">
            <p className="text-gray-700 text-sm">Avg Monthly Savings</p>
            <p className="text-2xl font-bold">
              ₹ {monthlySavings.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700 text-sm">Effective EMI</p>
            <p className="text-2xl font-bold">
              ₹ {effectiveEmi.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default EmiCalculation;
