
import React, { useState } from 'react';
import { User, Skill, AppView, Gig } from '../types';
import { translations } from '../locales';

interface ProfileViewProps {
  user: User;
  skills: Skill[];
  gigs: Gig[];
  onSubmitWork: (id: string, proof: string) => void;
  setView: (view: AppView) => void;
  balance: number;
  setBalance: (val: number | ((prev: number) => number)) => void;
  onWithdraw: (amount: string) => void;
  onUpdateUser: (u: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, skills, gigs, onSubmitWork, setView, balance, onWithdraw, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleFileSubmission = async (gigId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => onSubmitWork(gigId, reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const activeJobs = gigs.filter(g => g.status === 'assigned' || g.status === 'submitted');
  const t = translations[user.language || 'en'] || translations['en'];

  return (
    <div className="space-y-10 pb-24">
      {/* Profile Header & Edit View */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 relative">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-8 right-10 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>

        {isEditing ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
             <h2 className="text-2xl font-black text-slate-900 mb-6">Update Profile Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Display Name</label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-900 font-black outline-none focus:border-indigo-500"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Service City</label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-900 font-black outline-none focus:border-indigo-500"
                    value={editedUser.location?.city}
                    onChange={(e) => setEditedUser({...editedUser, location: { ...editedUser.location!, city: e.target.value }})}
                   />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Professional Bio</label>
                   <textarea 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-900 font-black outline-none focus:border-indigo-500 h-24"
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                   />
                </div>
             </div>
             <button 
              onClick={handleSaveProfile}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition"
             >
               Save Changes
             </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10">
            <div className="relative group">
              <img src={user.avatar} className="w-36 h-36 rounded-[3rem] object-cover ring-8 ring-indigo-50 shadow-2xl" alt="Profile" />
              <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{user.name}</h1>
              <p className="text-slate-600 font-medium mb-6 leading-relaxed max-w-lg">{user.bio || 'Professional worker in the SkillChain Bharat network.'}</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <div className="bg-indigo-50 px-5 py-2.5 rounded-2xl text-[10px] font-black text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                  UID: {user.phoneNumber}
                </div>
                <div className="bg-emerald-50 px-5 py-2.5 rounded-2xl text-[10px] font-black text-emerald-700 border border-emerald-100 uppercase tracking-widest">
                  {user.location?.city || 'India'} Node
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
           </div>
           <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Available Earnings</h3>
           <div className="text-5xl font-black mb-10 tracking-tighter">₹ {balance.toLocaleString()}</div>
           <button onClick={() => onWithdraw('5000')} className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 active:scale-95 transition">
             Withdraw to UPI
           </button>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-xl flex flex-col justify-center">
           <h3 className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6">Credential Locker</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-600 uppercase">Verified</span>
                <p className="text-3xl font-black text-slate-900">{skills.filter(s => s.status === 'verified').length}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-600 uppercase">Pending</span>
                <p className="text-3xl font-black text-slate-900">{skills.filter(s => s.status === 'pending').length}</p>
              </div>
           </div>
           <button 
            onClick={() => setView(AppView.SKILLS)}
            className="mt-6 w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-black text-sm hover:bg-indigo-100 transition border border-indigo-100"
           >
             Add New Certificate
           </button>
        </div>
      </div>

      {/* Active Work Section */}
      <div className="bg-white p-10 rounded-[4rem] border-2 border-slate-100 shadow-xl">
        <h3 className="text-3xl font-black text-slate-900 mb-8 flex items-center">
          <span className="w-2 h-8 bg-indigo-600 rounded-full mr-5" />
          Active Assignments
        </h3>
        {activeJobs.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-black uppercase tracking-widest">You have no active assignments.</p>
             <button onClick={() => setView(AppView.MARKETPLACE)} className="mt-4 text-indigo-600 font-black text-sm uppercase underline">Browse Jobs</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeJobs.map(job => (
              <div key={job.id} className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-8 group hover:border-indigo-400 transition-all">
                 <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-black text-2xl text-slate-900 mb-2">{job.title}</h4>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                       <span className="text-[9px] font-black text-indigo-900 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200">{job.location}</span>
                       <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">VERIFIED PAYOUT</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{job.budget}</p>
                 </div>
                 <div className="w-full sm:w-auto">
                    {job.status === 'submitted' ? (
                      <div className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center border-2 border-slate-800 shadow-2xl">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse" />
                        Verification in Progress
                      </div>
                    ) : (
                      <label className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm cursor-pointer hover:bg-indigo-700 transition shadow-xl block text-center border-2 border-indigo-400">
                        Upload Proof of Work
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFileSubmission(job.id, e.target.files[0])} />
                      </label>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
