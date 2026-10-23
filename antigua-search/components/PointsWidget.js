// components/PointsWidget.js
'use client'

import { useState, useEffect } from 'react'

const REWARD_THRESHOLD = 500

export default function PointsWidget({ userId }) {
  const [points, setPoints] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (userId) loadPoints()
  }, [userId])

  const loadPoints = async () => {
    try {
      const res = await fetch(`/api/points/balance?user_id=${userId}`)
      const data = await res.json()
      setPoints(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  const total = points?.total_points || 0
  const lifetime = points?.lifetime_points || 0
  const progress = Math.min(100, (total / REWARD_THRESHOLD) * 100)
  const remaining = REWARD_THRESHOLD - total
  const rewardClaimed = points?.reward_claimed_at

  const actionLabels = {
    listing_claimed: '🏢 Claimed a listing',
    review_approved: '⭐ Review approved',
    review_rejected: '❌ Review removed',
  }

  return (
    <div className="bg-white border-2 border-brand-100 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏆</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Your Points</h3>
            <p className="text-sm text-gray-500">Earn rewards for your contributions</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-brand-600">{total}</div>
          <div className="text-xs text-gray-500">/ {REWARD_THRESHOLD} points</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress to free Featured Listing</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-brand-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {rewardClaimed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700 font-medium">
          🎉 Reward claimed on {new Date(rewardClaimed).toLocaleDateString()} — keep earning!
        </div>
      ) : total >= REWARD_THRESHOLD ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800 font-medium">
          🎁 Reward unlocked! Check your email — your Featured Listing is being activated.
        </div>
      ) : (
        <div className="bg-brand-50 rounded-lg px-3 py-2 text-sm text-brand-700">
          <strong>{remaining} more points</strong> to unlock a free 3-month Featured Listing!
        </div>
      )}

      {/* How to earn */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-brand-600">+25</div>
          <div className="text-xs text-gray-600">Claim a listing</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-brand-600">+10</div>
          <div className="text-xs text-gray-600">Approved review</div>
        </div>
      </div>

      {/* Recent transactions */}
      {points?.recent_transactions?.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-brand-600 hover:underline font-medium"
          >
            {showHistory ? 'Hide' : 'Show'} recent activity
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1">
              {points.recent_transactions.map((tx, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0">
                  <span>{actionLabels[tx.action] || tx.description}</span>
                  <span className={`font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.points > 0 ? '+' : ''}{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {lifetime > 0 && (
        <div className="mt-3 text-xs text-gray-400 text-center">
          {lifetime} lifetime points earned
        </div>
      )}
    </div>
  )
}
