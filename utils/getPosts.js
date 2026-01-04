import { supabase } from '../utils/supabase';

export async function getPosts(limitPosts = 50) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { posts: [], count: 0 };

  const uid = user.id;

  // المحظورين
  const { data: block_list } = await supabase
    .from('block_list')
    .select('*')
    .or(`user_id.eq.${uid},blocked_user_id.eq.${uid}`);

  const blockedIds = [
    ...block_list.map(f => f.blocked_user_id),
    ...block_list.map(f => f.user_id)
  ].filter(id => id !== uid);

  // المنشورات
  const { data: allPosts } = await supabase
    .from('posts')
    .select('*, users(*) , views(post_id)')
    .eq('can_view_post', 'all')
    .not('user_id', 'in', `(${blockedIds.join(',')})`)
   
    .order('post_time', { ascending: false })
    .limit(limitPosts);

  const publicPosts = allPosts.filter(post =>
    !post.users.private_is || post.users.uid === uid
  );

  const postIds = publicPosts.map(p => p.post_id);

  // إحصائيات عامة
  const { data: statsData } = await supabase.rpc('get_post_stats', {
    post_ids: postIds,
    current_user_id: uid
  });

  const { data: recentStatsData } = await supabase.rpc('get_post_stats_since', {
    post_ids: postIds,
    since_time: new Date().toISOString(),
    current_user_id: uid
  });

  const likeCounts = {};
  const commentCounts = {};
  const recentLikes = {};
  const recentComments = {};

  statsData?.forEach(d => {
    likeCounts[d.post_id] = d.likes_count || 0;
    commentCounts[d.post_id] = d.comments_count || 0;
  });

  recentStatsData?.forEach(d => {
    recentLikes[d.post_id] = d.likes_count;
    recentComments[d.post_id] = d.comments_count;
  });

  const { data: reportsData } = await supabase
    .from('reports')
    .select('post_id, user_id');

  const reportsCount = {};
  reportsData?.forEach(r => {
    if (!reportsCount[r.post_id]) reportsCount[r.post_id] = new Set();
    reportsCount[r.post_id].add(r.user_id);
  });

  // دمج البيانات
  const postsWithStats = publicPosts.map(post => {
    const postId = post.post_id;
    const views = post.views.length;

    const engagement = (likeCounts[postId] + commentCounts[postId]) / (views || 1);
    const recentEngagement = (recentLikes[postId] + recentComments[postId]) / (views || 1);

    const reportUsers = reportsCount[postId]?.size || 0;
    let priorityPenalty = reportUsers >= 5 ? 999 : reportUsers >= 3 ? 2 : reportUsers > 1 ? 1 : 0;

    const hoursOld = (Date.now() - new Date(post.post_time).getTime()) / (1000 * 60 * 60);

    let timeBoost = hoursOld < 1 || views < 5 ? 7 : hoursOld < 12 ? 6 : hoursOld < 24 ? 5 : 0;
    const commentRatio = likeCounts[postId] ? commentCounts[postId] / likeCounts[postId] : 0;
    let discussionBoost = commentRatio > 0.5 ? 1 : 0;

    let decayFactor = hoursOld > 24 && hoursOld <= 72 ? 0.95 : hoursOld > 72 && hoursOld <= 168 ? 0.65 : hoursOld > 168 ? 0.1 : 1;
    let reviveBoost = 0;
    if (hoursOld > 24 && recentEngagement > 0.3) reviveBoost = 4;
    if (hoursOld > 48 && recentEngagement > 0.4) reviveBoost = 2;
    if (hoursOld > 168 && recentEngagement > 0.4) reviveBoost = 1;

    return {
      ...post,
      like_count: likeCounts[postId],
      comment_count: commentCounts[postId],
      views,
      engagement_score: engagement,
      recent_engagement_score: recentEngagement,
      report_count: reportUsers,
      priority_penalty: priorityPenalty,
      time_boost: timeBoost,
      discussion_boost: discussionBoost,
      decay_factor: decayFactor,
      revive_boost: reviveBoost
    };
  });

  const filteredPosts = postsWithStats.filter(p => p.priority_penalty < 999);

  return {
    posts: filteredPosts,
    count: publicPosts.length
  };
}
