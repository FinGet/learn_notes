export const gWt = ['googleads.g.doubleclick.net', 's1.hdslb.com', 'oapi.dingtalk.com', 'login.dingtalk.com', 'imasdk.googleapis.com', 'acdn.adnxs.com', 'pos.baidu.com', 'js-sec.indexww.com', 'g.alicdn.com', 'ads.pubmatic.com', 'challenges.cloudflare.com', 'accounts.google.com', 'images-na.ssl-images-amazon.com', 'tpc.googlesyndication.com', 'js.stripe.com', 'acdn.adnxs-simple.com', 's.union.360.cn', 's.amazon-adsystem.com', 'www.recaptcha.net', 's7.addthis.com', 'z.moatads.com', 'https://www.marketwatch.com/static_html/daa-min.html', 'tr.snapchat.com', 'ct.pinterest.com', '*.moatads.com', 'secure-us.imrworldwide.com', 'static.noeyeon.click', 'widgets.outbrain.com', 'www.dianomi.com/smartads.epl', 'secure-assets.rubiconproject.com', 'eus.rubiconproject.com', 'eus.rubiconproject.com', 'i.liadm.com', 'eb2.3lift.com'];
export const vWt = ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'G', 'TEXT', 'NOSCRIPT', 'INPUT', 'BASE', 'SELECT', 'OPTION', 'IMG', 'SUB', 'SUP', 'HR', 'PRE', 'CODE', 'KBD', 'WBR', 'TT', 'RT', 'RP', 'META', 'MATH', 'TTS-SENTENCE', 'AIO-CODE'];
export const bWt: string[] = ['.arvin-sidebar', '.arvin-drawer', '.arvin-tooltip'];
export const yWt = [{
	matches: ['*://*/*.txt', 'file://*/*.txt'],
	selectors: ['body'],
	excludeTags: ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'G', 'TEXT', 'NOSCRIPT', 'INPUT', 'BUTTON', 'BASE', 'SELECT', 'OPTION', 'IMG', 'SUB', 'SUP', 'HR', 'CODE', 'KBD', 'WBR', 'TT', 'RT', 'RP', 'META', 'ASIDE', 'FOOTER', 'MATH', 'TTS-SENTENCE']
}, {
	matches: ['mail.jabber.org', 'antirez.com'],
	excludeTags: ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'INPUT', 'LABEL', 'IMG', 'SUB', 'SUP', 'BR', 'CODE', 'KBD', 'WBR', 'TT']
}, {
	matches: '*.wikipedia.org',
	excludeSelectors: ['.mw-editsection', '.mw-cite-backlink', '#mw-panel-toc']
}, {
	matches: ['twitter.com', 'mobile.twitter.com', 'tweetdeck.twitter.com', 'https://platform.twitter.com/embed*'],
	selectors: ['[data-testid="tweetText"]', '.tweet-text', '.js-quoted-tweet-text', "[data-testid='card.layoutSmall.detail'] > div:nth-child(2)", "[data-testid='developerBuiltCardContainer'] > div:nth-child(2)", "[data-testid='card.layoutLarge.detail'] > div:nth-child(2)", "[data-testid='cellInnerDiv'] div[data-testid='UserCell'] > div> div:nth-child(2)", "[data-testid='UserDescription']", "[data-testid='HoverCard'] div[dir=auto]"],
	excludeSelectors: ['header']
}, {
	matches: ['stackoverflow.com', '*.stackexchange.com', 'superuser.com', 'askubuntu.com', 'serverfault.com'],
	excludeSelectors: ['a.comment-user', 'span.comment-date', 'div.s-prose.js-post-body + div', '.bottom-notice', 'div[data-campaign-name=stk]']
}, {
	matches: 'developer.apple.com/documentation/*',
	selectors: ['.container', 'h3.title', 'div.content']
}, {
	matches: 'news.ycombinator.com',
	selectors: ['.titleline > a', '.comment > .commtext', '.toptext', 'a.hn-item-title', '.hn-comment-text', '.hn-story-title'],
	excludeSelectors: ['.reply']
}, {
	matches: ['*.quora.com', 'quora.com'],
	additionalSelectors: ['.puppeteer_test_question_title', 'p.q-text']
}, {
	matches: ['old.reddit.com/*/.compact', 'old.reddit.com/.compact', 'www.reddit.com/*/.compact', 'www.reddit.com/.compact'],
	selectors: ['.title > a', '.usertext-body']
}, {
	matches: 'old.reddit.com',
	selectors: ['p.title > a', '[role=main] .md-container']
}, {
	matches: ['https://www.reddit.com/r/*/comments/*/*', 'https://www.reddit.com/', 'https://www.reddit.com/hot/', 'https://www.reddit.com/new/', 'https://www.reddit.com/top/'],
	excludeMatches: ['https://www.reddit.com/r/*/wiki/*'],
	selectors: ['h1', '.PostHeader__post-title-line', '[data-click-id=body] h3', '[data-click-id=background] h3', '[data-testid=comment]', "[data-adclicklocation='title']", '[data-adclicklocation=media]', '.PostContent', '.post-content', '.Comment__body', 'faceplate-batch .md', '.RichTextJSON-root', 'div[slot=title]', 'div[slot=text-body]']
}, {
	matches: 'www.reddit.com',
	selectors: ['h1', '.PostHeader__post-title-line', '[data-click-id=body] h3', '[data-click-id=background] h3', '[data-testid=comment]', "[data-adclicklocation='title']", '[data-adclicklocation=media]', '.PostContent', '.post-content', '.Comment__body', 'faceplate-batch .md', 'div[slot=title]', 'div[slot=text-body]'],
	excludeMatches: ['https://www.reddit.com/r/*/wiki/*', 'https://www.reddit.com/settings/*']
}, {
	matches: 'www.reuters.com/',
	excludeSelectors: ['header']
}, {
	matches: 'github.com',
	excludeMatches: ['https://github.com/*/*/settings', 'https://github.com/settings/*', 'https://github.com/sponsors/*'],
	selectors: ['.markdown-title', '.markdown-body', '.Layout-sidebar p', 'div > span.search-match', 'li.repo-list-item p', '#responsive-meta-container p', 'article p', 'div.repo-description p', '[itemprop=description]'],
	excludeSelectors: ['.css-truncate', "[data-test-selector='commit-tease-commit-message']", "[data-test-selector='create-branch.developmentForm']", 'div.js-details-container.Details', 'div.Box-header.position-relative', 'div.blob-wrapper-embedded', 'div.Box.Box--condensed.my-2', 'div.jp-CodeCell', '[aria-label="Account"] .markdown-title', '.sr-only']
}, {
	matches: 'notebooks.githubusercontent.com',
	excludeSelectors: ['div.jp-CodeCell']
}, {
	matches: 'www.facebook.com',
	selectors: ['div[dir=auto][style]', 'div[dir=auto][class]', 'span[lang]'],
	excludeSelectors: ['[role=button]']
}, {
	matches: 'm.youtube.com',
	selectors: ['.comment-text', '.media-item-headline', '.slim-video-information-title', '.caption-window', '.caption-visual-line']
}, {
	matches: 'www.youtube.com',
	selectors: ['yt-formatted-string[slot=content].ytd-comment-renderer', 'yt-formatted-string.ytd-video-renderer', 'h1 > yt-formatted-string.ytd-watch-metadata', 'yt-formatted-string#video-title', 'span#video-title', 'a#video-title', 'yt-formatted-string.ytd-transcript-segment-renderer', '#description-inline-expander > yt-attributed-string > span', 'ytd-notification-renderer .message', '.caption-window', '.caption-visual-line'],
	excludeSelectors: ["[class^='lln-']"]
}, {
	matches: 'https://www.instagram.com/*',
	selectors: ['h1']
}, {
	matches: '1paragraph.app',
	selectors: ['#book']
}, {
	matches: 'https://poeditor.com/projects/*',
	selectors: ['.comment-body', '.reference_language .source-string']
}, {
	matches: ['*.substack.com', 'newsletter.rootsofprogress.org'],
	selectors: ['.post-preview-title', '.post-preview-description', '.post', '.comment-body'],
	excludeSelectors: ['.captioned-button-wrap', '.subscription-widget-wrap', '.tweet-header', '.tweet-link-bottom', '.expanded-link', '.meta-subheader']
}, {
	matches: ['seekingalpha.com/article/*', 'seekingalpha.com/news/*'],
	selectors: ['[data-test-id=card-container]', '[data-test-id=comments-section]'],
	excludeSelectors: ['[data-test-id=post-page-meta]', 'header > div:first-child']
}, {
	matches: 'hn.algolia.com',
	selectors: ['.Story_title > a:first-child', '.Story_comment > span']
}, {
	matches: 'read.readwise.io',
	selectors: ["div[class^='_titleRow_']", "div[class^='_description_']", '#document-text-content']
}, {
	matches: ['www.inoreader.com', '*.inoreader.com'],
	selectors: ['.article_header_title', '.article_title_link', '.article_content', '.article_magazine_title_link']
}, {
	matches: '*.ideas.aha.io',
	excludeSelectors: ['.comment-header', '.vote-status', '.idea-meta', '.filters-title', '.ideas-showing-count', '.my-ideas-filters-wrapper', '.statuses-filters-wrapper', '.categories-filters-wrapper', "[class^='attachment']", "span[class^='attachment-name']"]
}, {
	matches: ['scholar.google.com', 'scholar.google.com.hk'],
	selectors: ['h3 a[data-clk]', 'div.gs_rs', 'td a.gsc_a_at', 'td div.gs_gray:last-of-type', 'div.gsc_oci_value']
}, {
	matches: 'mail.google.com',
	selectors: ['h2[data-thread-perm-id]', 'span[data-thread-id]', "div[data-message-id] div[class='']"]
}, {
	matches: 'outlook.live.com',
	excludeSelectors: ['.jHAG3.XG5Jd', '.OZZZK', '.lDdSm'],
	selectors: ['[role=region]']
}, {
	matches: 'www.producthunt.com',
	excludeMatches: 'https://www.producthunt.com/stories/*',
	selectors: ['h2', "div[class^='styles_htmlText__']", "[class^='styles_tagline']", "a[href^='/discussions/'].fontWeight-600", "button[class^='styles_textButton'] > div > span", 'h5 + p'],
	excludeTags: ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'INPUT', 'LABEL', 'IMG', 'SUB', 'SUP', 'BR', 'CODE', 'KBD', 'WBR', 'TT']
}, {
	matches: '*.gitbook.io',
	additionalSelectors: ['main']
}, {
	matches: 'arxiv.org',
	additionalSelectors: ['h1', 'blockquote.abstract']
}, {
	matches: 'https://discord.com/channels/*',
	selectors: ['li[id^=chat-messages] div[id^=message-content]', "h3[data-text-variant='heading-lg/semibold']", "section[aria-label='Search Results'] div[id^=message-content]"],
	excludeSelectors: ['#channels', "div[class^='repliedTextContent']", "div[class^='repliedTextPreview']", "div[class^='messageAttachment']", "div[class^='repliedMessage']", "div[class^='reactionTooltip']", "div[class*='isSystemMessage']", "div[class^='avatarWrapper']", "div[class^='container'] [class^='topLine']", "div[class^='container'] [class^='bottomLine']", "div[class^='container'] [class^='children'] button[class^='component']", "div[class^='userPopoutOverlayBackground'] [class^='userTagNoNickname']", "div[class^='userPopoutOverlayBackgound'] [class^='userTagNoNickname']", "span[class^='botTag']", "h3[class^='header']", "h2[class^='forumPostTitle']", "[class^='title'][aria-label='Channel header']", "div[class^='unreadPill']", "div[class^='sectionHeader']", 'article[class^=embedWrapper] [class^=anchor]', 'article[class^=embedWrapper] [class^=embedProvider]', 'article[class^=embedWrapper] [class^=embedFooter]', "[data-list-item-id^='members'] [class^='username']", "[data-list-item-id^='forum-channel-list'] div[class^='tagsContainer']", "li[class^='containerDefault'] div[class^='channelInfo']", "li[class^='card'] div[class^='tags']", "li[class^='card'] div[class^='footer']"]
}, {
	matches: 'web.telegram.org/z/*',
	selectors: ['.text-content', '.message', '.reply-markup-button-text', '.bot-commands-list-element-description']
}, {
	matches: ['web.telegram.org/k/*', 'web.telegram.org/k/'],
	selectors: ['.message', '.reply-markup-button-text', '.bot-commands-list-element-description']
}, {
	matches: 'gist.github.com',
	selectors: ['.markdown-body', '.readme']
}, {
	matches: 'lobste.rs',
	excludeMatches: ['https://lobste.rs/about', 'https://lobste.rs/chat'],
	selectors: ['.u-repost-of', '.comment_text']
}, {
	matches: '*.slack.com',
	selectors: ['.p-rich_text_block']
}, {
	matches: '1paragraph.app',
	additionalSelectors: ['#book']
}, {
	matches: 'www.artstation.com/artwork/*',
	selectors: ['.project-description', 'div.project-comment-text']
}, {
	matches: 'www.artstation.com/learning/courses/*',
	additionalSelectors: ['footer.learning-course-description.ng-star-inserted > span'],
	excludeSelectors: ['.learning-card-meta']
}, {
	matches: ['https://www.artstation.com/blogs', 'https://www.artstation.com/blogs/*'],
	additionalSelectors: ['.comment-item-body'],
	excludeSelectors: ['blog-card-thumbnail', 'blog-card-header', '.blog-card-author', '.blog-card-meta', '.blog-view-header', '.blog-grid-title', '.post-meta-header']
}, {
	matches: 'www.figma.com/community/*',
	excludeSelectors: ["div[class*='metadataRight']", "div[class*='commentMetaAndOptions']"]
}, {
	matches: 'www.google.*/search*',
	excludeSelectors: ['a h3 + div', 'div#sfooter', 'a[role=presentation] > div > div:first-child', '.b5ZQcf', '.CEMjEf']
}, {
	matches: 'lowendtalk.com',
	selectors: ['[role=heading]', 'h1', '.userContent']
}, {
	matches: 'www.linkedin.com/jobs/*',
	selectors: ['#job-details > span']
}, {
	matches: 'www.linkedin.com',
	additionalSelectors: ['span.break-words > span > span[dir=ltr]']
}, {
	matches: 'www.indiehackers.com',
	selectors: ['.content', 'h1', '.feed-item__title-link']
}, {
	matches: 'libreddit.de',
	selectors: ['h2.post_title', '.comment_body > .md']
}, {
	matches: ['notion.site'],
	selectors: ['div[data-block-id]']
}, {
	matches: 'www.newyorker.com',
	additionalSelectors: ['h1', '[data-testid=SummaryItemHed]']
}, {
	matches: 'start.me',
	selectors: ['.rss-article__title', '.rss-articles-list__article-link', '.rss-showcase__title', '.rss-showcase__text']
}, {
	matches: 'www.scmp.com',
	additionalSelectors: ['.info__subHeadline', '.section-content h2']
}, {
	matches: ['mastodon.social', 'mastodon.online', 'kolektiva.social', 'indieweb.social', 'mastodon.world', 'infosec.exchange'],
	selectors: ['div.status__content__text']
}, {
	matches: 'www.cnbc.com',
	additionalSelectors: ['div.RenderKeyPoints-list']
}, {
	matches: 'app.daily.dev',
	selectors: ['h1', '.typo-body', 'article h3', '[class^=markdown_markdown]']
}, {
	matches: 'www.aljazeera.com',
	additionalSelectors: ['h1', '.article__subhead']
}, {
	matches: ['*.pornhub.com', 'pornhub.com'],
	excludeMatches: ['*.pornhub.com/insights/*', 'pornhub.com/insights/*'],
	selectors: ['.title >a', '.title > span', '.thumbnailTitle', '.commentMessage > span', 'h1.floatLeft', '.commentText']
}, {
	matches: ['weibo.com'],
	selectors: ["div[class^='detail_wbtext']"]
}, {
	matches: ['medium.com', '*.medium.com'],
	selectors: ['article section', 'h2', "[aria-hidden='false'] pre", 'article p'],
	excludeSelectors: ["[aria-label='Post Preview Reading Time']"]
}, {
	matches: '*.fandom.com',
	additionalSelectors: ['.mcf-card-article__title']
}, {
	matches: ['www.washingtonpost.com'],
	additionalSelectors: ["[data-qa='article-body']"]
}, {
	matches: 'www.amazon.com',
	selectors: ['h1', 'h2 > a > span', "[data-a-expander-name='book_description_expander'] > div", "[data-feature-name='editorialReviews']", '[data-a-expander-name="review_text_read_more"] > div > span', '[data-feature-name="featurebullets"]', '[data-feature-name="aplus"']
}, {
	matches: 'marketplace.visualstudio.com',
	additionalExcludeSelectors: ['.core-info-second-row', '.core-info-third-row', '.meta-data-list', '.item-title', '.breadcrumb', '.itemDetails-right', '.ux-user-name', '.ux-updated-date', '.ux-item-second-row-wrapper', '.stats-and-offer', '.header-container']
}, {
	matches: 'www.bloomberg.com',
	excludeSelectors: ['.ticker-bar']
}, {
	matches: 'xueshu.baidu.com'
}, {
	matches: ['*.annas-archive.org', 'annas-archive.org'],
	selectors: ['h3.text-xl.font-bold', "div[class='truncate text-sm']"]
}, {
	matches: ['explainshell.com'],
	selectors: ["[class='help-box']"]
}, {
	matches: 'play.google.com',
	additionalSelectors: ['header[data-review-id] + div']
}, {
	matches: ['www.tumblr.com'],
	selectors: ['article h1', 'article > header + div', '[data-testid=notes-root] p', 'div.k31gt', 'p', 'article ul', 'article h2', 'article h3', 'article h4', 'article h5', 'article h6', 'article blockquote', 'article ol'],
	excludeSelectors: ['div.fAAi8', 'div.wvu3V']
}, {
	matches: ['mail.qq.com/cgi-bin/frame_html'],
	selectors: ['#thisiddoesnotexists']
}, {
	matches: 'www.foxnews.com',
	excludeSelectors: ['.components-MessageDetails-index__message-details-wrapper', 'div[class^=SlideDown__container]', '.components-MessageActions-index__messageActionsWrapper', 'span[data-openweb-allow-amp]', 'div.spcv_typing-users']
}, {
	matches: 'opennet.ru',
	excludeTags: ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'NOSCRIPT', 'INPUT', 'BUTTON', 'BASE', 'LABEL', 'SELECT', 'OPTION', 'IMG', 'SUB', 'SUP', 'HR', 'PRE', 'CODE', 'KBD', 'WBR', 'TT', 'RT', 'RP', 'META']
}, {
	matches: ['www.construct.net'],
	excludeMatches: ['preview.construct.net', 'editor.construct.net'],
	additionalSelectors: ['aside', 'div.manualContent'],
	additionalExcludeSelectors: ['div.topNav', 'div.usernameLink', 'ul.authorDetails', 'ul.tagViewer', 'ul.breadCrumbNav', 'ul.subForumForums', 'ul.postTools', 'li.comment ul.controls', 'div.forumTopNavWrap', 'div.downloadWrap', 'div.articleLeftMenu', 'div.usernameTextWrap', 'div.favouriteWrap', 'div.bannerWrapper', 'div.viewAddonRightMenu', 'div.extendedMenu.addonsSubMenu', '#BottomLinks.bottomLinks', 'div#LeftSide.leftSide', 'div#BottomWrap.bottomWrap', 'div.courseListWrap div.overview', 'div.conversationControls', 'div.contentWrapper h1', 'div.conversationControls', 'td.location a#LocationLink', '#TopLevelComments .topBar', '#TopLevelComments .controls', '.tagViewWrap', '.changeCount', '.otherStats', '.FilterMenu', '.mobileTopicStats', '.forumControlsWrapper', '.forumsBottomNavWrap', '.breadCrumbNav', '.favouriteWrap', '.usernameLink', '.followWrapper', '.blogPostStats', '.manualContent dl dt']
}, {
	matches: 'getpocket.com',
	selectors: ['h2', 'div.excerpt p', 'article', 'h1']
}, {
	matches: '*.fandom.com',
	additionalExcludeSelectors: ['header.fandom-community-header', 'div.ph-registration-buttons']
}, {
	matches: 'https://you.com/search',
	excludeSelectors: ['div.hpIWZO']
}, {
	matches: 'auth0.openai.com',
	excludeSelectors: ['form', 'header > h1']
}, {
	matches: 'chat.openai.com',
	excludeSelectors: ['div.absolute.bottom-0.left-0.w-full', 'h1', 'div#headlessui-portal-root']
}, {
	matches: 'glasp.co',
	excludeSelectors: ['.home_overview_list_content_wrapper']
}, {
	matches: 'developer.chrome.com',
	excludeSelectors: ['web-tabs', 'ul.code-sections--summary']
}, {
	matches: 'https://rarbg.to/*',
	selectors: ['#news_content', '#top_news > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr > td', '#top_news > table > tbody > tr > td > table > tbody > tr > td > h2', 'body > table > tbody > tr > td > div > table > tbody > tr > td > b', '#newsRight > table> tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td', '#newsRight > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > span > b']
}, {
	matches: ['developer.android.google.cn', 'developer.android.com'],
	additionalSelectors: ['aside', 'google-codelab-step']
}, {
	matches: 'https://apps.microsoft.com/store/detail/*',
	additionalSelectors: ['pre']
}, {
	matches: 'gitlab.com',
	excludeSelectors: ['.tree-content-holder', 'nav', '.home-panel-metadata', 'div[data-testid=project_topic_list]', '.commit']
}, {
	matches: 'www.newthingsunderthesun.com',
	additionalSelectors: ['[translate=no]']
}, {
	matches: 'https://www.tiktok.com/*/video/*',
	selectors: ['[data-e2e^=comment-level]', '[data-e2e=browse-video-desc] > span']
}, {
	matches: 'www.rfc-editor.org',
	excludeTags: ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'NOSCRIPT', 'INPUT', 'BUTTON', 'BASE', 'SELECT', 'OPTION', 'IMG', 'SUB', 'SUP', 'HR', 'CODE', 'KBD', 'WBR', 'TT', 'RT', 'RP', 'META', 'ASIDE', 'FOOTER', 'MATH']
}, {
	matches: 'https://steamcommunity.com/app/*',
	excludeSelectors: ['.forum_paging', '.forum_topic_reply_count', '.forum_topic_lastpost', '.forum_topic_award_count', '.discussion_search_pagingcontrols']
}, {
	matches: 'store.steampowered.com/app/*',
	selectors: ['.game_description_snippet', '.game_area_description', '#earlyAccessHeader', "[id^='ReviewContent'] .content"],
	excludeSelectors: ['#global_actions', '#store_controls', '#foryou_tab', '[class*=persona]', '[class*=game_title_area]', 'a.btn_medium', '.persona_name', '.hours.ellipsis', '.checkcol', '.postedDate', '.dev_row .summary', '.already_in_library', '.game_header_image_ctn .grid_content', '.ds_flag.ds_wishlist_flag', '.early_access_review.tooltip', '.communitylink_achievement_images', '.user_reviews_summary_row.summary', '.review_award_ctn', '.add_to_wishlist_area', '.next_in_queue_content', '.glance_tags.popular_tags', '.game_purchase_action', '.vote_button_ctn', '#VoteUpDownBtnCtn', '#footer', '#ViewAllReviewssummary'],
	additionalSelectors: ['.game_page_autocollapse_ctn iframe']
}, {
	matches: 'https://www.nature.com/articles/*',
	excludeSelectors: ['.c-header', '.c-recommendations-header', '.c-recommendations-list-container', '.c-article-references__links', '.c-article-identifiers', '.c-article-author-list', '.c-article-metrics-bar__wrapper', '.c-article__pill-button', '#author-information-content', '#article-info-section']
}, {
	matches: 'https://www.webofscience.com/wos/woscc/summary/*',
	excludeSelectors: ['.summary-left-panel', '.authors', 'app-summary-authors + div']
}, {
	matches: ['appleinsider.com'],
	excludeSelectors: ['#topic-nav']
}, {
	matches: ['https://crates.io/search*'],
	selectors: ['div[class^=_description-box] div[class^=_description]']
}, {
	matches: 'https://www.lookintobitcoin.com/charts/*',
	excludeSelectors: ['svg']
}, {
	matches: 'https://pkg.go.dev/std',
	selectors: ['td.UnitDirectories-desktopSynopsis']
}, {
	matches: 'https://pkg.go.dev/*',
	selectors: ['div.UnitDetails p']
}, {
	matches: ['https://www.explainpaper.com/reader*'],
	selectors: ['.leading-relaxed', '.chat-messages p', '.text-sm']
}, {
	matches: 'https://colab.research.google.com/*',
	excludeSelectors: ['code', 'view-line']
}, {
	matches: 'wandb.ai',
	additionalSelectors: ['.report-page-top']
}, {
	matches: 'paulgraham.com',
	additionalSelectors: ['font[face=verdana]']
}, {
	matches: 'https://*.zendesk.com/agent/*',
	selectors: ['[data-test-id*=subject]', '.zd-comment', '.title']
}, {
	matches: 'webmail.migadu.com',
	selectors: ['.bodyText']
}, {
	matches: 'thehackernews.com',
	excludeSelectors: ['span#blog-pager-older-link', 'span.h-datetime'],
	additionalSelectors: ['.pop-title']
}, {
	matches: 'cs.brown.edu',
	excludeSelectors: ['.SCodeFlow']
}, {
	matches: 'chat.google.com',
	selectors: ['[jsname=bgckF]', '[dir=ltr]']
}, {
	matches: 'https://www.fiverr.com/inbox/*',
	selectors: ['.message-body']
}, {
	matches: ['jira.*.com/browse/*', 'jira.*.com/projects/*'],
	selectors: ['[id=descriptionmodule]', '[id=summary-val]', 'div.action-body', 'td.stsummary']
}, {
	matches: ['*.aha.io'],
	selectors: ["[tabindex='0']", 'div.user-content', 'div.comments__body', 'span.name']
}, {
	matches: 'thehill.com',
	excludeSelectors: ['div.featured-cards__byline', 'div.list-item__meta', '.tags__item', 'div.extended-scroll__header', '.submitted-by', '.site-header--has-alert-banner', '.homepage__container__opinion__item__byline', '.homepage__container__header', '.archive__item__meta']
}, {
	matches: 'manpages.ubuntu.com',
	selectors: ['pre']
}, {
	matches: 'www.spiedigitallibrary.org',
	excludeTags: ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'svg', 'G', 'NOSCRIPT', 'INPUT', 'BUTTON', 'BASE', 'SELECT', 'OPTION', 'IMG', 'SUB', 'SUP', 'HR', 'PRE', 'CODE', 'KBD', 'WBR', 'TT', 'RT', 'RP', 'META', 'ASIDE', 'FOOTER', 'MATH', 'TTS-SENTENCE', 'AIO-CODE']
}, {
	matches: 'www.promptingguide.ai',
	selectors: ['article', 'li']
}, {
	matches: 'ground.news'
}, {
	matches: '*.ietf.org/doc/html/*',
	additionalSelectors: ['pre']
}];

export const xWt = ['SUB', 'SUP', 'PRE', 'CODE', 'MATH', 'AIO-CODE'];

export const standardizeLocale = (locale: string) => {
	switch (locale) {
		case 'pt-BR':
			return 'pt';
		case 'zh-TW':
		case 'zh-HK':
			return 'zh-Hant';
		default:
			return locale;
	}
};