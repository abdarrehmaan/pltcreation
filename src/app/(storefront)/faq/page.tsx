'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, MessageCircle, Phone, Mail, ArrowRight } from 'lucide-react';

const faqCategories = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'We process orders within 24-48 hours. Standard domestic delivery takes 3–5 business days across India. Express shipping is also available at checkout.',
      },
      {
        q: 'Is shipping free?',
        a: 'Yes, we offer FREE nationwide shipping on all orders above ₹1,499. For orders below ₹1,499, a flat shipping charge of ₹99 applies.',
      },
      {
        q: 'Do you offer Cash on Delivery (COD)?',
        a: 'Yes, Cash on Delivery is available across most pincodes in India. Select COD at checkout.',
      },
    ],
  },
  {
    category: 'Store Policy & Support',
    items: [
      {
        q: 'What is your Return and Refund policy?',
        a: 'We strictly maintain a No Returns, No Refunds, and No Exchanges policy on all orders as every product undergoes rigorous multi-step quality control prior to dispatch.',
      },
      {
        q: 'How do I contact customer support if I face an issue?',
        a: 'For any kind of issue, please call us or send a message on WhatsApp at +91 63920 06081. Our team will contact you within 24 hours.',
      },
      {
        q: 'Is an unboxing video required for product issues?',
        a: 'Yes. For any product-related issue, a 360-degree unboxing video is mandatory for verification.',
      },
    ],
  },
  {
    category: 'Craftsmanship & Fabric Care',
    items: [
      {
        q: 'Are all Chikankari embroidery items handmade?',
        a: 'Yes! Every Chikankari outfit is hand-embroidered by artisan women using traditional needlework techniques passed down through generations.',
      },
      {
        q: 'How should I care for my PLT Creation outfits?',
        a: 'We recommend gentle hand wash in cold water or dry cleaning for hand-embroidered and silk pieces to maintain their luster and delicate threadwork.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div
        className="py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)' }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-widest mb-4">
          <HelpCircle size={14} /> Knowledge Base
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">Frequently Asked Questions</h1>
        <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base px-4">
          Find quick answers to common questions about orders, sizing, delivery, and care.
        </p>
      </div>

      <div className="container-plt py-12 md:py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqCategories.map((cat, catIdx) => (
            <div key={cat.category}>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openIndex === id;

                  return (
                    <div
                      key={item.q}
                      className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-200"
                    >
                      <button
                        onClick={() => toggle(id)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-gray-900 text-base bg-white hover:bg-brand-50/40 transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={`text-brand-600 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Contact Concierge Banner */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-brand-950 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">Still Have Questions?</h3>
              <p className="text-white/70 text-sm max-w-md">
                Our Client Care team is available Monday to Saturday to assist you with styling and order queries.
              </p>
            </div>
            <Link
              href="/contact"
              className="whitespace-nowrap px-8 py-3.5 rounded-full bg-white text-gray-900 font-bold text-sm hover:bg-brand-100 transition-colors flex items-center gap-2"
            >
              Contact Concierge <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
