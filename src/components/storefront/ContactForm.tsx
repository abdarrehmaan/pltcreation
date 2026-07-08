'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Query',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Thank you! Your message has been sent successfully.');
    setFormData({
      name: '',
      email: '',
      subject: 'Order Query',
      message: '',
    });
    setLoading(false);
  };

  return (
    <div className="bg-ivory-100 rounded-3xl p-8 border border-brand-100/50 shadow-sm">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare size={22} className="text-brand-600" /> Send a Message
      </h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-base bg-white border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-base bg-white border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
            Subject
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="input-base bg-white border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl"
          >
            <option>Order Query</option>
            <option>Return Request</option>
            <option>Product Inquiry</option>
            <option>Payment Issue</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
            Message
          </label>
          <textarea
            rows={5}
            placeholder="Describe your query in detail..."
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="input-base bg-white border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl resize-none"
          />
        </div>

        <button
          type="submit"
          id="contact-submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
