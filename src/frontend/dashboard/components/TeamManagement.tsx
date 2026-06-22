import {
  Check,
  Clock,
  Mail,
  MoreVertical,
  Search,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useTier } from '@/lib/contexts/TierContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending';
  resumesCreated: number;
  lastActive: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@company.com',
    role: 'admin',
    status: 'active',
    resumesCreated: 8,
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'John Davidson',
    email: 'john@company.com',
    role: 'member',
    status: 'active',
    resumesCreated: 5,
    lastActive: '4 hours ago',
  },
  {
    id: '3',
    name: 'Emily Roberts',
    email: 'emily@company.com',
    role: 'member',
    status: 'active',
    resumesCreated: 6,
    lastActive: '1 day ago',
  },
  {
    id: '4',
    name: 'Michael Kim',
    email: 'michael@company.com',
    role: 'member',
    status: 'pending',
    resumesCreated: 0,
    lastActive: 'Pending',
  },
];

function InviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-cod-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-cod-gray-900 dark:text-white">
            Invite Team Member
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800"
          >
            <X className="w-5 h-5 text-cod-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="invite-email"
              className="block text-sm font-medium text-cod-gray-700 dark:text-cod-gray-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cod-gray-400" />
              <input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cod-gray-300 dark:border-cod-gray-700 bg-white dark:bg-cod-gray-800 text-cod-gray-900 dark:text-white placeholder-cod-gray-400 focus:ring-2 focus:ring-fuchsia-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-cod-gray-700 dark:text-cod-gray-300 mb-1.5">
              Role
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`
                  p-3 rounded-lg border-2 transition-colors text-left
                  ${
                    role === 'member'
                      ? 'border-fuchsia-pink-500 bg-fuchsia-pink-50 dark:bg-fuchsia-pink-950/30'
                      : 'border-cod-gray-200 dark:border-cod-gray-700 hover:border-cod-gray-300 dark:hover:border-cod-gray-600'
                  }
                `}
              >
                <Shield className="w-5 h-5 text-cod-gray-600 dark:text-cod-gray-400 mb-1" />
                <div className="font-medium text-cod-gray-900 dark:text-white">Member</div>
                <div className="text-xs text-cod-gray-500 dark:text-cod-gray-400">
                  Can create resumes
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`
                  p-3 rounded-lg border-2 transition-colors text-left
                  ${
                    role === 'admin'
                      ? 'border-fuchsia-pink-500 bg-fuchsia-pink-50 dark:bg-fuchsia-pink-950/30'
                      : 'border-cod-gray-200 dark:border-cod-gray-700 hover:border-cod-gray-300 dark:hover:border-cod-gray-600'
                  }
                `}
              >
                <ShieldCheck className="w-5 h-5 text-cod-gray-600 dark:text-cod-gray-400 mb-1" />
                <div className="font-medium text-cod-gray-900 dark:text-white">Admin</div>
                <div className="text-xs text-cod-gray-500 dark:text-cod-gray-400">Full access</div>
              </button>
            </div>
          </fieldset>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamManagement() {
  const { tier, usage } = useTier();
  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (tier.name !== 'enterprise') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Users className="w-16 h-16 text-cod-gray-300 dark:text-cod-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-cod-gray-900 dark:text-white mb-2">
          Team Management
        </h3>
        <p className="text-cod-gray-500 dark:text-cod-gray-400 max-w-md">
          Upgrade to Enterprise to manage team members, assign roles, and collaborate on resumes.
        </p>
      </div>
    );
  }

  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const seatsRemaining = tier.limits.teamSeats - usage.teamMembersCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cod-gray-900 dark:text-white">Team</h2>
          <p className="text-cod-gray-500 dark:text-cod-gray-400">
            Manage your team members and permissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowInvite(true)}
          disabled={seatsRemaining <= 0}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Seats Counter */}
      <div className="bg-white dark:bg-cod-gray-900 rounded-xl border border-cod-gray-200 dark:border-cod-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50 flex items-center justify-center">
              <Users className="w-5 h-5 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
            </div>
            <div>
              <div className="font-medium text-cod-gray-900 dark:text-white">Team Seats</div>
              <div className="text-sm text-cod-gray-500 dark:text-cod-gray-400">
                {usage.teamMembersCount} of {tier.limits.teamSeats} seats used
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {Array.from(
              { length: tier.limits.teamSeats },
              (_, seatIndex) => `seat-${seatIndex}`
            ).map((seatId, seatIndex) => (
              <div
                key={seatId}
                className={`w-3 h-3 rounded-full ${
                  seatIndex < usage.teamMembersCount
                    ? 'bg-fuchsia-pink-500'
                    : 'bg-cod-gray-200 dark:bg-cod-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cod-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team members..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cod-gray-300 dark:border-cod-gray-700 bg-white dark:bg-cod-gray-900 text-cod-gray-900 dark:text-white placeholder-cod-gray-400 focus:ring-2 focus:ring-fuchsia-pink-500 focus:border-transparent"
        />
      </div>

      {/* Members List */}
      <div className="bg-white dark:bg-cod-gray-900 rounded-xl border border-cod-gray-200 dark:border-cod-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cod-gray-200 dark:border-cod-gray-700 bg-cod-gray-50 dark:bg-cod-gray-800/50">
                <th className="text-left px-6 py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Member
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Role
                </th>
                <th className="text-center px-6 py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Status
                </th>
                <th className="text-center px-6 py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Resumes
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Last Active
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cod-gray-100 dark:divide-cod-gray-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-cod-gray-50 dark:hover:bg-cod-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-pink-500 to-primary flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-cod-gray-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-cod-gray-500 dark:text-cod-gray-400">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === 'admin' ? (
                        <ShieldCheck className="w-4 h-4 text-fuchsia-pink-500" />
                      ) : (
                        <Shield className="w-4 h-4 text-cod-gray-400" />
                      )}
                      <span className="text-sm text-cod-gray-700 dark:text-cod-gray-300 capitalize">
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {member.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-cod-gray-600 dark:text-cod-gray-400">
                    {member.resumesCreated}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-cod-gray-500 dark:text-cod-gray-400">
                    {member.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800"
                    >
                      <MoreVertical className="w-4 h-4 text-cod-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
}
