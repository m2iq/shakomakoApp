import { supabase } from '../utils/supabase';

export async function getPosts(limitPosts = 50) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { posts: [], count: 0 };

  const uid = user.id;
const bannedGroups = {
   sexual: [
    'sex',
    'porn',
    'xxx',
    'جنس',
    'عري'
  ],
  political: [
    // --- الفصائل والقوى المسلحة (السياسية) ---
    'حشد', 'الحشد', 'حشد شعبي', 'الحشد الشعبي', 'فصائل', 'الفصائل', 'مقاومة', 'المقاومة',
    'سرايا السلام', 'السرايا', 'جيش المهدي', 'الجيش', 'عصائب', 'العصائب', 'عصائب أهل الحق',
    'كتائب حزب الله', 'الكتائب', 'منظمة بدر', 'بدر', 'سيد الشهداء', 'النجباء', 'حركة النجباء',
    'كتائب الإمام علي', 'جند الإمام', 'سرايا عاشوراء', 'سرايا الخراساني', 'بيشمركة', 'البيشمركة',
    
    // --- الكتل والتحالفات السياسية ---
    'إطار تنسيقي', 'الإطار التنسيقي', 'تنسيقي', 'التنسيقي', 'تيار صدري', 'التيار الصدري',
    'صدريين', 'الصدريين', 'دولة القانون', 'ائتلاف النصر', 'تيار الحكمة', 'الحكمة',
    'تحالف الفتح', 'الفتح', 'حزب تقدم', 'تقدم', 'حزب السيادة', 'السيادة', 'تحالف تصميم',
    'ديمقراطي كردستاني', 'اتحاد وطني', 'حراك الجيل الجديد', 'امتداد', 'حركة امتداد',
    'اشراقة كانون', 'عقد وطني', 'العقد الوطني', 'رفاق', 'الرفاق', 'بعثيين', 'البعثيين',
    
    // --- مصطلحات الاحتجاج والشارع السياسي العراقي ---
    'تشرين', 'التشرين', 'تشريني', 'التشرينيين', 'جوكر', 'الجوكر', 'جوكرية', 'الجوكرية',
    'ذيول', 'الذيول', 'ذيلة', 'الذيلة', 'ولائي', 'الولائي', 'ولائيين', 'الولائيين',
    'مندسين', 'المندسين', 'طرف ثالث', 'الطرف الثالث', 'خضراء', 'الخضراء', 'منطقة خضراء',
    'حواسم', 'الحواسم', 'فضائيين', 'الفضائيين', 'رفيق', 'الرفيق', 'ماجدات', 'الماجدات',
    
    // --- مؤسسات ومناصب عراقية ---
    'برلمان', 'البرلمان', 'مجلس نواب', 'المجلس', 'رئاسة وزراء', 'الرئاسة', 'وزير', 'الوزير',
    'محكمة اتحادية', 'المحكمة', 'مفوضية انتخابات', 'المفوضية', 'نزاهة', 'النزاهة',
    'اجتثاث', 'الاجتثاث', 'مساءلة وعدالة', 'المساءلة', 'قانون انتخابات', 'الدستور',
    'رئاسة الجمهورية', 'مجلس محافظة', 'المحافظ', 'حلبوسي', 'سوداني', 'مالكي', 'خزعلي',
    
    // --- مصطلحات الحكم والفساد ---
    'محاصصة', 'المحاصصة', 'طائفية', 'الطائفية', 'فساد', 'الفساد', 'مفسدين', 'المفسدين',
    'سرقة القرن', 'تزوير', 'التزوير', 'كوميشن', 'الكوميشن', 'عقود دولية', 'تطبيع', 'التطبيع',
    'عملاء', 'العملاء', 'عمالة', 'العمالة', 'خيانة', 'الخيانة', 'ديكتاتورية', 'الديمقراطية'
  ],
  violence: [
    // --- أسلحة شائعة في الصراع العراقي ---
    'كاتيوشا', 'الكاتيوشا', 'صاروخ', 'الصاروخ', 'صواريخ', 'الصواريخ', 'هاون', 'الهاون',
    'عبوة', 'العبوة', 'عبوات', 'العبوات', 'ناسفة', 'الناسفة', 'مفخخة', 'المفخخة',
    'مسيرة', 'المسيرة', 'درون', 'الدرون', 'انتحاري', 'الانتحاري', 'حزام ناسف', 'الحزام',
    'كلاشينكوف', 'بي كي سي', 'قاذفة', 'القاذفة', 'كاتم', 'الكاتم', 'سلاح منفلت',
    
    // --- أعمال العنف والجرائم ---
    'قتل', 'القتل', 'اغتيال', 'الاغتيال', 'تصفية', 'التصفية', 'خطف', 'الخطف', 'مخطوف',
    'تعذيب', 'التعذيب', 'ذبح', 'الذبح', 'نحر', 'النحر', 'تفجير', 'التفجير', 'انفجار',
    'استهداف', 'الاستهداف', 'قصف', 'القصف', 'إعدام', 'الإعدام', 'رمي', 'الرمي',
    'إطلاق نار', 'الاشتباك', 'اشتباكات', 'دكة عشائرية', 'الدكة', 'نهب', 'النهب',
    
    // --- تنظيمات إرهابية وتاريخية ---
    'داعش', 'الداعش', 'دواعش', 'الدواعش', 'قاعدة', 'القاعدة', 'تنظيم', 'التنظيم',
    'خوارج', 'الخوارج', 'تكفيري', 'التكفيري', 'إرهاب', 'الإرهاب', 'إرهابي', 'الإرهابيين',
    'فدائيين', 'الفدائيين', 'جند السماء', 'مليشيا', 'المليشيا', 'مليشيات', 'المليشيات',
    'عصابة', 'العصابة', 'عصابات', 'العصابات', 'قاطع الطريق', 'متمردين', 'المتمردين',
    
    // --- مصطلحات الموت والحروب ---
    'شهيد', 'الشهيد', 'شهداء', 'الشهداء', 'استشهاد', 'الاستشهاد', 'قتيل', 'القتيل',
    'جثة', 'الجثة', 'جثث', 'الجثث', 'مقبرة جماعية', 'المقابر', 'دم', 'الدم', 'دماء',
    'إبادة', 'الإبادة', 'مجزرة', 'المجزرة', 'مجازر', 'المجازر', 'حرب', 'الحرب',
    'غزو', 'الغزو', 'احتلال', 'الاحتلال', 'تحرير', 'التحرير'
  ]
};


  // جلب المحظورين
  const { data: block_list } = await supabase
    .from('block_list')
    .select('*')
    .or(`user_id.eq.${uid},blocked_user_id.eq.${uid}`);

  const blockedIds = [
    ...block_list.map(f => f.blocked_user_id),
    ...block_list.map(f => f.user_id)
  ].filter(id => id !== uid);

  // جلب المنشورات
  let query = supabase
    .from('posts')
    .select('*, users(*) , views(post_id)')
    .eq('can_view_post', 'all')
    .not('user_id', 'in', `(${blockedIds.join(',')})`)
    .gte('post_time', new Date() - 150 * 24 * 60 * 60 * 1000)
    .order('post_time', { ascending: false })
    .limit(1300);
  
const matchBannedGroups = (text = '') => {
  const lower = text.toLowerCase();
  let matchedGroups = 0;

  for (const group in bannedGroups) {
    const found = bannedGroups[group].some(word =>
      lower.includes(word.toLowerCase())
    );

    if (found) matchedGroups++;

    // لو تحقّق الشرط (مثلاً مجموعتين)
    if (matchedGroups >= 2) return true;
  }

  return false;
};

  const { data: allPosts } = await query;

const publicPosts = allPosts.filter(post => {
  const canView = post.users.private_is === false || post.users.uid === uid;
  if (!canView) return false;

  // تحقق من العنوان إذا حساس
  const isSensitive = matchBannedGroups(post.title);

  // نخفيه عن الكل ما عدا صاحبه
 if ((post.users.shadow_banned && post.user_id !== uid) || (isSensitive && post.user_id !== uid)) {
  return false;
}


  return true;
});


  const postIds = publicPosts.map(p => p.post_id);

  // إحصائيات عامة
  const { data: statsData , error : errState} = await supabase
    .rpc('get_post_stats', { 
       post_ids: postIds,
       current_user_id: uid
    });
 if(errState){
  console.log(errState);
  return
 }
  const { data: recentStatsData, error: statsError } = await supabase
    .rpc('get_post_stats_since', { 
       post_ids: postIds,
       since_time: new Date().toISOString(), 
       current_user_id: uid
    });

  if (statsError) console.error('Stats RPC error:', statsError);

  const likeCounts = {};
  const commentCounts = {};
  const recentLikes = {};
  const recentComments = {};
statsData?.forEach((data) => {
  likeCounts[data.post_id] = data.likes_count || 0;
  commentCounts[data.post_id] = data.comments_count || 0;
});


  recentStatsData?.forEach((data) => {
    recentLikes[data.post_id] = data.likes_count;
    recentComments[data.post_id] = data.comments_count;
  });

  // البلاغات
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
    const likeCount = likeCounts[postId] || 0;
    const commentCount = commentCounts[postId] || 0;
    const views = post.views.length;
    const engagement = (likeCount + commentCount) / (views || 1);

    const recentLikeCount = recentLikes[postId] || 0;
    const recentCommentCount = recentComments[postId] || 0;
    const recentEngagement = (recentLikeCount + recentCommentCount) / (views || 1);

    const reportUsers = reportsCount[postId]?.size || 0;

    let priorityPenalty = 0;
    if (reportUsers >= 5) priorityPenalty = 999;
    else if (reportUsers >= 3) priorityPenalty = 2;
    else if (reportUsers > 1) priorityPenalty = 1;

    const hoursOld = (new Date().getTime() - post.post_time) / (1000 * 60 * 60);
    // Boost للمنشورات الجديدة أو قليل المشاهدات (<8)
    let timeBoost = 0;
    
    if (hoursOld < 1 || views < 5) {
      timeBoost = 7;
    } else if (hoursOld < 12) {
      timeBoost = 6;
    }else if (hoursOld < 24) {
      timeBoost = 5;
    }

    const commentRatio = likeCount > 0 ? commentCount / likeCount : 0;
    let discussionBoost = commentRatio > 0.5 ? 1 : 0;

    let decayFactor = 1;
    if (hoursOld > 24 && hoursOld <= 72) decayFactor = 0.95;
    else if (hoursOld > 72 && hoursOld <= 168) decayFactor = 0.65;
    else if (hoursOld > 168) decayFactor = 0.1;

    let reviveBoost = 0;
    if (hoursOld > 24 && recentEngagement > 0.3) reviveBoost = 4;
    if (hoursOld > 48 && recentEngagement > 0.4) reviveBoost = 2;
    if (hoursOld > 168 && recentEngagement > 0.4) reviveBoost = 1;

    return {
      ...post,
      like_count: likeCount,
      comment_count: commentCount,
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

  // قيم التفاعل المطلوبة حسب المشاهدات
  const getRequiredEngagement = (views) => {
    if (views < 5) return 0;
    if (views < 10) return 0.20;
    if (views < 15) return 0.25;
    if (views < 20) return 0.30;
    if (views < 30) return 0.35;
    return 0.36;
  };

  const newPosts = filteredPosts.filter(p => p.views < 5);
  const oldPosts = filteredPosts.filter(p => p.views >= 5);

  const sortedOldPosts = oldPosts.sort((a, b) => {
    const getPriority = (post) => {
      let priority = 0;
      const required = getRequiredEngagement(post.views);
      if (post.engagement_score >= required) priority += 2 + post.engagement_score * 3;
      else priority -= 1;
      priority += post.time_boost;
      priority += post.discussion_boost;
      priority += post.revive_boost;
      priority = priority * post.decay_factor;
      priority -= post.priority_penalty;
      return priority;
    };

    const priorityDiff = getPriority(b) - getPriority(a);
    if (priorityDiff !== 0) return priorityDiff;

    const engagementDiff = b.engagement_score - a.engagement_score;
    if (engagementDiff !== 0) return engagementDiff;

    return b.post_time.localeCompare(a.post_time);
  });

  const sortedPosts = [...newPosts, ...sortedOldPosts];

  return {
    posts: sortedPosts.slice(0, limitPosts),
    count: publicPosts.length
  };
}
