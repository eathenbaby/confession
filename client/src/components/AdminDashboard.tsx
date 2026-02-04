'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  CheckCircle,
  XCircle,
  Instagram,
  Edit,
  DollarSign,
  Mail,
  AlertTriangle,
  Download,
  Eye,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Confession {
  id: string;
  confessionNumber: number;
  senderName: string;
  senderInstagram: string;
  vibeType: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'posted';
  validationScore: number;
  flaggedForReview: boolean;
  adminNotes?: string;
  postedToInstagram: boolean;
  instagramPostUrl?: string;
  createdAt: string;
  postedAt?: string;
  revealRequests?: RevealRequest[];
}

interface RevealRequest {
  id: string;
  requesterInstagram: string;
  requesterName?: string;
  paymentStatus: 'pending' | 'paid' | 'revealed';
  paymentAmount: number;
  createdAt: string;
}

interface AdminStats {
  pendingConfessions: number;
  approvedConfessions: number;
  postedConfessions: number;
  totalRevenue: number;
  totalReveals: number;
}

export default function AdminDashboard() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    pendingConfessions: 0,
    approvedConfessions: 0,
    postedConfessions: 0,
    totalRevenue: 0,
    totalReveals: 0
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'posted'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfessions();
    fetchStats();
  }, [filter]);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/confessions?status=${filter}`);
      const data = await response.json();
      setConfessions(data.confessions || []);
    } catch (error) {
      console.error('Failed to fetch confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (confessionId: string) => {
    try {
      await fetch('/api/admin/confessions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId })
      });
      fetchConfessions();
      fetchStats();
    } catch (error) {
      console.error('Failed to approve confession:', error);
    }
  };

  const handleReject = async (confessionId: string) => {
    try {
      await fetch('/api/admin/confessions/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId })
      });
      fetchConfessions();
      fetchStats();
    } catch (error) {
      console.error('Failed to reject confession:', error);
    }
  };

  const generateInstagramPost = async (confessionId: string) => {
    try {
      const response = await fetch('/api/instagram/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId })
      });
      const data = await response.json();
      
      // Download the generated image
      const link = document.createElement('a');
      link.href = data.imageUrl;
      link.download = `confession-${confessionId}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to generate Instagram post:', error);
    }
  };

  const createPaymentLink = async (confessionId: string, requestId: string) => {
    try {
      const response = await fetch('/api/payments/create-reveal-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId, requestId })
      });
      const data = await response.json();
      
      // Copy to clipboard
      navigator.clipboard.writeText(data.paymentUrl);
      alert('Payment link copied to clipboard!');
    } catch (error) {
      console.error('Failed to create payment link:', error);
    }
  };

  const revealName = async (confessionId: string, requestId: string) => {
    try {
      await fetch('/api/admin/reveals/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId, requestId })
      });
      alert('Name revealed to requester via DM!');
      fetchConfessions();
    } catch (error) {
      console.error('Failed to reveal name:', error);
    }
  };

  const getVibeIcon = (vibeType: string) => {
    const icons: Record<string, string> = {
      coffee_date: '☕',
      dinner: '🍽️',
      just_talk: '💬',
      study_session: '📚',
      adventure: '🌟',
      the_one: '💕'
    };
    return icons[vibeType] || '💕';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      posted: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          💕 Confession Platform Admin
        </h1>
        <p className="text-gray-600 mt-2">Manage anonymous confessions and reveal requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Confessions</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingConfessions}</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedConfessions}</div>
              <p className="text-xs text-muted-foreground">Ready to post</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posted</CardTitle>
              <Instagram className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.postedConfessions}</div>
              <p className="text-xs text-muted-foreground">On Instagram</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From reveals</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        {(['all', 'pending', 'approved', 'posted'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Confessions List */}
      <div className="space-y-6">
        {confessions.map((confession, index) => (
          <motion.div
            key={confession.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Confession #{confession.confessionNumber}
                    </CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>From: <strong>{confession.senderName}</strong></span>
                      <span>(@{confession.senderInstagram})</span>
                      <span>✅ Verified</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(confession.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(confession.status)}>
                    {confession.status.charAt(0).toUpperCase() + confession.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Vibe */}
                <div className="mb-4">
                  <span className="text-sm font-semibold">Vibe:</span>{' '}
                  <span className="text-lg ml-2">
                    {getVibeIcon(confession.vibeType)} {confession.vibeType.replace('_', ' ').charAt(0).toUpperCase() + confession.vibeType.slice(1).replace('_', ' ')}
                  </span>
                </div>

                {/* Message */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg mb-4">
                  <p className="text-gray-800 italic leading-relaxed">
                    "{confession.message}"
                  </p>
                </div>

                {/* Validation Score */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-semibold">Validation Score:</span>
                  <Badge variant={confession.validationScore >= 70 ? 'default' : 'destructive'}>
                    {confession.validationScore}% {confession.validationScore >= 70 ? '✅' : '⚠️'}
                  </Badge>
                  {confession.flaggedForReview && (
                    <Badge variant="outline">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flagged for Review
                    </Badge>
                  )}
                </div>

                {/* Reveal Requests */}
                {confession.revealRequests && confession.revealRequests.length > 0 && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Reveal Requests ({confession.revealRequests.length})
                    </h4>
                    {confession.revealRequests.map((request) => (
                      <div key={request.id} className="flex justify-between items-center mb-2 p-2 bg-white rounded">
                        <div>
                          <span className="font-medium">@{request.requesterInstagram}</span>
                          {request.requesterName && <span className="ml-2 text-gray-600">({request.requesterName})</span>}
                          <Badge className="ml-2" variant={
                            request.paymentStatus === 'paid' ? 'default' :
                            request.paymentStatus === 'revealed' ? 'secondary' : 'outline'
                          }>
                            {request.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {request.paymentStatus === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => createPaymentLink(confession.id, request.id)}
                            >
                              💳 Send Payment Link
                            </Button>
                          )}
                          {request.paymentStatus === 'paid' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => revealName(confession.id, request.id)}
                            >
                              ✉️ Reveal Name (${request.paymentAmount / 100})
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {confession.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApprove(confession.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(confession.id)}
                        variant="destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}

                  {(confession.status === 'approved' || confession.status === 'posted') && (
                    <Button
                      onClick={() => generateInstagramPost(confession.id)}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate IG Post
                    </Button>
                  )}

                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {confessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No confessions found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
