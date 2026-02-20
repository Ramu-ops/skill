
import React, { useState } from 'react';
import { Skill, Transaction, Gig } from '../types';

interface EmployerPortalProps {
  allSkills: Skill[];
  transactions: Transaction[];
  onPostGig: (gig: Gig) => void;
}

const EmployerPortal: React.FC<EmployerPortalProps> = ({ allSkills, transactions, onPostGig }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [newGig, setNewGig] = useState({ title: '', desc: '', location: '', pay: '' });
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGig.title || !newGig.pay) return alert("Please fill title and payout");
    setIsPosting(true);
    setTimeout(() => {
      const gig: Gig = {
        id: Math.random().toString(36).substr(2, 9),
        title: newGig.title,
        description: newGig.desc,
        budget: `₹${newGig.pay}`,
        budgetNum: parseInt(newGig.pay),
        location: newGig.location || 'Local Area',
        requiredSkills: ['General Service'],
        postedBy: 'Business User',
        postedAt: 'Just Now',
        status: 'open'
      };
      onPostGig(gig);
      setIsPosting(false);
      setShowPostModal(false);
      setNewGig({ title: '', desc: '', location: '', pay: '' });
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Employer Hub</h2>
          <p className="text-slate-500 font-medium">Post work and verify talent in your local area.</p>
        </div>
        <button 
          onClick={() => setShowPostModal(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition"
        >
          Post New Work
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
           <h3 className="text-xl font-black text-slate-900 mb-6">Payment Escrow</h3>
           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Escrow Balance</p>
                <p className="text-3xl font-black text-slate-900">₹ 85,000</p>
              </div>
              <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-emerald-600 hover:text-emerald-700 font-black text-sm">Top Up</button>
           </div>
           <p className="text-[10px] text-slate-400 italic">Funds are automatically released by Verifiers once work is approved.</p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
           <h3 className="text-xl font-black text-slate-900 mb-6">Verification Insights</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <span className="text-sm font-bold text-slate-500">Local Workers Available</span>
                 <span className="font-black text-slate-900">2,481</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <span className="text-sm font-bold text-slate-500">Average Job Match</span>
                 <span className="font-black text-indigo-600">89%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Payout History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Worker</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Job Type</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Payout</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(tx => tx.type === 'Payment').map(tx => (
                <tr key={tx.id} className="border-b border-slate-50">
                  <td className="py-4 font-black text-sm text-slate-900">{tx.worker}</td>
                  <td className="py-4 text-sm font-medium text-slate-600">Completed Work</td>
                  <td className="py-4 font-black text-sm text-emerald-600">{tx.amount}</td>
                  <td className="py-4"><span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full">TRANSFERRED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Post Local Job</h3>
              <form onSubmit={handlePost} className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Job Title</label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-900 placeholder:text-slate-400" 
                    placeholder="e.g. Clean & Rewire Shop" 
                    value={newGig.title} 
                    onChange={e => setNewGig({...newGig, title: e.target.value})} 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Area / Location</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-900 placeholder:text-slate-400" 
                        placeholder="e.g. HSR Layout" 
                        value={newGig.location} 
                        onChange={e => setNewGig({...newGig, location: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Payout (₹)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-900 placeholder:text-slate-400" 
                        placeholder="e.g. 2500" 
                        value={newGig.pay} 
                        onChange={e => setNewGig({...newGig, pay: e.target.value})} 
                      />
                    </div>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Detailed Description</label>
                   <textarea 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-bold h-32 text-slate-900 placeholder:text-slate-400" 
                    placeholder="Describe the work requirements..." 
                    value={newGig.desc} 
                    onChange={e => setNewGig({...newGig, desc: e.target.value})} 
                   />
                 </div>
                 <div className="flex space-x-4">
                    <button type="button" onClick={() => setShowPostModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black">Cancel</button>
                    <button type="submit" disabled={isPosting} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100">
                      {isPosting ? 'Processing...' : 'Confirm Post'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployerPortal;
