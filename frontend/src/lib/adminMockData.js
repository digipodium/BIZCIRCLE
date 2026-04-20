/**
 * Mock data for BizCircle Admin Dashboard
 */

export const MOCK_STATS = [
  { id: 'total-users', label: 'Total Users', value: 1248, icon: 'Users', color: '#2563eb', trend: '+12%' },
  { id: 'active-users', label: 'Active Users', value: 856, icon: 'Activity', color: '#059669', trend: '+5%' },
  { id: 'total-groups', label: 'Total Groups', value: 42, icon: 'Grid', color: '#7c3aed', trend: '+2' },
  { id: 'posts-today', label: 'Posts Today', value: 156, icon: 'FileText', color: '#ea580c', trend: '+18%' },
  { id: 'pending-reports', label: 'Pending Reports', value: 12, icon: 'AlertCircle', color: '#dc2626', trend: '-2' },
];

export const USER_GROWTH_DATA = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 600 },
  { month: 'Mar', users: 800 },
  { month: 'Apr', users: 1000 },
  { month: 'May', users: 1100 },
  { month: 'Jun', users: 1248 },
];

export const ENGAGEMENT_STATS = [
  { name: 'Mon', posts: 40, comments: 240, likes: 450 },
  { name: 'Tue', posts: 30, comments: 139, likes: 320 },
  { name: 'Wed', posts: 20, comments: 980, likes: 580 },
  { name: 'Thu', posts: 27, comments: 390, likes: 420 },
  { name: 'Fri', posts: 18, comments: 480, likes: 390 },
  { name: 'Sat', posts: 23, comments: 380, likes: 290 },
  { name: 'Sun', posts: 34, comments: 430, likes: 380 },
];

export const RECENT_ACTIVITY = [
  { id: 1, type: 'user', action: 'New user registered', target: 'Alice Johnson', time: '2 mins ago' },
  { id: 2, type: 'post', action: 'Reported post removed', target: 'Spam Post #44', time: '15 mins ago' },
  { id: 3, type: 'group', action: 'New group approved', target: 'Tech Enthusiasts', time: '1 hour ago' },
  { id: 4, type: 'report', action: 'New report filed', target: 'Suspicious User', time: '2 hours ago' },
];

export const MOCK_USERS = [
  { id: 1, name: 'Sudeshna Mukherjee', email: 'sudeshna@bizcircle.io', role: 'Admin', status: 'Active', joined: '2026-01-15' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Moderator', status: 'Active', joined: '2026-02-10' },
  { id: 3, name: 'Priya Patel', email: 'priya@example.com', role: 'User', status: 'Suspended', joined: '2026-03-05' },
  { id: 4, name: 'Amit Kumar', email: 'amit@example.com', role: 'User', status: 'Active', joined: '2026-03-12' },
  { id: 5, name: 'Sneha Gupta', email: 'sneha@example.com', role: 'User', status: 'Banned', joined: '2026-04-01' },
];

export const MOCK_REPORTS = [
  { id: 1, type: 'Post', target: 'Startup Funding 101', reason: 'Spam/Irrelevant', status: 'Pending', reporter: 'User_44' },
  { id: 2, type: 'User', target: 'Spammer_Joe', reason: 'Harassment', status: 'Resolved', reporter: 'User_12' },
  { id: 3, type: 'Group', target: 'Illegal Trading', reason: 'Policy Violation', status: 'Pending', reporter: 'Mod_Rahul' },
];

export const ADMIN_LOGS = [
  { id: 1, admin: 'Sudeshna', action: 'Banned User', target: 'Sneha Gupta', time: '2026-04-19 10:30' },
  { id: 2, admin: 'Rahul', action: 'Deleted Post', target: 'Spam #88', time: '2026-04-19 09:15' },
  { id: 3, admin: 'Sudeshna', action: 'Updated Settings', target: 'Maintenance Mode', time: '2026-04-18 22:00' },
];
