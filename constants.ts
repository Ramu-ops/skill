
import { UserRole, User, Skill, Gig } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Rahul Joshi',
  role: UserRole.GIG_WORKER,
  isKycVerified: true,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  bio: 'Expert Domestic Electrician & Solar Panel Installer with 5+ years experience.'
};

export const MOCK_VERIFIER: User = {
  id: 'v1',
  name: 'Dr. Amit Verma',
  role: UserRole.VERIFIER,
  isKycVerified: true,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
};

export const MOCK_SKILLS: Skill[] = [
  {
    id: 's1',
    userId: 'u1',
    title: 'Certified Domestic Electrician',
    issuer: 'National Skill Development Corp (NSDC)',
    date: '2023-10-10',
    status: 'pending',
    ipfsHash: 'QmXoyp...7821',
    blockchainHash: '0x71C7...8976F',
    qrCode: 'SKILL_ELECTRICAL_001'
  },
  {
    id: 's2',
    userId: 'u1',
    title: 'Solar Grid Maintenance',
    issuer: 'Skill India Mission',
    date: '2023-12-15',
    status: 'verified',
    ipfsHash: 'QmZpr9...1122',
    blockchainHash: '0x9a22...f331',
    qrCode: 'SKILL_SOLAR_482'
  }
];

export const MOCK_GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Residential Solar Panel Installation',
    description: 'Require a certified electrician to install 5kW solar grid for a local apartment complex in Bangalore.',
    budget: '₹12,000',
    budgetNum: 12000,
    requiredSkills: ['Electrician', 'Solar Panel'],
    location: 'HSR Layout, Bangalore',
    postedBy: 'GreenHome Solutions',
    postedAt: '4 hours ago',
    status: 'open'
  },
  {
    id: 'g2',
    title: 'Industrial Wiring Project',
    description: 'Short-term contract for rewiring a small-scale garment factory. Must be NSDC certified.',
    budget: '₹25,000',
    budgetNum: 25000,
    requiredSkills: ['Industrial Wiring', 'Safety Standards'],
    location: 'Peenya Industrial Area',
    postedBy: 'Vikas Textiles',
    postedAt: '1 day ago',
    status: 'open'
  }
];
