
import React, { useState, useEffect } from 'react';
import { AppView, User, Skill, Gig, UserRole, Transaction } from './types';
import { INITIAL_USER, MOCK_SKILLS, MOCK_GIGS, MOCK_VERIFIER } from './constants';
import Onboarding from './components/Onboarding';
import ProfileView from './components/ProfileView';
import SkillUpload from './components/SkillUpload';
import VerifierDashboard from './components/VerifierDashboard';
import VerifierLogin from './components/VerifierLogin';
import EmployerLogin from './components/EmployerLogin';
import Marketplace from './components/Marketplace';
import EmployerPortal from './components/EmployerPortal';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import ManageSkills from './components/ManageSkills';

const App: React.FC = () => {
  // Persistence Simulation
  const getStoredUsers = (): Record<string, User> => {
    const data = localStorage.getItem('skillchain_users');
    return data ? JSON.parse(data) : {};
  };

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const activeId = sessionStorage.getItem('active_user_id');
    const users = getStoredUsers();
    return activeId && users[activeId] ? users[activeId] : { ...INITIAL_USER, walletAddress: undefined, isKycVerified: false };
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    return currentUser.walletAddress ? AppView.PROFILE : AppView.ONBOARDING;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const data = localStorage.getItem(`skills_${currentUser.phoneNumber}`);
    return data ? JSON.parse(data) : MOCK_SKILLS;
  });

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isVerifierAuthenticated, setIsVerifierAuthenticated] = useState(false);
  const [isEmployerAuthenticated, setIsEmployerAuthenticated] = useState(false);
  
  // Persist Gigs
  const [gigs, setGigs] = useState<Gig[]>(() => {
    const data = localStorage.getItem('skillchain_gigs');
    return data ? JSON.parse(data) : MOCK_GIGS;
  });

  // Sync state to storage
  useEffect(() => {
    if (currentUser.phoneNumber) {
      const users = getStoredUsers();
      users[currentUser.phoneNumber] = currentUser;
      localStorage.setItem('skillchain_users', JSON.stringify(users));
      sessionStorage.setItem('active_user_id', currentUser.phoneNumber);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`skills_${currentUser.phoneNumber}`, JSON.stringify(skills));
  }, [skills, currentUser.phoneNumber]);

  useEffect(() => {
    localStorage.setItem('skillchain_gigs', JSON.stringify(gigs));
  }, [gigs]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: role === UserRole.VERIFIER ? MOCK_VERIFIER.name : prev.name || INITIAL_USER.name,
      avatar: role === UserRole.VERIFIER ? MOCK_VERIFIER.avatar : prev.avatar || INITIAL_USER.avatar
    }));

    if (role === UserRole.VERIFIER) {
      if (isVerifierAuthenticated) setCurrentView(AppView.VERIFICATION);
      else setCurrentView(AppView.VERIFIER_LOGIN);
    } else if (role === UserRole.EMPLOYER) {
      if (isEmployerAuthenticated) setCurrentView(AppView.EMPLOYER);
      else setCurrentView(AppView.EMPLOYER_LOGIN);
    } else {
      setCurrentView(AppView.PROFILE);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView(AppView.PROFILE);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('active_user_id');
    setCurrentUser({ ...INITIAL_USER, walletAddress: undefined, isKycVerified: false });
    setCurrentView(AppView.ONBOARDING);
  };

  const handleAcceptGig = (gigId: string) => {
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'assigned', workerId: currentUser.phoneNumber } : g));
    alert("Work Accepted! You can find this in your Profile.");
    setCurrentView(AppView.PROFILE);
  };

  const handleVerifyWork = (gigId: string, approved: boolean) => {
    if (approved) {
      const gig = gigs.find(g => g.id === gigId);
      if (gig) {
        setBalance(prev => prev + gig.budgetNum);
        setTransactions(prev => [{
          id: `tx_${Math.random().toString(36).substr(2, 5)}`,
          worker: currentUser.name,
          type: 'Payment',
          amount: `₹${gig.budgetNum}`,
          status: 'Completed',
          date: new Date().toLocaleDateString()
        }, ...prev]);
        setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'completed' } : g));
      }
    }
  };

  const renderView = () => {
    if (currentView === AppView.ONBOARDING) {
      return <Onboarding onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentView) {
      case AppView.PROFILE:
        return <ProfileView 
          user={currentUser} 
          skills={skills} 
          gigs={gigs.filter(g => g.workerId === currentUser.phoneNumber && g.status !== 'completed')}
          onSubmitWork={(id, url) => setGigs(prev => prev.map(g => g.id === id ? { ...g, status: 'submitted', workProofUrl: url } : g))}
          setView={setCurrentView} 
          balance={balance} 
          setBalance={setBalance}
          onWithdraw={(amt) => setTransactions(prev => [{ id: 'tx_w', worker: currentUser.name, type: 'Withdrawal', amount: `₹${amt}`, status: 'Completed', date: 'Today' }, ...prev])}
          onUpdateUser={setCurrentUser}
        />;
      case AppView.VERIFICATION:
        return <VerifierDashboard skills={skills} gigs={gigs} onVerifySkill={(id, st) => setSkills(prev => prev.map(s => s.id === id ? { ...s, status: st } : s))} onVerifyWork={handleVerifyWork} />;
      case AppView.MARKETPLACE:
        return <Marketplace user={currentUser} userSkills={skills.filter(s => s.status === 'verified')} gigs={gigs} onAccept={handleAcceptGig} />;
      case AppView.EMPLOYER:
        return <EmployerPortal allSkills={skills} transactions={transactions} onPostGig={(g) => setGigs(prev => [g, ...prev])} />;
      case AppView.MANAGE_SKILLS:
        return <ManageSkills skills={skills} setSkills={setSkills} setView={setCurrentView} />;
      case AppView.SKILLS:
        return <SkillUpload onUpload={(s) => setSkills(prev => [s, ...prev])} onCancel={() => setCurrentView(AppView.PROFILE)} />;
      case AppView.VERIFIER_LOGIN:
        return <VerifierLogin onLogin={() => { setIsVerifierAuthenticated(true); setCurrentView(AppView.VERIFICATION); }} />;
      case AppView.EMPLOYER_LOGIN:
        return <EmployerLogin onLogin={() => { setIsEmployerAuthenticated(true); setCurrentView(AppView.EMPLOYER); }} />;
      default:
        return null;
    }
  };

  const showNav = currentUser.walletAddress && ![AppView.ONBOARDING, AppView.VERIFIER_LOGIN, AppView.EMPLOYER_LOGIN].includes(currentView);

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-50">
      <Header user={currentUser} onRoleChange={handleRoleChange} hideControls={!currentUser.walletAddress} onLogout={handleLogout} />
      <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
        {renderView()}
      </main>
      {showNav && <BottomNav activeView={currentView} setView={setCurrentView} role={currentUser.role} />}
    </div>
  );
};

export default App;
