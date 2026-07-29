import type { Metadata } from 'next';
import Link from 'next/link';
import { Ruler, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Size Guide — PLT Creation',
  description: 'Find your perfect fit with PLT Creation\'s comprehensive ethnic wear size guide for Kurtis, Suits, and Co-ord sets.',
};

const sizeCharts = [
  {
    category: 'Kurtis & Stitched Suits (Inches)',
    rows: [
      { size: 'XS', bust: '34"', waist: '30"', hip: '37"', shoulder: '14"' },
      { size: 'S', bust: '36"', waist: '32"', hip: '39"', shoulder: '14.5"' },
      { size: 'M', bust: '38"', waist: '34"', hip: '41"', shoulder: '15"' },
      { size: 'L', bust: '40"', waist: '36"', hip: '43"', shoulder: '15.5"' },
      { size: 'XL', bust: '42"', waist: '38"', hip: '45"', shoulder: '16"' },
      { size: 'XXL', bust: '44"', waist: '40"', hip: '47"', shoulder: '16.5"' },
    ],
  },
  {
    category: 'Co-ord Sets & Bottom Wear (Inches)',
    rows: [
      { size: 'XS', waist: '26-28"', hip: '36"', length: '38"' },
      { size: 'S', waist: '28-30"', hip: '38"', length: '38.5"' },
      { size: 'M', waist: '30-32"', hip: '40"', length: '39"' },
      { size: 'L', waist: '32-34"', hip: '42"', length: '39.5"' },
      { size: 'XL', waist: '34-36"', hip: '44"', length: '40"' },
      { size: 'XXL', waist: '36-38"', hip: '46"', length: '40.5"' },
    ],
  },
];

const measurementTips = [
  {
    title: 'Bust / Chest',
    desc: 'Measure around the fullest part of your bust, keeping the measuring tape horizontal and comfortably loose.',
  },
  {
    title: 'Waist',
    desc: 'Measure around your natural waistline, where your body narrows slightly (usually 1–2 inches above your navel).',
  },
  {
    title: 'Hips',
    desc: 'Stand with feet together and measure around the fullest part of your hips/buttocks.',
  },
  {
    title: 'Shoulder width',
    desc: 'Measure across your back from the outer edge of one shoulder seam to the other.',
  },
];

export default function SizeGuidePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div
        className="py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)' }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-widest mb-4">
          <Ruler size={14} /> Official Fitting Guide
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">Size Guide</h1>
        <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base px-4">
          Designed for a comfortable and regal fit. Use our charts to select your ideal measurements.
        </p>
      </div>

      <div className="container-plt py-12 md:py-20">
        {/* Fit Recommendation Note */}
        <div className="max-w-4xl mx-auto mb-16 p-6 rounded-2xl bg-brand-50/50 border border-brand-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-1">Between Sizes?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                If your measurements fall between two sizes, we recommend ordering the **larger size** for a relaxed ethnic fit or contacting our styling concierge.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors flex items-center gap-2"
          >
            Ask Concierge <ArrowRight size={16} />
          </Link>
        </div>

        {/* Size Tables */}
        <div className="max-w-4xl mx-auto space-y-12 mb-20">
          {sizeCharts.map((chart) => (
            <div key={chart.category} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-900 text-white px-6 py-4">
                <h2 className="font-display font-semibold text-lg">{chart.category}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-100">
                      <th className="py-4 px-6">Size</th>
                      {Object.keys(chart.rows[0])
                        .filter((k) => k !== 'size')
                        .map((key) => (
                          <th key={key} className="py-4 px-6 capitalize">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {chart.rows.map((row) => (
                      <tr key={row.size} className="hover:bg-brand-50/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900 bg-gray-50/50">{row.size}</td>
                        {Object.entries(row)
                          .filter(([k]) => k !== 'size')
                          .map(([key, val]) => (
                            <td key={key} className="py-4 px-6 text-gray-700 font-medium">
                              {val}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* How to Measure */}
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            How to Measure Yourself
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 max-w-md mx-auto">
            Follow these quick instructions to take accurate body measurements with a cloth tape measure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {measurementTips.map((tip, idx) => (
              <div key={tip.title} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
