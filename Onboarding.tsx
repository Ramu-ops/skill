
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { translations } from '../locales';
import { INITIAL_USER } from '../constants';

interface OnboardingProps {
  onAuthSuccess: (user: User) => void;
}

const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'mr', name: 'Marathi', native: 'मరాఠీ' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];

const Onboarding: React.FC<OnboardingProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<'language' | 'phone' | 'otp' | 'wallet' | 'kyc'>('language');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [aadhaar, setAadhaar] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mockNotification, setMockNotification] = useState<string | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');

  const t = translations[selectedLang] || translations['en'];

  const sendRealTimeOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("Generating OTP:", code);
    setGeneratedOtp(code);
    setMockNotification(`SKILLCHAIN OTP: ${code}. Use this to verify your identity.`);
    setTimeout(() => setMockNotification(null), 15000);
  };

  const handlePhoneSubmit = () => {
    if (phone.length !== 10) return alert("Please enter a valid 10-digit mobile number.");
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      sendRealTimeOtp();
      setStep('otp');
    }, 800);
  };

  const handleOtpSubmit = () => {
    const entered = otp.join('');
    if (entered.length < 4) return alert("Please enter the full 4-digit OTP.");
    
    if (entered !== generatedOtp) {
      return alert("Invalid OTP. Please check the notification at the top of the screen.");
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('skillchain_users') || '{}');
      if (users[phone]) {
        // Existing user: Login directly
        onAuthSuccess(users[phone]);
      } else {
        // New user: Proceed to signup steps
        setStep('wallet');
      }
      setIsProcessing(false);
    }, 800);
  };

  const connectWallet = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep('kyc');
      setIsProcessing(false);
    }, 1000);
  };

  const finishSignup = () => {
    if (aadhaar.length !== 12) return alert("Enter valid 12-digit Aadhaar number");
    setIsProcessing(true);
    setTimeout(() => {
      const newUser: User = {
        ...INITIAL_USER,
        id: `user_${Date.now()}`,
        phoneNumber: phone,
        name: `Worker ${phone.slice(-4)}`,
        walletAddress: '0x' + Math.random().toString(36).substr(2, 10),
        isKycVerified: true,
        aadhaarNumber: aadhaar,
        language: selectedLang,
        workRadius: 25,
        location: { city: 'Local Area', lat: 19.076, lng: 72.877 }
      };
      
      const users = JSON.parse(localStorage.getItem('skillchain_users') || '{}');
      users[phone] = newUser;
      localStorage.setItem('skillchain_users', JSON.stringify(users));
      
      onAuthSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto pt-6 px-4 relative">
      {mockNotification && (
        <div className="fixed top-2 left-2 right-2 z-[999] bg-slate-900 border-2 border-indigo-400 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-top-full duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Message • Just Now</p>
                <button onClick={() => setMockNotification(null)} className="text-slate-500">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <p className="text-white font-black text-lg">{mockNotification}</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">
          <span className="text-indigo-600">SkillChain</span> Bharat
        </h1>
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Verified Talent Ledger</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 min-h-[420px] flex flex-col justify-center">
        {step === 'language' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black mb-6 text-slate-900 text-center">Select Language</h2>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(l => (
                <button 
                  key={l.id}
                  onClick={() => { setSelectedLang(l.id); setStep('phone'); }}
                  className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left flex flex-col justify-center group"
                >
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-600 mb-0.5">{l.name}</span>
                  <span className="text-lg font-black text-slate-900">{l.native}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'phone' && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-black mb-2 text-slate-900 text-center">Log In / Sign Up</h2>
            <p className="text-slate-500 text-sm font-medium mb-8 text-center">{t.mobileSubtitle}</p>
            <div className="relative mb-6">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-indigo-600 text-xl">+91</span>
              <input 
                type="tel"
                placeholder="00000 00000"
                maxLength={10}
                className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-20 rounded-2xl text-2xl font-black text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            <button 
              onClick={handlePhoneSubmit}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isProcessing ? 'Verifying...' : 'Verify Number'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-in zoom-in-95 duration-500 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-1">{t.enterOtp}</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">Enter the 4-digit code from the top notification.</p>
            <div className="flex justify-center gap-3 mb-8">
              {[0, 1, 2, 3].map(i => (
                <input 
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  className="w-14 h-16 text-center text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition"
                  value={otp[i]}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const newOtp = [...otp];
                    newOtp[i] = val;
                    setOtp(newOtp);
                    if (val && i < 3) {
                      document.getElementById(`otp-${i+1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                      document.getElementById(`otp-${i-1}`)?.focus();
                    }
                  }}
                />
              ))}
            </div>
            <button 
              onClick={handleOtpSubmit}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition"
            >
              {t.confirmOtp}
            </button>
            <button onClick={sendRealTimeOtp} className="mt-6 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">Resend OTP</button>
          </div>
        )}

        {step === 'wallet' && (
          <div className="text-center animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-black mb-4 text-slate-900">Secure Web3 ID</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed px-4 text-sm">{t.walletSubtitle}</p>
            <button 
              onClick={connectWallet}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-slate-800 transition active:scale-95"
            >
              {t.connectWallet}
            </button>
          </div>
        )}

        {step === 'kyc' && (
          <div className="animate-in slide-in-from-right-8 duration-500 text-center">
            <h2 className="text-2xl font-black mb-2 text-slate-900">{t.aadhaarKyc}</h2>
            <p className="text-slate-500 text-xs font-medium mb-8 leading-relaxed px-4">{t.aadhaarSubtitle}</p>
            <input 
              type="text"
              placeholder="0000 0000 0000"
              maxLength={12}
              className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-2xl font-black text-slate-900 outline-none mb-8 text-center tracking-[0.2em]"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
            />
            <button 
              onClick={finishSignup}
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-orange-700 transition active:scale-95"
            >
              Finish Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
