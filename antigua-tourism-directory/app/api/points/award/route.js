// app/api/points/award/route.js
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const POINT_VALUES = {
  listing_claimed: 25,
  review_approved: 10,
  review_rejected: -10
}

const REWARD_THRESHOLD = 500

async function sendPointsEmail(userEmail, userName, points, action, totalPoints) {
  const actionLabels = {
    listing_claimed: 'claiming a business listing',
    review_approved: 'submitting a review',
  }

  const isReward = totalPoints >= REWARD_THRESHOLD
  const subject = isReward
    ? '🎉 You\'ve unlocked your free Featured Listing!'
    : `⭐ You earned ${points} points on AntiguaSearch!`

  const html = isReward ? `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <img src="https://www.antiguasearch.com/antigua-flag.png" alt="AntiguaSearch" style="width:48px;border-radius:50%;margin-bottom:16px;" />
      <h2 style="color:#10b981;">🎉 Congratulations! You've earned a free Featured Listing!</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>You've reached <strong>500 points</strong> on AntiguaSearch — which means you've unlocked a <strong>free 3-month Featured Listing</strong>!</p>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-weight:600;">🎁 Your reward:</p>
        <ul style="margin:8px 0 0;">
          <li>Featured placement at the top of your category</li>
          <li>Featured badge on your listing</li>
          <li>3 months free — no charge</li>
        </ul>
      </div>
      <p>We'll activate your Featured Listing within 24 hours. Reply to this email if you have any questions.</p>
      <p style="color:#666;font-size:13px;">— Jeff Stapley, AntiguaSearch.com</p>
    </div>
  ` : `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <img src="https://www.antiguasearch.com/antigua-flag.png" alt="AntiguaSearch" style="width:48px;border-radius:50%;margin-bottom:16px;" />
      <h2 style="color:#1d4ed8;">⭐ You earned ${points} points!</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>You earned <strong>${points} points</strong> for ${actionLabels[action] || 'your activity'} on AntiguaSearch.</p>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-weight:600;">Your points balance: ${totalPoints} / 500</p>
        <div style="background:#dbeafe;border-radius:4px;height:8px;margin-top:8px;">
          <div style="background:#1d4ed8;border-radius:4px;height:8px;width:${Math.min(100, (totalPoints/500)*100)}%;"></div>
        </div>
        <p style="margin:8px 0 0;font-size:13px;color:#1e40af;">Reach 500 points to unlock a free 3-month Featured Listing!</p>
      </div>
      <p style="color:#666;font-size:13px;">— The AntiguaSearch Team</p>
    </div>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'AntiguaSearch <registrations@antiguasearch.com>',
      reply_to: 'jeff@stapleyinc.com',
      to: [userEmail],
      subject,
      html
    })
  })
}

export async function POST(req) {
  try {
    const { user_id, action, reference_id, description } = await req.json()

    if (!user_id || !action) {
      return NextResponse.json({ error: 'Missing user_id or action' }, { status: 400 })
    }

    const points = POINT_VALUES[action]
    if (points === undefined) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Check for duplicate — prevent awarding same action on same reference twice
    if (reference_id && action !== 'review_rejected') {
      const { data: existing } = await supabase
        .from('point_transactions')
        .select('id')
        .eq('user_id', user_id)
        .eq('action', action)
        .eq('reference_id', reference_id)
        .single()

      if (existing) {
        return NextResponse.json({ message: 'Points already awarded for this action', skipped: true })
      }
    }

    // Insert transaction
    const { error: txError } = await supabase
      .from('point_transactions')
      .insert({
        user_id,
        points,
        action,
        reference_id: reference_id || null,
        description: description || action
      })

    if (txError) throw txError

    // Upsert user_points
    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('total_points, lifetime_points, reward_claimed_at')
      .eq('user_id', user_id)
      .single()

    const currentTotal = currentPoints?.total_points || 0
    const currentLifetime = currentPoints?.lifetime_points || 0
    const newTotal = Math.max(0, currentTotal + points)
    const newLifetime = currentLifetime + Math.max(0, points)

    // Check if reward threshold hit
    const rewardJustUnlocked = currentTotal < REWARD_THRESHOLD && newTotal >= REWARD_THRESHOLD

    const { error: pointsError } = await supabase
      .from('user_points')
      .upsert({
        user_id,
        total_points: rewardJustUnlocked ? 0 : newTotal, // reset on reward
        lifetime_points: newLifetime,
        reward_claimed_at: rewardJustUnlocked ? new Date().toISOString() : currentPoints?.reward_claimed_at,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (pointsError) throw pointsError

    // If reward unlocked — flip listing to featured
    if (rewardJustUnlocked) {
      // Find their first claimed listing that isn't already featured
      const { data: claim } = await supabase
        .from('claimed_listings')
        .select('listing_id')
        .eq('user_id', user_id)
        .eq('verified', true)
        .limit(1)
        .single()

      if (claim) {
        const featuredUntil = new Date()
        featuredUntil.setMonth(featuredUntil.getMonth() + 3)
        await supabase
          .from('listings')
          .update({ featured: true, featured_until: featuredUntil.toISOString() })
          .eq('id', claim.listing_id)
      }
    }

    // Get user email for notification
    const { data: userData } = await supabase.auth.admin.getUserById(user_id)
    if (userData?.user?.email && points > 0) {
      await sendPointsEmail(
        userData.user.email,
        userData.user.user_metadata?.full_name || '',
        points,
        action,
        rewardJustUnlocked ? REWARD_THRESHOLD : newTotal
      )
    }

    return NextResponse.json({
      success: true,
      points_awarded: points,
      new_total: rewardJustUnlocked ? 0 : newTotal,
      reward_unlocked: rewardJustUnlocked
    })

  } catch (err) {
    console.error('Award points error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
