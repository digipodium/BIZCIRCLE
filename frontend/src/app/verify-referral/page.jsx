"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { CheckCircle2, XCircle, Loader2, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [referralData, setReferralData] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await api.get(`/api/referrals/verify?token=${token}`);
        setStatus('success');
        setMessage(data.message);
        setReferralData(data.referral);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link might be expired or invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 p-8 text-center animate-slideUp">
        {status === 'loading' && (
          <div className="py-12 flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying Referral</h2>
            <p className="text-slate-500">Please wait while we confirm your details...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 mx-auto mb-6 scale-in">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Verification Successful!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Thank you, <strong>{referralData?.candidateName}</strong>! Your referral has been confirmed and verified on the BizCircle platform.
            </p>
            
            <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-4 mb-8 text-left">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-bold">
                <Award size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">Impact</p>
                <p className="text-sm font-bold text-slate-800">Sender rewarded with +30 BizPoints</p>
              </div>
            </div>

            <Link 
              href="/"
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
            >
              Back to Home
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <XCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Verification Failed</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {message}
            </p>
            
            <Link 
              href="/"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyReferralPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
