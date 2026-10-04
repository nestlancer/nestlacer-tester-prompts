# Backend controller endpoints (static regex inventory)

Controllers: 108; decorator operations: 1282

## `gateway/src/modules/admin/admin.controller.ts` — `@Controller(admin)`

- `GET /admin/dashboard/overview` — `getDashboardOverview`
- `GET /admin/dashboard/revenue` — `getRevenueAnalytics`
- `GET /admin/dashboard/users` — `getUserMetrics`
- `GET /admin/dashboard/analytics/users` — `getUserAnalyticsAlias`
- `GET /admin/dashboard/projects` — `getProjectMetrics`
- `GET /admin/dashboard/analytics/projects` — `getProjectAnalyticsAlias`
- `GET /admin/analytics/users` — `getAnalyticsUsers`
- `GET /admin/analytics/projects` — `getAnalyticsProjects`
- `GET /admin/dashboard/performance` — `getPerformanceMetrics`
- `GET /admin/dashboard/activity` — `getRecentActivity`
- `GET /admin/dashboard/alerts` — `getSystemAlerts`
- `GET /admin/reports` — `listAnalyticsReports`
- `POST /admin/reports` — `generateAnalyticsReport`
- `GET /admin/reports/:id/download` — `downloadAnalyticsReport`
- `GET /admin/users` — `listUsers`
- `GET /admin/users/search` — `searchUsers`
- `GET /admin/users/:userId` — `getUser`
- `PATCH /admin/users/:userId` — `updateUser`
- `PATCH /admin/users/:userId/role` — `changeUserRole`
- `PATCH /admin/users/:userId/status` — `changeUserStatus`
- `POST /admin/users/:userId/force-password-reset` — `forcePasswordReset`
- `POST /admin/users/:userId/reset-password` — `adminResetPassword`
- `GET /admin/users/:userId/sessions` — `getUserSessions`
- `DELETE /admin/users/sessions/:sessionId` — `terminateAnySession`
- `POST /admin/users/:userId/terminate-all-sessions` — `terminateAllUserSessions`
- `GET /admin/users/:userId/activity` — `getUserActivity`
- `DELETE /admin/users/:userId` — `deleteUser`
- `POST /admin/users/:userId/restore` — `restoreUser`
- `POST /admin/users/bulk` — `bulkUserOperations`
- `GET /admin/users/logs` — `getUsersLogs`
- `GET /admin/users/security-stats` — `getUsersSecurityStats`
- `GET /admin/users/logs/security-stats` — `getUsersLogsSecurityStats`
- `GET /admin/logs` — `getAuditLogs`
- `GET /admin/logs/security-stats` — `getSecurityStats`
- `POST /admin/audit/export` — `exportAuditLogs`
- `GET /admin/audit` — `listSystemAuditLogs`
- `GET /admin/audit/logs` — `listSystemAuditLogsAlias`
- `GET /admin/audit/stats` — `getAuditStats`
- `GET /admin/audit/user/:userId` — `getUserAuditTrail`
- `GET /admin/audit/resource/:type/:id` — `getResourceAuditTrail`
- `GET /admin/audit/:id` — `getAuditEntry`
- `GET /admin/system/config` — `getSystemConfig`
- `PATCH /admin/system/config` — `updateSystemConfig`
- `GET /admin/system/features` — `getSystemFeatures`
- `PATCH /admin/system/features/:flag` — `patchSystemFeature`
- `GET /admin/system/jobs` — `getSystemJobs`
- `POST /admin/system/jobs/:id/retry` — `retrySystemJob`
- `DELETE /admin/system/jobs/:id` — `cancelSystemJob`
- `GET /admin/system/email-templates` — `getEmailTemplates`
- `POST /admin/system/email-templates` — `createEmailTemplate`
- `POST /admin/system/email-templates/preview` — `previewEmailTemplateCollection`
- `GET /admin/system/email-templates/:id` — `getEmailTemplate`
- `PATCH /admin/system/email-templates/:id` — `updateEmailTemplate`
- `GET /admin/system/email-templates/:id/preview` — `previewEmailTemplate`
- `POST /admin/system/email-templates/:id/test` — `sendTestEmail`
- `POST /admin/system/cache/clear` — `clearSystemCache`
- `POST /admin/system/cache/clear/:key` — `clearSystemCacheKey`
- `GET /admin/system/logs` — `getSystemLogs`
- `GET /admin/system/logs/download` — `downloadSystemLogs`
- `POST /admin/system/announcements` — `sendSystemAnnouncement`
- `POST /admin/system/maintenance` — `toggleMaintenanceMode`
- `POST /admin/users/:userId/impersonate` — `startImpersonation`
- `POST /admin/users/:userId/export` — `exportUserData`
- `POST /admin/users/impersonate/end/:sessionId` — `endImpersonation`
- `POST /admin/impersonate/end` — `endImpersonationAlias`
- `GET /admin/impersonate/sessions` — `getImpersonationSessions`
- `GET /admin/payments` — `listAdminPayments`
- `GET /admin/payments/stats` — `getPaymentStats`
- `GET /admin/payments/summary` — `getPaymentSummary`
- `GET /admin/payments/milestones` — `listPaymentMilestones`
- `GET /admin/payments/milestones/:id` — `getPaymentMilestone`
- `POST /admin/payments/milestones/:id/mark-complete` — `markMilestoneComplete`
- `POST /admin/payments/milestones/:id/request-payment` — `requestMilestonePayment`
- `POST /admin/payments/milestones/:id/release` — `releaseMilestonePayment`
- `POST /admin/payments/projects/:projectId/milestones` — `createProjectMilestones`
- `PATCH /admin/payments/milestones/:id` — `updateMilestone`
- `GET /admin/payments/disputes` — `listPaymentDisputes`
- `GET /admin/payments/disputes/:id` — `getDisputeDetails`
- `PATCH /admin/payments/disputes/:id` — `updatePaymentDispute`
- `POST /admin/payments/disputes/:id/resolve` — `resolvePaymentDispute`
- `GET /admin/payments/revenue/export` — `exportRevenue`
- `GET /admin/payments/:id/receipt` — `getAdminPaymentReceipt`
- `GET /admin/payments/:id/documents/versions` — `getAdminPaymentDocumentVersions`
- `GET /admin/payments/:id/invoice` — `getAdminPaymentInvoice`
- `GET /admin/payments/reconciliation` — `getReconciliation`
- `GET /admin/payments/revenue/report` — `getRevenueReport`
- `GET /admin/payments/methods/supported` — `getSupportedPaymentMethods`
- `GET /admin/payments/accounts` — `listPlatformPaymentAccounts`
- `POST /admin/payments/accounts` — `createPlatformPaymentAccount`
- `PATCH /admin/payments/accounts/:id` — `updatePlatformPaymentAccount`
- `DELETE /admin/payments/accounts/:id` — `deletePlatformPaymentAccount`
- `GET /admin/payments/company-legal` — `listCompanyLegalProfiles`
- `POST /admin/payments/company-legal` — `createCompanyLegalProfile`
- `PATCH /admin/payments/company-legal/:id` — `updateCompanyLegalProfile`
- `DELETE /admin/payments/company-legal/:id` — `deleteCompanyLegalProfile`
- `POST /admin/payments/manual` — `recordManualPayment`
- `POST /admin/payments/:id/manual-payment` — `recordManualPaymentById`
- `POST /admin/payments/projects/:projectId/reconcile-state` — `reconcileProjectPaymentState`
- `POST /admin/payments/reconcile` — `runPaymentReconciliation`
- `PATCH /admin/payments/settings` — `updatePaymentSettings`
- `GET /admin/payments/milestones/:id/payments` — `getMilestonePayments`
- `GET /admin/payments/:id` — `getAdminPaymentDetails`
- `GET /admin/payments/:id/transactions` — `getPaymentTransactions`
- `GET /admin/payments/:id/timeline` — `getPaymentTimeline`
- `POST /admin/payments/:id/refund` — `processPaymentRefund`
- `POST /admin/payments/:id/cancel` — `cancelPayment`
- `POST /admin/payments/:id/verify` — `verifyPayment`
- `POST /admin/payments/:id/approve-transfer` — `approveTransfer`
- `POST /admin/payments/:id/reject-transfer` — `rejectTransfer`
- `POST /admin/payments/disputes/:id/respond` — `respondDispute`
- `POST /admin/messages/projects/:projectId/system` — `broadcastSystemMessage`
- `GET /admin/messages` — `listAllMessages`
- `GET /admin/messages/stats` — `getMessagingStats`
- `GET /admin/messages/analytics` — `getMessagingAnalytics`
- `GET /admin/messages/conversations` — `listMessagingConversations`
- `GET /admin/messages/project/:projectId` — `getProjectMessages`
- `GET /admin/messages/flagged` — `getFlaggedMessages`
- `GET /admin/messages/moderation-history` — `listModerationHistory`
- `POST /admin/messages/flagged/:id/dismiss` — `dismissFlaggedMessage`
- `DELETE /admin/messages/flagged/:id` — `deleteFlaggedMessage`
- `POST /admin/messages/flagged/:id/escalate` — `escalateFlaggedMessage`
- `POST /admin/messages/flagged/:id/restore` — `restoreFlaggedMessage`
- `DELETE /admin/messages/:id` — `deleteMessage`
- `POST /admin/messages/:id/flag` — `flagMessage`
- `GET /admin/notifications` — `listAdminNotifications`
- `GET /admin/notifications/stats` — `getAdminNotificationStats`
- `GET /admin/notifications/delivery-report` — `getAdminNotificationDeliveryReport`
- `POST /admin/notifications/send` — `sendAdminNotification`
- `POST /admin/notifications/broadcast` — `broadcastAdminNotification`
- `POST /admin/notifications/segment` — `sendSegmentAdminNotification`
- `DELETE /admin/notifications/user/:userId` — `clearUserNotifications`
- `POST /admin/notifications/:id/resend` — `resendAdminNotification`
- `GET /admin/templates` — `getNotificationTemplates`
- `GET /admin/notifications/templates` — `getNotificationTemplatesCanonical`
- `POST /admin/templates` — `createNotificationTemplate`
- `POST /admin/notifications/templates` — `createNotificationTemplateCanonical`
- `PATCH /admin/templates/:id` — `updateNotificationTemplate`
- `PATCH /admin/notifications/templates/:id` — `updateNotificationTemplateCanonical`
- `DELETE /admin/templates/:id` — `deleteNotificationTemplate`
- `DELETE /admin/notifications/templates/:id` — `deleteNotificationTemplateCanonical`
- `PATCH /admin/notification-templates/:id` — `updateNotificationTemplateLegacy`
- `DELETE /admin/notification-templates/:id` — `deleteNotificationTemplateLegacy`
- `GET /admin/portfolio` — `listAdminPortfolio`
- `POST /admin/portfolio` — `createAdminPortfolio`
- `POST /admin/portfolio/reorder` — `reorderAdminPortfolio`
- `POST /admin/portfolio/bulk-update` — `bulkUpdateAdminPortfolio`
- `GET /admin/portfolio/analytics` — `getPortfolioAnalytics`
- `GET /admin/portfolio/analytics/:itemId` — `getPortfolioItemAnalytics`
- `GET /admin/portfolio/categories` — `listPortfolioCategories`
- `POST /admin/portfolio/categories` — `createPortfolioCategory`
- `PATCH /admin/portfolio/categories/:categoryId` — `updatePortfolioCategory`
- `DELETE /admin/portfolio/categories/:categoryId` — `deletePortfolioCategory`
- `GET /admin/portfolio/:id` — `getAdminPortfolio`
- `PATCH /admin/portfolio/:id` — `patchAdminPortfolio`
- `DELETE /admin/portfolio/:id` — `deleteAdminPortfolio`
- `POST /admin/portfolio/:id/publish` — `publishAdminPortfolio`
- `POST /admin/portfolio/:id/unpublish` — `unpublishAdminPortfolio`
- `POST /admin/portfolio/:id/archive` — `archiveAdminPortfolio`
- `POST /admin/portfolio/:id/duplicate` — `duplicateAdminPortfolio`
- `POST /admin/portfolio/:id/toggle-featured` — `toggleFeaturedAdminPortfolio`
- `GET /admin/portfolio/:id/media` — `listAdminPortfolioMedia`
- `POST /admin/portfolio/:id/media/upload` — `uploadAdminPortfolioMedia`
- `POST /admin/portfolio/:id/media` — `attachAdminPortfolioMedia`
- `POST /admin/portfolio/:id/media/:mediaId/thumbnail` — `setAdminPortfolioThumbnail`
- `POST /admin/portfolio/:id/media/:mediaId/featured-video` — `setAdminPortfolioFeaturedVideo`
- `DELETE /admin/portfolio/:id/media/:mediaId` — `deleteAdminPortfolioMedia`
- `PATCH /admin/portfolio/:id/media/reorder` — `reorderAdminPortfolioMedia`
- `PATCH /admin/portfolio/:id/privacy` — `patchAdminPortfolioPrivacy`
- `GET /admin/blog/analytics` — `getBlogAnalytics`
- `GET /admin/blog/analytics/engagement` — `getBlogEngagementAnalytics`
- `GET /admin/blog/analytics/top-posts` — `getBlogTopPostsAnalytics`
- `GET /admin/blog/analytics/:id` — `getBlogPostAnalytics`
- `GET /admin/posts` — `listAdminBlogPosts`
- `POST /admin/posts` — `createAdminBlogPost`
- `POST /admin/posts/export` — `exportAdminBlogPosts`
- `POST /admin/posts/import` — `importAdminBlogPosts`
- `GET /admin/posts/:id` — `getAdminBlogPost`
- `PATCH /admin/posts/:id` — `patchAdminBlogPost`
- `DELETE /admin/posts/:id` — `deleteAdminBlogPost`
- `POST /admin/posts/:id/publish` — `publishBlogPost`
- `POST /admin/posts/:id/feature` — `featureBlogPost`
- `POST /admin/posts/:id/unfeature` — `unfeatureBlogPost`
- `POST /admin/posts/:id/unpublish` — `unpublishBlogPost`
- `POST /admin/posts/:id/pin` — `pinBlogPost`
- `POST /admin/posts/:id/schedule` — `scheduleBlogPost`
- `POST /admin/posts/:id/unpin` — `unpinBlogPost`
- `POST /admin/posts/:id/duplicate` — `duplicateBlogPost`
- `PATCH /admin/posts/settings` — `patchBlogPostSettings`
- `GET /admin/comments` — `listAdminBlogComments`
- `GET /admin/comments/pending` — `listPendingBlogComments`
- `PATCH /admin/comments/:id/approve` — `approveBlogComment`
- `POST /admin/comments/:id/approve` — `approveBlogCommentPost`
- `DELETE /admin/comments/:id` — `deleteBlogComment`
- `POST /admin/posts/:id/archive` — `archivePost`
- `GET /admin/posts/:id/revisions` — `getPostRevisions`
- `POST /admin/posts/:id/revisions/:revisionId/restore` — `restorePostRevision`
- `GET /admin/comments/reported` — `getReportedComments`
- `POST /admin/comments/:id/reject` — `rejectComment`
- `PATCH /admin/comments/:id/reject` — `rejectCommentPatch`
- `POST /admin/comments/:id/spam` — `markCommentSpam`
- `PATCH /admin/comments/:id/spam` — `markCommentSpamPatch`
- `POST /admin/comments/:id/pin` — `pinComment`
- `POST /admin/comments/:id/unpin` — `unpinComment`
- `POST /admin/comments/:id/reply` — `replyToComment`
- `GET /admin/blog/categories` — `listBlogCategories`
- `POST /admin/blog/categories` — `createBlogCategory`
- `PATCH /admin/blog/categories/:id` — `updateBlogCategory`
- `DELETE /admin/blog/categories/:id` — `deleteBlogCategory`
- `POST /admin/blog/categories/merge` — `mergeBlogCategories`
- `POST /admin/blog/tags` — `createTag`
- `GET /admin/blog/tags` — `listBlogTags`
- `PATCH /admin/blog/tags/:id` — `updateBlogTag`
- `DELETE /admin/blog/tags/:id` — `deleteBlogTag`
- `POST /admin/blog/tags/merge` — `mergeTags`
- `GET /admin/blog/authors` — `getAuthors`
- `GET /admin/projects` — `listAdminProjects`
- `GET /admin/projects/stats` — `getProjectStats`
- `GET /admin/projects/:id/duplicate-preview` — `getProjectDuplicatePreview`
- `GET /admin/projects/:id/portfolio-link` — `getProjectPortfolioLink`
- `GET /admin/projects/:id/portfolio-preview` — `getProjectPortfolioPreview`
- `POST /admin/projects/:id/create-portfolio-draft` — `createPortfolioDraftFromProject`
- `POST /admin/projects/from-template` — `createProjectFromTemplate`
- `GET /admin/projects/:id` — `getAdminProject`
- `PATCH /admin/projects/:id` — `updateAdminProject`
- `PATCH /admin/projects/:id/status` — `updateAdminProjectStatus`
- `GET /admin/projects/:id/status-history` — `getAdminProjectStatusHistory`
- `POST /admin/projects/:id/archive` — `archiveProject`
- `POST /admin/projects/:id/extend` — `extendProject`
- `POST /admin/projects/:id/duplicate` — `duplicateProject`
- `POST /admin/projects/:id/unarchive` — `unarchiveProject`
- `POST /admin/projects/:id/export` — `exportProject`
- `GET /admin/projects/:id/export/download` — `downloadProjectExport`
- `POST /admin/projects/:id/team` — `addProjectTeamMember`
- `DELETE /admin/projects/:id/team/:memberId` — `removeProjectTeamMember`
- `GET /admin/projects/:id/analytics` — `getProjectAnalytics`
- `DELETE /admin/projects/:id` — `deleteAdminProject`
- `GET /admin/projects/:projectId/deliverables` — `listProjectDeliverables`
- `POST /admin/projects/:projectId/deliverables` — `uploadProjectDeliverable`
- `POST /admin/projects/:projectId/milestones` — `createProjectMilestone`
- `PATCH /admin/milestones/:milestoneId` — `updateProgressMilestone`
- `POST /admin/milestones/:milestoneId/complete` — `completeMilestone`
- `PATCH /admin/deliverables/:deliverableId` — `updateDeliverable`
- `DELETE /admin/deliverables/:deliverableId` — `deleteDeliverable`
- `GET /admin/progress/projects/:projectId` — `listAdminProgressEntries`
- `POST /admin/progress/projects/:projectId` — `createAdminProgressEntry`
- `GET /admin/progress/projects/:projectId/timeline` — `getAdminProgressTimeline`
- `PATCH /admin/progress/projects/:projectId/status` — `updateProgressAdminProjectStatus`
- `POST /admin/progress/projects/:projectId/complete` — `markAdminProjectComplete`
- `GET /admin/progress/projects/:projectId/analytics` — `getProjectProgressAnalytics`
- `PATCH /admin/progress/:entryId` — `updateAdminProgressEntry`
- `DELETE /admin/progress/:entryId` — `deleteAdminProgressEntry`
- `GET /admin/requests` — `listAdminRequests`
- `GET /admin/requests/stats` — `getAdminRequestStats`
- `GET /admin/requests/capacity` — `getCapacityDashboardAlias`
- `GET /admin/requests/capacity/dashboard` — `getCapacityDashboard`
- `PATCH /admin/requests/settings/capacity` — `updateCapacitySettings`
- `GET /admin/requests/:id` — `getAdminRequest`
- `PATCH /admin/requests/:id/status` — `updateAdminRequestStatus`
- `POST /admin/requests/:id/quotes` — `createAdminRequestQuote`
- `POST /admin/requests/:id/quotes/prefill` — `suggestAdminRequestQuotePrefill`
- `POST /admin/requests/:id/notes` — `addAdminRequestNote`
- `GET /admin/requests/:id/notes` — `listAdminRequestNotes`
- `PATCH /admin/requests/:id` — `patchAdminRequest`
- `POST /admin/requests/:id/assign` — `assignAdminRequest`
- `DELETE /admin/requests/:id` — `deleteAdminRequest`
- `GET /admin/requests/:id/attachments/:attachmentId/download` — `getAdminRequestAttachmentDownload`
- `GET /admin/quotes` — `listAdminQuotes`
- `GET /admin/quotes/stats` — `getAdminQuoteStats`
- `POST /admin/quotes` — `createAdminQuote`
- `POST /admin/quotes/:id/send` — `sendAdminQuote`
- `GET /admin/quotes/:id` — `getAdminQuote`
- `PATCH /admin/quotes/:id` — `patchAdminQuote`
- `DELETE /admin/quotes/:id` — `deleteAdminQuote`
- `POST /admin/quotes/:id/duplicate` — `duplicateAdminQuote`
- `POST /admin/quotes/:id/revise` — `reviseAdminQuote`
- `GET /admin/quotes/:id/history` — `getAdminQuoteHistory`
- `GET /admin/quotes/:id/documents/versions` — `getAdminQuoteDocumentVersions`
- `GET /admin/quotes/:id/pdf` — `getAdminQuotePdf`
- `GET /admin/quotes/:id/contract` — `getAdminQuoteContract`
- `GET /admin/quotes/templates` — `getAdminQuoteTemplates`
- `GET /admin/quotes/line-item-library` — `getQuoteLineItemLibrary`
- `POST /admin/quotes/line-item-library` — `createQuoteLineItemBlock`
- `PATCH /admin/quotes/line-item-library/:id` — `updateQuoteLineItemBlock`
- `DELETE /admin/quotes/line-item-library/:id` — `deactivateQuoteLineItemBlock`
- `GET /admin/quotes/payment-schedule-presets` — `getPaymentSchedulePresets`
- `POST /admin/quotes/templates` — `createAdminQuoteTemplate`
- `POST /admin/quotes/:id/resend` — `resendQuote`
- `POST /admin/quotes/:id/extend` — `extendQuote`
- `GET /admin/service-packages` — `listServicePackages`
- `POST /admin/service-packages` — `upsertServicePackage`
- `PATCH /admin/service-packages/:id` — `updateServicePackage`
- `GET /admin/time-entries` — `listTimeEntries`
- `POST /admin/time-entries` — `createTimeEntry`
- `GET /admin/webhooks/health` — `webhooksHealth`
- `GET /admin/webhooks/events` — `webhooksEvents`
- `GET /admin/webhooks` — `listWebhooks`
- `POST /admin/webhooks` — `createWebhook`
- `GET /admin/webhooks/:id` — `getWebhook`
- `PATCH /admin/webhooks/:id` — `patchWebhook`
- `DELETE /admin/webhooks/:id` — `deleteWebhook`
- `POST /admin/webhooks/:id/test` — `testWebhook`
- `GET /admin/webhooks/:id/deliveries` — `webhookDeliveries`
- `POST /admin/webhooks/:id/enable` — `enableWebhook`
- `POST /admin/webhooks/:id/disable` — `disableWebhook`
- `GET /admin/contact` — `listContactMessages`
- `GET /admin/contact/:id` — `getContactMessage`
- `PATCH /admin/contact/:id/status` — `updateContactStatus`
- `POST /admin/contact/:id/respond` — `respondToContact`
- `POST /admin/contact/:id/spam` — `markContactSpam`
- `DELETE /admin/contact/:id` — `deleteContactMessage`
- `GET /admin/documents/verify/:documentNumber` — `verifyDocument`
- `GET /admin/documents/users/:userId` — `listUserDocuments`
- `GET /admin/documents/:documentId/download` — `downloadGeneratedDocument`
- `GET /admin/health` — `health`

## `gateway/src/modules/auth/auth.controller.ts` — `@Controller(auth)`

- `POST /auth/register` — `register`
- `POST /auth/login` — `login`
- `POST /auth/refresh` — `refresh`
- `POST /auth/logout` — `logout`
- `POST /auth/logout-all` — `logoutAll`
- `POST /auth/end-impersonation` — `endOwnImpersonation`
- `POST /auth/verify-email` — `verifyEmail`
- `POST /auth/forgot-password` — `forgotPassword`
- `POST /auth/reset-password` — `resetPassword`
- `POST /auth/check-email` — `checkEmailPost`
- `GET /auth/check-email` — `checkEmail`
- `POST /auth/verify-2fa` — `verify2FA`
- `POST /auth/resend-verification` — `resendVerification`
- `GET /auth/health` — `health`

## `gateway/src/modules/blog/blog.controller.ts` — `@Controller(posts)`

- `GET /posts/posts` — `listPosts`
- `GET /posts/posts/search` — `searchPosts`
- `GET /posts/posts/health` — `health`
- `GET /posts/posts/:slug` — `getPostDetail`
- `GET /posts/posts/:slug/related` — `getRelatedPosts`
- `GET /posts/posts/:slug/engagement` — `getPostEngagement`
- `POST /posts/posts/:slug/view` — `recordView`
- `GET /posts/posts/:slug/comments` — `getPostComments`
- `POST /posts/posts/:slug/comments` — `addComment`
- `PUT /posts/posts/:slug/comments/:commentId` — `updateComment`
- `PATCH /posts/posts/:slug/comments/:commentId` — `updateComment`
- `DELETE /posts/posts/:slug/comments/:commentId` — `deleteComment`
- `POST /posts/posts/:slug/like` — `likePost`
- `POST /posts/posts/:slug/bookmark` — `bookmarkPost`
- `DELETE /posts/posts/:slug/bookmark` — `unbookmarkPost`
- `GET /posts/categories` — `listCategories`
- `GET /posts/categories/:idOrSlug` — `getCategoryDetail`
- `GET /posts/tags` — `listTags`
- `GET /posts/tags/:idOrSlug` — `getTagDetail`
- `GET /posts/authors` — `listAuthors`
- `GET /posts/authors/:id` — `getAuthorProfile`
- `GET /posts/feed/rss` — `getRssFeed`
- `GET /posts/feed/atom` — `getAtomFeed`
- `GET /posts/bookmarks` — `listBookmarks`

## `gateway/src/modules/contact/contact.controller.ts` — `@Controller(contact)`

- `POST /contact` — `submitContactForm`
- `POST /contact/inquiries` — `submitInquiry`
- `GET /contact/inquiries` — `findAll`
- `GET /contact/inquiries/:id` — `findOne`
- `PATCH /contact/inquiries/:id` — `update`
- `DELETE /contact/inquiries/:id` — `remove`
- `POST /contact/inquiries/:id/respond` — `respond`
- `GET /contact/health` — `health`

## `gateway/src/modules/documents/documents.controller.ts` — `@Controller(documents)`

- `GET /documents/verify/:documentNumber` — `verify`
- `GET /documents/mine` — `listMine`
- `GET /documents/mine/:documentId/download` — `downloadMine`

## `gateway/src/modules/health/health.controller.ts` — `@Controller(health)`

- `GET /health` — `check`
- `GET /health/detailed` — `detailed`
- `GET /health/ready` — `ready`
- `GET /health/live` — `live`
- `GET /health/dependencies` — `checkDependencies`
- `GET /health/services/:name` — `checkService`
- `HEAD /health/ping` — `pingHead`
- `GET /health/ping` — `pingGet`
- `GET /health/database` — `database`
- `GET /health/cache` — `cache`
- `GET /health/queue` — `queue`
- `GET /health/storage` — `storage`
- `GET /health/microservices` — `microservices`
- `GET /health/external` — `external`
- `GET /health/workers` — `workers`
- `GET /health/websocket` — `websocket`
- `GET /health/system` — `system`
- `GET /health/features` — `features`
- `GET /health/registry` — `registry`
- `GET /health/debug` — `debug`

## `gateway/src/modules/invoices/invoices.controller.ts` — `@Controller(invoices)`

- `GET /invoices` — `listInvoices`
- `GET /invoices/:id` — `getInvoice`
- `GET /invoices/:id/download` — `downloadInvoice`

## `gateway/src/modules/media/media-admin.gateway.controller.ts` — `@Controller(admin/media)`

- `ALL /admin/media/*` — `constructor`
- `GET /admin/media` — `listAll`
- `GET /admin/media/browse` — `browseStorage`
- `GET /admin/media/quarantine` — `listQuarantined`
- `GET /admin/media/users/:userId` — `listUserMedia`
- `GET /admin/media/analytics` — `getAnalytics`
- `GET /admin/media/storage/analytics` — `getAnalyticsLegacy`
- `GET /admin/media/storage-usage` — `getStorageUsage`
- `GET /admin/media/storage-stats` — `getStorageStats`
- `GET /admin/media/stats` — `getStats`
- `GET /admin/media/orphans` — `listOrphans`
- `POST /admin/media/cleanup` — `runCleanup`
- `POST /admin/media/backfill-context` — `backfillContext`
- `POST /admin/media/bulk-delete` — `bulkDelete`
- `POST /admin/media/promote-to-portfolio` — `promoteToPortfolio`
- `PATCH /admin/media/settings` — `updateSettings`
- `POST /admin/media/quarantine/:id/release` — `releaseQuarantined`
- `DELETE /admin/media/quarantine/:id` — `deleteQuarantined`
- `GET /admin/media/:id/download` — `getDownload`
- `GET /admin/media/:id/references` — `getReferences`
- `GET /admin/media/:id/shares` — `getShares`
- `POST /admin/media/:id/share` — `createShare`
- `DELETE /admin/media/:id/share` — `revokeShare`
- `DELETE /admin/media/:id/shares/:shareLinkId` — `revokeShareById`
- `POST /admin/media/:id/reprocess` — `reprocess`
- `POST /admin/media/:id/replace` — `replaceFile`
- `PATCH /admin/media/:id` — `patchById`
- `GET /admin/media/:id` — `getById`
- `DELETE /admin/media/:id` — `deleteById`

## `gateway/src/modules/media/media.controller.ts` — `@Controller(media)`

- `GET /media` — `listMedia`
- `GET /media/shared` — `listSharedMedia`
- `POST /media/upload/request` — `requestUpload`
- `POST /media/request` — `requestUploadLegacy`
- `POST /media/presigned-upload` — `presignedUploadLegacy`
- `POST /media/upload/confirm` — `confirmUpload`
- `POST /media/confirm` — `confirmUploadLegacy`
- `POST /media/upload/direct` — `directUpload`
- `POST /media/direct-upload` — `directUploadLegacy`
- `GET /media/storage-usage` — `getStorageUsage`
- `GET /media/storage-stats` — `getStorageStatsLegacy`
- `GET /media/health` — `health`
- `POST /media/upload/chunked/init` — `initChunkedUpload`
- `POST /media/upload/chunked/:uploadId/part` — `uploadChunkPart`
- `POST /media/upload/chunked/:uploadId/chunk` — `uploadChunkLegacy`
- `POST /media/upload/chunked/:uploadId/complete` — `completeChunkedUpload`
- `GET /media/upload/chunked/:uploadId/status` — `getChunkedUploadStatus`
- `POST /media/upload/chunked/:uploadId/abort` — `abortChunkedUpload`
- `GET /media/:id/status` — `getMediaProcessingStatus`
- `GET /media/:id` — `getMediaDetails`
- `PATCH /media/:id` — `updateMetadata`
- `DELETE /media/:id` — `deleteMedia`
- `GET /media/:id/download` — `getDownloadUrl`
- `GET /media/:id/download-url` — `getDownloadUrlLegacy`
- `POST /media/:id/copy` — `copyMedia`
- `POST /media/:id/move` — `moveMedia`
- `POST /media/:id/regenerate-thumbnail` — `regenerateThumbnail`
- `GET /media/:id/versions` — `getVersions`
- `GET /media/:id/shares` — `listShareLinks`
- `POST /media/:id/share` — `createShareLink`
- `DELETE /media/:id/share` — `revokeShareLink`
- `DELETE /media/:id/shares/:shareLinkId` — `revokeShareLinkById`

## `gateway/src/modules/media/share.gateway.controller.ts` — `@Controller(share)`

- `GET /share/:token` — `resolveShare`
- `POST /share/:token` — `resolveShareWithPassword`

## `gateway/src/modules/media/stats-alias.controller.ts` — `@Controller()`

- `GET /stats` — `constructor`
- `GET /` — `getStats`

## `gateway/src/modules/messages/conversations-alias.controller.ts` — `@Controller(conversations)`

- `GET /conversations` — `list`
- `GET /conversations/unread-count` — `unreadCount`

## `gateway/src/modules/messages/messages.controller.ts` — `@Controller(conversations)`

- `GET /conversations/conversations` — `getConversations`
- `GET /conversations/conversations/unread-count` — `getUnreadCount`
- `GET /conversations` — `listMessages`
- `POST /conversations` — `sendMessage`
- `GET /conversations/health` — `health`
- `GET /conversations/unread-count` — `messagesUnreadCount`
- `GET /conversations/search` — `searchMessagesRoute`
- `GET /conversations/threads` — `listChatThreads`
- `POST /conversations/threads/direct` — `chatThreadsDirect`
- `POST /conversations/threads/group` — `chatThreadsGroup`
- `GET /conversations/threads/:threadId` — `getChatThread`
- `PATCH /conversations/threads/:threadId` — `patchChatThread`
- `GET /conversations/threads/:threadId/members` — `listChatThreadMembers`
- `POST /conversations/threads/:threadId/members` — `addChatThreadMembers`
- `DELETE /conversations/threads/:threadId/members/:memberUserId` — `removeChatThreadMember`
- `POST /conversations/threads/:threadId/leave` — `leaveChatThread`
- `POST /conversations/threads/:threadId/archive` — `archiveChatThread`
- `POST /conversations/threads/:threadId/unarchive` — `unarchiveChatThread`
- `POST /conversations/threads/:threadId/user-archive` — `userArchiveChatThread`
- `POST /conversations/threads/:threadId/user-unarchive` — `userUnarchiveChatThread`
- `POST /conversations/threads/:threadId/user-hide` — `userHideChatThread`
- `GET /conversations/threads/:threadId/messages` — `chatThreadMessages`
- `POST /conversations/threads/:threadId/messages` — `chatThreadSend`
- `POST /conversations/threads/:threadId/read` — `chatThreadMarkRead`
- `GET /conversations/project/:projectId/attachments` — `getProjectAttachments`
- `POST /conversations/projects/:projectId` — `sendProjectMessagePlural`
- `GET /conversations/projects/:projectId` — `getProjectThreadPlural`
- `GET /conversations/project/:projectId` — `getProjectThread`
- `POST /conversations/project/:projectId` — `sendProjectMessage`
- `POST /conversations/project/:projectId/read` — `markProjectMessagesRead`
- `GET /conversations/:id` — `getMessageDetails`
- `PATCH /conversations/:id` — `patchMessage`
- `DELETE /conversations/:id` — `deleteMessage`
- `POST /conversations/:id/read` — `markAsRead`
- `POST /conversations/:id/pin` — `pinMessage`
- `POST /conversations/:id/unpin` — `unpinMessage`
- `POST /conversations/:id/flag` — `flagMessage`
- `GET /conversations/:messageId/threads` — `getThreads`
- `POST /conversations/:messageId/threads` — `replyInThread`

## `gateway/src/modules/notifications/notifications.controller.ts` — `@Controller(notifications)`

- `GET /notifications` — `findAll`
- `GET /notifications/unread-count` — `getUnreadCount`
- `GET /notifications/history` — `getHistory`
- `GET /notifications/preferences` — `getPreferences`
- `PATCH /notifications/preferences` — `updatePreferences`
- `GET /notifications/channels` — `getChannels`
- `GET /notifications/preferences/channels` — `getPreferencesChannels`
- `PATCH /notifications/preferences/channel/:channel` — `updateChannelPreference`
- `GET /notifications/health` — `health`
- `GET /notifications/:id` — `findOne`
- `PATCH /notifications/:id/read` — `markAsRead`
- `PATCH /notifications/:id/unread` — `markAsUnread`
- `POST /notifications/read-all` — `markAllAsRead`
- `POST /notifications/read-selected` — `markSelectedAsRead`
- `DELETE /notifications/clear-read` — `clearReadNotifications`
- `DELETE /notifications/:id` — `remove`

## `gateway/src/modules/notifications/push-gateway.controller.ts` — `@Controller(push)`

- `POST /push/register` — `register`
- `DELETE /push/unregister/:deviceId` — `unregister`

## `gateway/src/modules/notifications/push-subscription-gateway.controller.ts` — `@Controller(push-subscription)`

- `POST /push-subscription` — `register`
- `DELETE /push-subscription` — `remove`

## `gateway/src/modules/payments/payments.controller.ts` — `@Controller(payments)`

- `POST /payments/create-intent` — `createIntent`
- `POST /payments/initiate` — `initiate`
- `POST /payments/confirm` — `confirmPayment`
- `GET /payments/platform-accounts` — `listPlatformAccounts`
- `POST /payments/bank-transfer/submit` — `submitBankTransfer`
- `GET /payments/health` — `health`
- `GET /payments` — `getMyPayments`
- `GET /payments/stats` — `getPaymentStats`
- `GET /payments/projects/:projectId` — `getProjectPayments`
- `GET /payments/projects/:projectId/milestones` — `getProjectMilestones`
- `GET /payments/methods` — `getPaymentMethods`
- `GET /payments/:id/status` — `getPaymentStatus`
- `GET /payments/:id` — `getPaymentDetails`
- `GET /payments/:id/documents/versions` — `listDocumentVersions`
- `GET /payments/:id/receipt` — `downloadReceipt`
- `GET /payments/:id/invoice` — `downloadInvoice`
- `POST /payments/:id/dispute` — `fileDispute`
- `POST /payments/:id/cancel` — `cancelPayment`
- `POST /payments/methods` — `savePaymentMethod`
- `DELETE /payments/methods/:id` — `removePaymentMethod`
- `PATCH /payments/methods/:id/default` — `setDefaultPaymentMethod`
- `PATCH /payments/methods/:id/nickname` — `updatePaymentMethodNickname`

## `gateway/src/modules/portfolio/portfolio.controller.ts` — `@Controller(portfolio)`

- `GET /portfolio` — `list`
- `GET /portfolio/featured` — `getFeatured`
- `GET /portfolio/categories` — `getCategories`
- `GET /portfolio/tags` — `getTags`
- `GET /portfolio/search` — `search`
- `GET /portfolio/health` — `health`
- `GET /portfolio/timeline` — `getTimeline`
- `POST /portfolio/:idOrSlug/view` — `recordView`
- `GET /portfolio/:idOrSlug` — `getDetail`
- `POST /portfolio/:idOrSlug/like` — `toggleLike`

## `gateway/src/modules/progress/progress.controller.ts` — `@Controller(projects/:projectId/progress)`

- `GET /projects/:projectId/progress/health` — `health`
- `GET /projects/:projectId/progress/projects/:projectId` — `getTimeline`
- `POST /projects/:projectId/progress/projects/:projectId` — `createEntry`
- `GET /projects/:projectId/progress/projects/:projectId/status` — `getStatusSummary`
- `GET /projects/:projectId/progress/projects/:projectId/milestones` — `getMilestoneProgress`
- `POST /projects/:projectId/progress/projects/:projectId/request-changes` — `requestChanges`
- `GET /projects/:projectId/progress/projects/:projectId/:entryId` — `getEntry`
- `POST /projects/:projectId/progress/milestones/:id/approve` — `approveMilestone`
- `POST /projects/:projectId/progress/milestones/:id/request-revision` — `requestMilestoneRevision`
- `POST /projects/:projectId/progress/deliverables/:id/approve` — `approveDeliverable`
- `POST /projects/:projectId/progress/deliverables/:id/reject` — `rejectDeliverable`

## `gateway/src/modules/projects/projects.controller.ts` — `@Controller(projects)`

- `GET /projects/health` — `health`
- `GET /projects/stats` — `getStats`
- `GET /projects` — `findAll`
- `GET /projects/by-quote/:quoteId` — `findByQuoteId`
- `GET /projects/:id` — `listPublicProjects`
- `GET /projects/public` — `listPublicProjects`
- `GET /projects/public/:publicId` — `getPublicProjectDetails`
- `GET /projects/:id` — `findOne`
- `GET /projects/:id/timeline` — `getTimeline`
- `GET /projects/:id/deliverables` — `getDeliverables`
- `GET /projects/:id/payments` — `getPayments`
- `GET /projects/:id/progress` — `getProgress`
- `GET /projects/:id/milestones` — `getMilestones`
- `GET /projects/:id/messages` — `getMessages`
- `POST /projects/:id/messages` — `sendMessage`
- `POST /projects/:id/approve` — `approveProject`
- `POST /projects/:id/sign-contract` — `signContract`
- `POST /projects/:id/request-revision` — `requestRevision`
- `POST /projects/:id/feedback` — `submitFeedback`
- `GET /projects/:id/feedback` — `getFeedback`

## `gateway/src/modules/quotes/quotes.controller.ts` — `@Controller(quotes)`

- `GET /quotes` — `findAll`
- `GET /quotes/stats` — `getStats`
- `GET /quotes/health` — `health`
- `GET /quotes/:id` — `findOne`
- `POST /quotes/:id/accept` — `accept`
- `POST /quotes/:id/decline` — `decline`
- `POST /quotes/:id/request-changes` — `requestChanges`
- `GET /quotes/:id/documents/versions` — `listDocumentVersions`
- `GET /quotes/:id/contract/preview` — `previewContract`
- `GET /quotes/:id/contract` — `downloadContract`
- `GET /quotes/:id/pdf` — `downloadPdf`

## `gateway/src/modules/requests/requests.controller.ts` — `@Controller(requests)`

- `GET /requests/health` — `health`
- `GET /requests` — `findAll`
- `POST /requests` — `create`
- `GET /requests/stats` — `getStats`
- `GET /requests/capacity` — `getCapacityDashboard`
- `GET /requests/:id` — `findOne`
- `PATCH /requests/:id` — `update`
- `DELETE /requests/:id` — `remove`
- `POST /requests/:id/submit` — `submit`
- `GET /requests/:id/status` — `getStatusTimeline`
- `GET /requests/:id/quotes` — `getRequestQuotes`
- `GET /requests/:id/attachments` — `getAttachments`
- `POST /requests/:id/attachments` — `addAttachment`
- `DELETE /requests/:id/attachments/:attachmentId` — `removeAttachment`
- `GET /requests/:id/attachments/:attachmentId/download` — `getAttachmentDownloadUrl`

## `gateway/src/modules/requests/services.controller.ts` — `@Controller(services)`

- `GET /services` — `list`
- `GET /services/:slug` — `getOne`

## `gateway/src/modules/system/system-status.controller.ts` — `@Controller(system)`

- `GET /system/status` — `getStatus`

## `gateway/src/modules/users/users.controller.ts` — `@Controller(users)`

- `GET /users/me` — `getMe`
- `GET /users/profile` — `getProfile`
- `PATCH /users/profile` — `updateProfile`
- `POST /users/avatar` — `uploadAvatar`
- `DELETE /users/avatar` — `removeAvatar`
- `GET /users/preferences` — `getPreferences`
- `PATCH /users/preferences` — `updatePreferences`
- `POST /users/change-password` — `changePassword`
- `POST /users/2fa/enable` — `enable2FA`
- `POST /users/2fa/setup` — `setup2FA`
- `POST /users/2fa/verify` — `verify2FA`
- `POST /users/2fa/verify-setup` — `verifySetup2FA`
- `POST /users/2fa/disable` — `disable2FA`
- `GET /users/2fa/status` — `get2FAStatus`
- `GET /users/2fa/backup-codes` — `getBackupCodes`
- `POST /users/2fa/regenerate-codes` — `regenerateBackupCodes`
- `GET /users/sessions` — `getSessions`
- `GET /users/sessions/:sessionId` — `getSessionDetails`
- `DELETE /users/sessions/:sessionId` — `terminateSession`
- `POST /users/sessions/terminate-others` — `terminateOtherSessions`
- `POST /users/logout` — `logout`
- `POST /users/delete-account` — `deleteAccount`
- `POST /users/cancel-deletion` — `cancelDeletion`
- `GET /users/dashboard-summary` — `getDashboardSummary`
- `GET /users/activity` — `getActivity`
- `GET /users/data-export` — `requestDataExport`
- `GET /users/export` — `requestDataExportAlias`
- `GET /users/export/:id` — `downloadDataExport`
- `GET /users/health` — `health`

## `gateway/src/modules/webhooks/webhooks.controller.ts` — `@Controller(webhooks)`

- `POST /webhooks/razorpay` — `handleRazorpay`
- `POST /webhooks/github` — `handleGithub`
- `POST /webhooks/cloudflare` — `handleCloudflare`
- `POST /webhooks/stripe` — `handleStripe`
- `POST /webhooks/inbound/:provider` — `handleProvider`
- `GET /webhooks/health` — `health`

## `gateway/src/swagger/docs-specs.controller.ts` — `@Controller(docs-specs)`

- `GET /docs-specs` — `listSpecs`
- `GET /docs-specs/all` — `getAllSpecs`
- `GET /docs-specs/:serviceKey` — `getSpec`

## `services/admin/src/controllers/admin/admin-health.admin.controller.ts` — `@Controller()`

- `GET /health` — `health`

## `services/admin/src/controllers/admin/audit.admin.controller.ts` — `@Controller(audit)`

- `GET /audit` — `list`
- `GET /audit/logs` — `listLogsAlias`
- `GET /audit/stats` — `getStats`
- `GET /audit/user/:userId` — `getUserTrail`
- `GET /audit/resource/:type/:id` — `getResourceTrail`
- `GET /audit/:id` — `get`
- `POST /audit/export` — `export`

## `services/admin/src/controllers/admin/dashboard.admin.controller.ts` — `@Controller(dashboard)`

- `GET /dashboard/overview` — `getOverview`
- `GET /dashboard/revenue` — `getRevenue`
- `GET /dashboard/users` — `getUsers`
- `GET /dashboard/analytics/users` — `getUsersAnalytics`
- `GET /dashboard/projects` — `getProjects`
- `GET /dashboard/analytics/projects` — `getProjectsAnalytics`
- `GET /dashboard/performance` — `getPerformance`
- `GET /dashboard/activity` — `getActivity`
- `GET /dashboard/alerts` — `getAlerts`

## `services/admin/src/controllers/admin/documents.admin.controller.ts` — `@Controller(documents)`

- `GET /documents/verify/:documentNumber` — `verify`
- `GET /documents/mine` — `listMine`
- `GET /documents/mine/:documentId/download` — `downloadMine`
- `GET /documents/users/:userId` — `listForUser`
- `GET /documents/:documentId/download` — `downloadVersion`

## `services/admin/src/controllers/admin/email-templates.admin.controller.ts` — `@Controller(system/email-templates)`

- `GET /system/email-templates` — `list`
- `POST /system/email-templates` — `create`
- `POST /system/email-templates/preview` — `previewByBody`
- `GET /system/email-templates/:id` — `get`
- `PATCH /system/email-templates/:id` — `update`
- `GET /system/email-templates/:id/preview` — `preview`
- `POST /system/email-templates/:id/test` — `test`

## `services/admin/src/controllers/admin/impersonation.admin.controller.ts` — `@Controller(users)`

- `POST /users/:userId/impersonate` — `start`
- `POST /users/impersonate/end` — `endByBody`
- `POST /users/impersonate/end/:sessionId` — `end`
- `GET /users/impersonate/sessions` — `listActive`

## `services/admin/src/controllers/admin/reports.admin.controller.ts` — `@Controller(reports)`

- `GET /reports` — `listReports`
- `POST /reports` — `generateReport`
- `GET /reports/:id/download` — `downloadReport`

## `services/admin/src/controllers/admin/system.admin.controller.ts` — `@Controller(system)`

- `GET /system/config` — `getConfig`
- `PATCH /system/config` — `updateConfig`
- `GET /system/features` — `listFeatures`
- `PATCH /system/features/:flag` — `toggleFeature`
- `POST /system/maintenance` — `toggleMaintenance`
- `POST /system/cache/clear` — `clearCache`
- `POST /system/cache/clear/:key` — `clearCacheKey`
- `GET /system/jobs` — `listJobs`
- `POST /system/jobs/:id/retry` — `retryJob`
- `DELETE /system/jobs/:id` — `cancelJob`
- `GET /system/logs` — `getLogs`
- `GET /system/logs/download` — `downloadLogs`
- `POST /system/announcements` — `sendAnnouncement`

## `services/admin/src/controllers/admin/webhooks.admin.controller.ts` — `@Controller()`

- `GET /webhooks` — `list`
- `POST /webhooks` — `create`
- `GET /webhooks/health` — `health`
- `GET /webhooks/events` — `events`
- `GET /webhooks/:id` — `get`
- `PATCH /webhooks/:id` — `update`
- `DELETE /webhooks/:id` — `remove`
- `POST /webhooks/:id/test` — `test`
- `GET /webhooks/:id/deliveries` — `getDeliveries`
- `POST /webhooks/:id/enable` — `enableWebhook`
- `POST /webhooks/:id/disable` — `disableWebhook`
- `GET /webhooks/:id/deliveries/:deliveryId` — `getDeliveryDetails`
- `POST /webhooks/:id/deliveries/:deliveryId/retry` — `retryDelivery`
- `GET /webhooks/:id/stats` — `getWebhookStats`

## `services/auth/src/controllers/auth.public.controller.ts` — `@Controller()`

- `POST /register` — `register`
- `POST /login` — `login`
- `POST /refresh` — `refresh`
- `POST /logout` — `logout`
- `POST /logout-all` — `logoutAll`
- `POST /end-impersonation` — `endOwnImpersonation`
- `POST /verify-2fa` — `verify2fa`
- `POST /verify-email` — `verifyEmail`
- `POST /resend-verification` — `resendVerification`
- `POST /forgot-password` — `forgotPassword`
- `POST /reset-password` — `resetPassword`
- `POST /check-email` — `checkEmailPost`
- `GET /check-email` — `checkEmail`
- `GET /health` — `healthCheck`

## `services/blog/src/controllers/admin/blog-analytics.admin.controller.ts` — `@Controller(admin/blog/analytics)`

- `GET /admin/blog/analytics` — `getAnalytics`
- `GET /admin/blog/analytics/top-posts` — `getTopPosts`
- `GET /admin/blog/analytics/engagement` — `getEngagement`
- `GET /admin/blog/analytics/:id` — `getPostAnalytics`

## `services/blog/src/controllers/admin/comments.admin.controller.ts` — `@Controller(admin/comments)`

- `GET /admin/comments` — `getAll`
- `GET /admin/comments/pending` — `getPendingComments`
- `GET /admin/comments/reported` — `getReportedComments`
- `POST /admin/comments/:id/approve` — `approve`
- `PATCH /admin/comments/:id/approve` — `approve`
- `POST /admin/comments/:id/reject` — `reject`
- `PATCH /admin/comments/:id/reject` — `reject`
- `POST /admin/comments/:id/spam` — `markAsSpam`
- `PATCH /admin/comments/:id/spam` — `markAsSpam`
- `POST /admin/comments/:id/pin` — `pinComment`
- `POST /admin/comments/:id/unpin` — `unpinComment`
- `DELETE /admin/comments/:id` — `deleteComment`
- `POST /admin/comments/:id/reply` — `adminReply`

## `services/blog/src/controllers/admin/posts.admin.controller.ts` — `@Controller(admin/posts)`

- `GET /admin/posts` — `findAll`
- `GET /admin/posts/:id` — `findOne`
- `POST /admin/posts` — `create`
- `PATCH /admin/posts/:id` — `update`
- `DELETE /admin/posts/:id` — `remove`
- `POST /admin/posts/:id/publish` — `publish`
- `POST /admin/posts/:id/unpublish` — `unpublish`
- `POST /admin/posts/:id/schedule` — `schedule`
- `POST /admin/posts/:id/feature` — `featurePost`
- `POST /admin/posts/:id/unfeature` — `unfeaturePost`
- `POST /admin/posts/:id/pin` — `pinPost`
- `POST /admin/posts/:id/unpin` — `unpinPost`
- `POST /admin/posts/:id/duplicate` — `duplicatePost`
- `POST /admin/posts/:id/archive` — `archivePost`
- `GET /admin/posts/:id/revisions` — `getRevisions`
- `POST /admin/posts/:id/revisions/:revisionId/restore` — `restoreRevision`
- `POST /admin/posts/import` — `importPosts`
- `POST /admin/posts/export` — `exportPosts`
- `PATCH /admin/posts/settings` — `updateBlogSettings`

## `services/blog/src/controllers/admin/taxonomy.admin.controller.ts` — `@Controller(admin/blog/categories)`

- `GET /admin/blog/categories` — `findAll`
- `POST /admin/blog/categories` — `create`
- `PATCH /admin/blog/categories/:id` — `update`
- `DELETE /admin/blog/categories/:id` — `remove`
- `GET /admin/blog/categories` — `findAll`
- `POST /admin/blog/categories` — `create`
- `PATCH /admin/blog/categories/:id` — `update`
- `DELETE /admin/blog/categories/:id` — `remove`
- `POST /admin/blog/categories/merge` — `merge`
- `GET /admin/blog/categories` — `findAll`

## `services/blog/src/controllers/public/feed.public.controller.ts` — `@Controller(feed)`

- `GET /feed/rss` — `getRss`
- `GET /feed/atom` — `getAtom`

## `services/blog/src/controllers/public/posts.public.controller.ts` — `@Controller(posts)`

- `GET /posts` — `list`
- `GET /posts/search` — `search`
- `GET /posts/health` — `health`
- `GET /posts/:slug` — `getDetail`
- `GET /posts/:slug/related` — `getRelated`
- `POST /posts/:slug/view` — `recordViewExplicit`
- `GET /posts/:slug/comments` — `getPostComments`

## `services/blog/src/controllers/public/taxonomy.public.controller.ts` — `@Controller(categories)`

- `GET /categories` — `findAll`
- `GET /categories/:slug` — `getBySlug`
- `GET /categories/:slug/posts` — `getPostsByCategory`
- `GET /categories` — `findAll`
- `GET /categories/:slug` — `getBySlug`
- `GET /categories/:slug/posts` — `getPostsByTag`
- `GET /categories` — `findAll`
- `GET /categories/:id` — `getAuthorById`

## `services/blog/src/controllers/user/comments.controller.ts` — `@Controller(posts/:slug/comments)`

- `POST /posts/:slug/comments` — `create`
- `POST /posts/:slug/comments/:commentId/reply` — `replyToComment`
- `PUT /posts/:slug/comments/:commentId` — `updatePut`
- `PATCH /posts/:slug/comments/:commentId` — `updatePatch`
- `DELETE /posts/:slug/comments/:commentId` — `remove`
- `GET /posts/:slug/comments/:commentId/replies` — `getReplies`
- `POST /posts/:slug/comments/:commentId/report` — `reportComment`
- `POST /posts/:slug/comments/:commentId/like` — `likePostComment`
- `GET /posts/:slug/comments/comments/:commentId` — `getCommentById`
- `GET /posts/:slug/comments/comments/:commentId/replies` — `getCommentReplies`
- `POST /posts/:slug/comments/comments/:commentId/reply` — `replyToCommentStandalone`
- `PATCH /posts/:slug/comments/comments/:commentId` — `editComment`
- `DELETE /posts/:slug/comments/comments/:commentId` — `deleteComment`
- `POST /posts/:slug/comments/comments/:commentId/report` — `reportCommentStandalone`
- `POST /posts/:slug/comments/comments/:commentId/like` — `likeComment`

## `services/blog/src/controllers/user/post-interactions.controller.ts` — `@Controller(posts/:slug)`

- `POST /posts/:slug/like` — `toggleLike`
- `GET /posts/:slug/engagement` — `getEngagement`
- `POST /posts/:slug/bookmark` — `addBookmark`
- `DELETE /posts/:slug/bookmark` — `removeBookmark`
- `POST /posts/:slug/bookmarks` — `addBookmarkLegacy`
- `DELETE /posts/:slug/bookmarks` — `removeBookmarkLegacy`
- `POST /posts/:slug/views` — `trackView`
- `POST /posts/:slug/share` — `trackShare`
- `GET /posts/:slug` — `listBookmarks`

## `services/contact/src/controllers/admin/contact.admin.controller.ts` — `@Controller(admin/contact)`

- `GET /admin/contact` — `findAll`
- `GET /admin/contact/:id` — `getContactDetails`
- `PATCH /admin/contact/:id/status` — `updateStatus`
- `POST /admin/contact/:id/respond` — `respondToContact`
- `POST /admin/contact/:id/spam` — `markAsSpam`
- `DELETE /admin/contact/:id` — `deleteContact`

## `services/contact/src/controllers/public/contact.public.controller.ts` — `@Controller(contact)`

- `GET /contact/health` — `healthCheck`
- `POST /contact` — `submitContact`

## `services/health/src/controllers/admin/health-debug.admin.controller.ts` — `@Controller(debug)`

- `GET /debug` — `getDebugInfo`

## `services/health/src/controllers/public/health.public.controller.ts` — `@Controller()`

- `GET /` — `getAggregatedHealth`
- `GET /detailed` — `getDetailedHealth`
- `GET /ready` — `getReadiness`
- `GET /live` — `getLiveness`
- `HEAD /ping` — `pingHead`
- `GET /ping` — `pingGet`
- `GET /database` — `getDatabaseHealth`
- `GET /cache` — `getCacheHealth`
- `GET /queue` — `getQueueHealth`
- `GET /storage` — `getStorageHealth`
- `GET /microservices` — `getMicroservicesHealth`
- `GET /external` — `getExternalHealth`
- `GET /workers` — `getWorkersHealth`
- `GET /websocket` — `getWebsocketHealth`
- `GET /system` — `getSystemMetrics`
- `GET /features` — `getFeatureFlags`
- `GET /registry` — `getRegistryHealth`

## `services/media/src/media/chunked-upload.controller.ts` — `@Controller(media/upload/chunked)`

- `POST /media/upload/chunked/init` — `initChunkedUpload`
- `POST /media/upload/chunked/:uploadId/part` — `uploadChunk`
- `POST /media/upload/chunked/:uploadId/complete` — `completeChunkedUpload`
- `GET /media/upload/chunked/:uploadId/status` — `getChunkUploadStatus`
- `POST /media/upload/chunked/:uploadId/abort` — `abortChunkedUpload`

## `services/media/src/media/media-root.controller.ts` — `@Controller()`

- `GET /health` — `health`
- `POST /upload` — `upload`
- `GET /stats` — `getStats`
- `GET /:id/status` — `getProcessingStatus`

## `services/media/src/media/media.admin.controller.ts` — `@Controller(admin/media)`

- `GET /admin/media` — `getAllMedia`
- `GET /admin/media/browse` — `browseStorage`
- `POST /admin/media/promote-to-portfolio` — `promoteToPortfolio`
- `GET /admin/media/users/:userId` — `getUserMedia`
- `GET /admin/media/quarantine` — `getQuarantinedMedia`
- `GET /admin/media/analytics` — `getStorageAnalytics`
- `GET /admin/media/storage/analytics` — `getStorageAnalyticsLegacyPath`
- `GET /admin/media/storage-usage` — `getStorageUsage`
- `GET /admin/media/storage-stats` — `getStorageStatsAlias`
- `GET /admin/media/stats` — `getStatsAlias`
- `GET /admin/media/orphans` — `listOrphans`
- `POST /admin/media/cleanup` — `runCleanup`
- `POST /admin/media/backfill-context` — `backfillContext`
- `POST /admin/media/bulk-delete` — `bulkDeleteMedia`
- `PATCH /admin/media/settings` — `updateSettings`
- `POST /admin/media/quarantine/:id/release` — `releaseQuarantinedMedia`
- `DELETE /admin/media/quarantine/:id` — `deleteQuarantinedMedia`
- `GET /admin/media/:id/download` — `getMediaDownloadUrl`
- `GET /admin/media/:id/references` — `getMediaReferences`
- `GET /admin/media/:id/shares` — `getMediaShares`
- `POST /admin/media/:id/share` — `createMediaShare`
- `DELETE /admin/media/:id/share` — `revokeMediaShares`
- `DELETE /admin/media/:id/shares/:shareLinkId` — `revokeMediaShareById`
- `GET /admin/media/:id` — `getMediaDetails`
- `POST /admin/media/:id/reprocess` — `reprocessMedia`
- `POST /admin/media/:id/replace` — `replaceMediaFile`
- `PATCH /admin/media/:id` — `updateMediaMetadata`
- `DELETE /admin/media/:id` — `deleteMedia`

## `services/media/src/media/media.controller.ts` — `@Controller(media)`

- `GET /media` — `getUserMedia`
- `GET /media/shared` — `listSharedMedia`
- `POST /media/upload/request` — `requestUpload`
- `POST /media/upload/confirm` — `confirmUpload`
- `POST /media/upload/direct` — `directUpload`
- `GET /media/storage-usage` — `getStorageUsage`
- `GET /media/storage/stats` — `getStorageStatsLegacyPath`
- `GET /media/stats` — `getStorageStatsLegacyStats`
- `GET /media/:id/status` — `getProcessingStatus`
- `GET /media/:id` — `getMediaDetails`
- `PATCH /media/:id` — `updateMetadata`
- `PATCH /media/:id/metadata` — `updateMetadataLegacyPath`
- `DELETE /media/:id` — `deleteMedia`
- `GET /media/:id/download` — `getDownloadUrl`
- `POST /media/:id/copy` — `copyMedia`
- `POST /media/:id/move` — `moveMedia`
- `POST /media/:id/regenerate-thumbnail` — `regenerateThumbnail`
- `GET /media/:id/versions` — `getVersions`

## `services/media/src/share/public-share.controller.ts` — `@Controller(share)`

- `GET /share/:token` — `resolveShare`
- `POST /share/:token` — `resolveShareWithPassword`

## `services/media/src/share/share.controller.ts` — `@Controller(media)`

- `GET /media/:id/shares` — `listShareLinksForMedia`
- `POST /media/:id/share` — `createShareLink`
- `DELETE /media/:id/share` — `revokeAllShareLinks`
- `DELETE /media/:id/shares/:shareLinkId` — `revokeShareLinkById`

## `services/messaging/src/controllers/admin/messages.admin.controller.ts` — `@Controller(admin/messages)`

- `GET /admin/messages` — `getAllMessages`
- `DELETE /admin/messages/:id` — `deleteMessage`
- `GET /admin/messages/stats` — `getMessageStats`
- `GET /admin/messages/analytics` — `getMessagingAnalytics`
- `GET /admin/messages/conversations` — `getAdminConversations`
- `GET /admin/messages/project/:projectId` — `adminGetMessages`
- `POST /admin/messages/:id/flag` — `flagMessage`
- `POST /admin/messages/projects/:projectId/system` — `broadcastSystemMessage`
- `GET /admin/messages/flagged` — `getFlagged`
- `GET /admin/messages/moderation-history` — `listModerationHistory`
- `POST /admin/messages/flagged/:id/dismiss` — `dismissFlagged`
- `DELETE /admin/messages/flagged/:id` — `deleteFlagged`
- `POST /admin/messages/flagged/:id/escalate` — `escalateFlagged`
- `POST /admin/messages/flagged/:id/restore` — `restoreFlagged`

## `services/messaging/src/controllers/user/chat-threads.controller.ts` — `@Controller(messages/threads)`

- `GET /messages/threads` — `list`
- `POST /messages/threads/direct` — `direct`
- `POST /messages/threads/group` — `group`
- `GET /messages/threads/:threadId` — `getThread`
- `PATCH /messages/threads/:threadId` — `updateThread`
- `GET /messages/threads/:threadId/members` — `listMembers`
- `POST /messages/threads/:threadId/members` — `addMembers`
- `DELETE /messages/threads/:threadId/members/:memberUserId` — `removeMember`
- `POST /messages/threads/:threadId/leave` — `leave`
- `POST /messages/threads/:threadId/archive` — `archive`
- `POST /messages/threads/:threadId/unarchive` — `unarchive`
- `POST /messages/threads/:threadId/user-archive` — `userArchive`
- `POST /messages/threads/:threadId/user-unarchive` — `userUnarchive`
- `POST /messages/threads/:threadId/user-hide` — `userHide`
- `GET /messages/threads/:threadId/messages` — `listMessages`
- `POST /messages/threads/:threadId/messages` — `send`
- `POST /messages/threads/:threadId/read` — `markRead`

## `services/messaging/src/controllers/user/conversations.controller.ts` — `@Controller(conversations)`

- `GET /conversations` — `getConversations`
- `GET /conversations/unread-count` — `getUnreadCount`

## `services/messaging/src/controllers/user/message-threads.controller.ts` — `@Controller(messages/:messageId/threads)`

- `GET /messages/:messageId/threads` — `getThreadReplies`
- `POST /messages/:messageId/threads` — `replyInThread`

## `services/messaging/src/controllers/user/messages.controller.ts` — `@Controller(messages)`

- `GET /messages/health` — `health`
- `GET /messages/unread-count` — `getUnreadCount`
- `GET /messages/search` — `search`
- `GET /messages/projects/:projectId` — `getProjectMessages`
- `GET /messages/project/:projectId` — `getProjectMessagesAlias`
- `POST /messages/projects/:projectId` — `sendProjectMessage`
- `POST /messages/project/:projectId` — `sendProjectMessageAlias`
- `POST /messages` — `sendMessage`
- `GET /messages/project/:projectId/search` — `searchMessages`
- `PATCH /messages/:id` — `editMessage`
- `DELETE /messages/:id` — `deleteMessage`
- `POST /messages/:id/read` — `markAsRead`
- `POST /messages/project/:projectId/read` — `markProjectAsRead`
- `POST /messages/projects/:projectId/read-all` — `markProjectAsReadAll`
- `POST /messages/:id/pin` — `pinMessage`
- `POST /messages/:id/unpin` — `unpinMessage`
- `POST /messages/:id/flag` — `flagMessage`
- `GET /messages/project/:projectId/attachments` — `listAttachments`
- `GET /messages/:messageId/thread` — `getThread`
- `POST /messages/:messageId/thread` — `replyToThread`

## `services/notifications/src/internal/internal.controller.ts` — `@Controller(internal/notifications)`

- `POST /internal/notifications/trigger` — `triggerNotification`

## `services/notifications/src/notifications/notification-templates.admin-legacy.controller.ts` — `@Controller(['admin/templates', 'admin/notification-templates'])`

- `GET /['admin/templates', 'admin/notification-templates']` — `getTemplates`
- `POST /['admin/templates', 'admin/notification-templates']` — `createTemplate`
- `PATCH /['admin/templates', 'admin/notification-templates']/:id` — `updateTemplate`
- `DELETE /['admin/templates', 'admin/notification-templates']/:id` — `deleteTemplate`

## `services/notifications/src/notifications/notification-templates.admin.controller.ts` — `@Controller(admin/notifications/templates)`

- `GET /admin/notifications/templates` — `getTemplates`
- `POST /admin/notifications/templates` — `createTemplate`
- `PATCH /admin/notifications/templates/:id` — `updateTemplate`
- `DELETE /admin/notifications/templates/:id` — `deleteTemplate`

## `services/notifications/src/notifications/notifications-root.controller.ts` — `@Controller()`

- `GET /health` — `health`
- `POST /test` — `sendTest`

## `services/notifications/src/notifications/notifications.admin.controller.ts` — `@Controller(admin/notifications)`

- `GET /admin/notifications` — `getAllNotifications`
- `GET /admin/notifications/stats` — `getStats`
- `GET /admin/notifications/delivery-report` — `getDeliveryReport`
- `POST /admin/notifications/send` — `sendNotification`
- `POST /admin/notifications/broadcast` — `broadcastNotification`
- `POST /admin/notifications/segment` — `sendToSegment`
- `DELETE /admin/notifications/user/:userId` — `clearUserNotifications`
- `POST /admin/notifications/:id/resend` — `resendNotification`

## `services/notifications/src/notifications/notifications.controller.ts` — `@Controller(notifications)`

- `GET /notifications` — `getNotifications`
- `GET /notifications/unread-count` — `getUnreadCount`
- `GET /notifications/history` — `getHistory`
- `GET /notifications/:id` — `getNotification`
- `PATCH /notifications/:id/read` — `markAsRead`
- `PATCH /notifications/:id/unread` — `markAsUnread`
- `POST /notifications/read-all` — `markAllAsRead`
- `POST /notifications/read-selected` — `markSelectedAsRead`
- `DELETE /notifications/clear-read` — `clearReadNotifications`
- `DELETE /notifications/:id` — `deleteNotification`

## `services/notifications/src/preferences/preferences.controller.ts` — `@Controller(notifications)`

- `GET /notifications/preferences` — `getPreferences`
- `PATCH /notifications/preferences` — `updatePreferences`
- `GET /notifications/channels` — `getNotificationChannels`
- `GET /notifications/preferences/channels` — `getChannels`
- `PATCH /notifications/preferences/channel/:channel` — `updateChannel`

## `services/notifications/src/push/push.controller.ts` — `@Controller(push)`

- `POST /push/register` — `registerDevice`
- `DELETE /push/unregister/:deviceId` — `unregisterDevice`

## `services/notifications/src/subscriptions/subscriptions.controller.ts` — `@Controller(push-subscription)`

- `POST /push-subscription` — `registerSubscription`
- `DELETE /push-subscription` — `removeSubscription`

## `services/payments/src/controllers/admin/company-legal-profile.admin.controller.ts` — `@Controller(admin/payments/company-legal)`

- `GET /admin/payments/company-legal` — `list`
- `POST /admin/payments/company-legal` — `create`
- `PATCH /admin/payments/company-legal/:id` — `update`
- `DELETE /admin/payments/company-legal/:id` — `remove`

## `services/payments/src/controllers/admin/payment-disputes.admin.controller.ts` — `@Controller(admin/payments)`

- `GET /admin/payments/disputes` — `getDisputes`
- `GET /admin/payments/disputes/:id` — `getDisputeDetails`
- `POST /admin/payments/disputes/:id/resolve` — `resolveDispute`
- `PATCH /admin/payments/disputes/:id` — `updateDispute`
- `POST /admin/payments/disputes/:id/respond` — `respondDispute`
- `POST /admin/payments/reconcile` — `reconcilePayments`

## `services/payments/src/controllers/admin/payment-milestones.admin.controller.ts` — `@Controller(admin/milestones)`

- `GET /admin/milestones/:id/payments` — `getPaymentsByMilestone`
- `POST /admin/milestones/:id/mark-complete` — `markComplete`
- `POST /admin/milestones/:id/request-payment` — `requestPayment`

## `services/payments/src/controllers/admin/payments.admin.controller.ts` — `@Controller(admin/payments)`

- `GET /admin/payments` — `getPayments`
- `GET /admin/payments/stats` — `getStats`
- `GET /admin/payments/summary` — `getSummary`
- `GET /admin/payments/reconciliation` — `getReconciliation`
- `GET /admin/payments/milestones` — `listMilestones`
- `GET /admin/payments/milestones/:id` — `getMilestone`
- `PATCH /admin/payments/milestones/:id` — `updateMilestone`
- `GET /admin/payments/revenue/report` — `getRevenueReport`
- `GET /admin/payments/revenue/export` — `exportRevenue`
- `GET /admin/payments/:id/documents/versions` — `listDocumentVersions`
- `GET /admin/payments/:id/receipt` — `downloadReceipt`
- `GET /admin/payments/:id/invoice` — `downloadInvoice`
- `GET /admin/payments/:id` — `getPaymentDetails`
- `POST /admin/payments/:id/refund` — `processRefund`
- `POST /admin/payments/:id/cancel` — `cancelPayment`
- `POST /admin/payments/:id/verify` — `verifyPayment`
- `POST /admin/payments/projects/:projectId/reconcile-state` — `reconcileProjectPaymentState`
- `POST /admin/payments/manual` — `createManualPayment`
- `POST /admin/payments/:id/manual-payment` — `recordManualPaymentById`
- `POST /admin/payments/milestones/:id/release` — `releaseMilestonePayment`
- `GET /admin/payments/:id/transactions` — `getTransactionHistory`
- `GET /admin/payments/:id/timeline` — `getPaymentTimeline`
- `GET /admin/payments/methods/supported` — `getSupportedMethods`
- `POST /admin/payments/:id/approve-transfer` — `approveTransfer`
- `POST /admin/payments/:id/reject-transfer` — `rejectTransfer`
- `PATCH /admin/payments/settings` — `updatePaymentSettings`

## `services/payments/src/controllers/admin/platform-payment-accounts.admin.controller.ts` — `@Controller(admin/payments/accounts)`

- `GET /admin/payments/accounts` — `list`
- `POST /admin/payments/accounts` — `create`
- `PATCH /admin/payments/accounts/:id` — `update`
- `DELETE /admin/payments/accounts/:id` — `remove`

## `services/payments/src/controllers/user/documents.controller.ts` — `@Controller(payments)`

- `GET /payments/:id/documents/versions` — `listVersions`

## `services/payments/src/controllers/user/invoices.controller.ts` — `@Controller(invoices)`

- `GET /invoices` — `listInvoices`
- `GET /invoices/:id` — `getInvoice`
- `GET /invoices/:id/download` — `downloadInvoice`

## `services/payments/src/controllers/user/payment-methods.controller.ts` — `@Controller(payments/methods)`

- `GET /payments/methods` — `getMethods`
- `POST /payments/methods` — `addMethod`
- `DELETE /payments/methods/:id` — `removeMethod`
- `PATCH /payments/methods/:id/default` — `setDefault`
- `PATCH /payments/methods/:id/nickname` — `updateNickname`

## `services/payments/src/controllers/user/payments.controller.ts` — `@Controller(payments)`

- `GET /payments/health` — `health`
- `GET /payments/platform-accounts` — `listPlatformAccounts`
- `POST /payments/bank-transfer/submit` — `submitBankTransfer`
- `POST /payments/create-intent` — `createIntent`
- `POST /payments/initiate` — `initiatePayment`
- `POST /payments/confirm` — `confirmPayment`
- `GET /payments` — `getMyPayments`
- `GET /payments/projects/:projectId` — `getProjectPayments`
- `GET /payments/projects/:projectId/milestones` — `getProjectMilestones`
- `GET /payments/stats` — `getPaymentStats`
- `GET /payments/:id/status` — `getPaymentStatus`
- `GET /payments/:id` — `getPaymentDetails`
- `GET /payments/:id/receipt` — `downloadReceipt`
- `GET /payments/:id/invoice` — `downloadInvoice`
- `POST /payments/:id/dispute` — `fileDispute`
- `POST /payments/:id/cancel` — `cancelPayment`

## `services/payments/src/controllers/webhooks/razorpay-webhook.controller.ts` — `@Controller(webhooks/razorpay)`

- `POST /webhooks/razorpay` — `handleWebhook`

## `services/portfolio/src/controllers/admin/portfolio-categories.admin.controller.ts` — `@Controller(admin/portfolio/categories)`

- `GET /admin/portfolio/categories` — `findAll`
- `POST /admin/portfolio/categories` — `create`
- `PATCH /admin/portfolio/categories/:id` — `update`
- `DELETE /admin/portfolio/categories/:id` — `remove`

## `services/portfolio/src/controllers/admin/portfolio.admin.controller.ts` — `@Controller(admin/portfolio)`

- `GET /admin/portfolio` — `findAll`
- `POST /admin/portfolio` — `create`
- `POST /admin/portfolio/reorder` — `reorder`
- `POST /admin/portfolio/bulk-update` — `bulkUpdate`
- `GET /admin/portfolio/analytics` — `getAnalytics`
- `GET /admin/portfolio/analytics/:id` — `getItemAnalytics`
- `GET /admin/portfolio/:id` — `findOne`
- `PATCH /admin/portfolio/:id` — `update`
- `DELETE /admin/portfolio/:id` — `remove`
- `POST /admin/portfolio/:id/publish` — `publish`
- `POST /admin/portfolio/:id/unpublish` — `unpublish`
- `POST /admin/portfolio/:id/archive` — `archive`
- `POST /admin/portfolio/:id/toggle-featured` — `toggleFeatured`
- `PATCH /admin/portfolio/:id/privacy` — `updatePrivacy`
- `POST /admin/portfolio/:id/duplicate` — `duplicate`
- `GET /admin/portfolio/:id/media` — `listMedia`
- `POST /admin/portfolio/:id/media/upload` — `uploadMedia`
- `POST /admin/portfolio/:id/media` — `addMedia`
- `DELETE /admin/portfolio/:id/media/:mediaId` — `removeMedia`
- `POST /admin/portfolio/:id/media/:mediaId/thumbnail` — `setThumbnail`
- `POST /admin/portfolio/:id/media/:mediaId/featured-video` — `setFeaturedVideo`
- `PATCH /admin/portfolio/:id/media/reorder` — `reorderMedia`

## `services/portfolio/src/controllers/public/portfolio.public.controller.ts` — `@Controller(portfolio)`

- `GET /portfolio` — `list`
- `GET /portfolio/featured` — `getFeatured`
- `GET /portfolio/categories` — `getCategories`
- `GET /portfolio/tags` — `getTags`
- `GET /portfolio/search` — `search`
- `GET /portfolio/health` — `health`
- `GET /portfolio/timeline` — `getTimeline`
- `GET /portfolio/:idOrSlug` — `getDetail`
- `POST /portfolio/:idOrSlug/view` — `recordView`
- `POST /portfolio/:idOrSlug/like` — `toggleLike`

## `services/progress/src/controllers/admin/deliverables.admin.controller.ts` — `@Controller(admin)`

- `POST /admin/projects/:projectId/deliverables` — `uploadDeliverable`
- `GET /admin/projects/:projectId/deliverables` — `getProjectDeliverables`
- `PATCH /admin/deliverables/:id` — `updateDeliverable`
- `DELETE /admin/deliverables/:id` — `deleteDeliverable`

## `services/progress/src/controllers/admin/milestones.admin.controller.ts` — `@Controller(admin)`

- `POST /admin/projects/:projectId/milestones` — `createMilestone`
- `PATCH /admin/milestones/:id` — `updateMilestone`
- `POST /admin/milestones/:id/complete` — `completeMilestone`

## `services/progress/src/controllers/admin/progress.admin.controller.ts` — `@Controller(admin/progress)`

- `POST /admin/progress/projects/:projectId` — `createProgressEntry`
- `GET /admin/progress/projects/:projectId` — `getProjectProgress`
- `PATCH /admin/progress/:id` — `updateProgressEntry`
- `DELETE /admin/progress/:id` — `deleteProgressEntry`
- `GET /admin/progress/projects/:projectId/analytics` — `getAnalytics`
- `GET /admin/progress/projects/:projectId/timeline` — `getAdminTimeline`
- `PATCH /admin/progress/projects/:projectId/status` — `updateProjectStatus`
- `POST /admin/progress/projects/:projectId/complete` — `markProjectComplete`

## `services/progress/src/controllers/admin/time-entries.admin.controller.ts` — `@Controller(admin/time-entries)`

- `GET /admin/time-entries` — `list`
- `POST /admin/time-entries` — `create`

## `services/progress/src/controllers/progress-health.controller.ts` — `@Controller(progress)`

- `GET /progress/health` — `health`

## `services/progress/src/controllers/user/deliverable-reviews.controller.ts` — `@Controller(deliverables)`

- `POST /deliverables/:id/approve` — `approveDeliverable`
- `POST /deliverables/:id/reject` — `rejectDeliverable`

## `services/progress/src/controllers/user/milestone-approvals.controller.ts` — `@Controller(milestones)`

- `POST /milestones/:id/approve` — `approveMilestone`
- `POST /milestones/:id/request-revision` — `requestRevision`

## `services/progress/src/controllers/user/progress.controller.ts` — `@Controller(projects/:projectId/progress)`

- `GET /projects/:projectId/progress` — `getTimeline`
- `GET /projects/:projectId/progress/status` — `getStatusSummary`
- `GET /projects/:projectId/progress/milestones` — `getMilestoneProgress`
- `POST /projects/:projectId/progress/request-changes` — `requestChanges`
- `GET /projects/:projectId/progress/:entryId` — `getEntry`
- `POST /projects/:projectId/progress` — `createProgressEntry`

## `services/projects/src/controllers/projects-internal.controller.ts` — `@Controller(internal/projects)`

- `POST /internal/projects/provision-from-quote` — `provisionFromQuote`

## `services/projects/src/controllers/projects.admin.controller.ts` — `@Controller(admin/projects)`

- `GET /admin/projects` — `?`
- `GET /admin/projects/stats` — `getProjectStats`
- `PATCH /admin/projects/:id/status` — `updateProjectStatus`
- `GET /admin/projects/:id/status-history` — `getProjectStatusHistory`
- `PATCH /admin/projects/:id` — `updateProject`
- `GET /admin/projects/:id/duplicate-preview` — `getDuplicatePreview`
- `GET /admin/projects/:id` — `getProjectDetails`
- `POST /admin/projects` — `createProject`
- `POST /admin/projects/from-template` — `createFromTemplate`
- `DELETE /admin/projects/:id` — `deleteProject`
- `POST /admin/projects/:id/team` — `manageTeam`
- `DELETE /admin/projects/:id/team/:memberId` — `removeTeamMember`
- `GET /admin/projects/:id/analytics` — `getAnalytics`
- `POST /admin/projects/:id/milestones` — `createMilestones`
- `POST /admin/projects/:id/extend` — `extendDeadline`
- `POST /admin/projects/:id/archive` — `archiveProject`
- `POST /admin/projects/:id/unarchive` — `unarchiveProject`
- `POST /admin/projects/:id/duplicate` — `duplicateProject`
- `GET /admin/projects/:id/portfolio-link` — `getProjectPortfolioLink`
- `GET /admin/projects/:id/portfolio-preview` — `getProjectPortfolioPreview`
- `POST /admin/projects/:id/create-portfolio-draft` — `createPortfolioDraftFromProject`
- `POST /admin/projects/:id/export` — `exportProject`
- `GET /admin/projects/:id/export/download` — `downloadProjectExport`

## `services/projects/src/controllers/projects.controller.ts` — `@Controller(projects)`

- `GET /projects/health` — `healthCheck`
- `GET /projects/stats` — `getStats`
- `GET /projects` — `listProjects`
- `GET /projects/by-quote/:quoteId` — `getProjectByQuoteId`
- `GET /projects/:id` — `getProjectDetails`
- `GET /projects/:id/timeline` — `getTimeline`
- `GET /projects/:id/deliverables` — `getDeliverables`
- `GET /projects/:id/payments` — `getPayments`
- `POST /projects/:id/approve` — `approveProject`
- `POST /projects/:id/sign-contract` — `signContract`
- `POST /projects/:id/request-revision` — `requestRevision`
- `GET /projects/:id/progress` — `getProgress`
- `GET /projects/:id/milestones` — `getMilestones`
- `GET /projects/:id/messages` — `getMessages`
- `POST /projects/:id/messages` — `sendMessage`
- `POST /projects/:id/feedback` — `submitFeedback`
- `GET /projects/:id/feedback` — `getFeedback`

## `services/projects/src/controllers/projects.public.controller.ts` — `@Controller(public)`

- `GET /public` — `listPublicProjects`
- `GET /public/:id` — `getPublicProjectDetails`

## `services/quotes/src/controllers/documents.controller.ts` — `@Controller(quotes)`

- `GET /quotes/:id/documents/versions` — `listVersions`
- `GET /quotes/:id/contract/preview` — `previewContract`
- `GET /quotes/:id/contract` — `downloadContract`

## `services/quotes/src/controllers/quotes.admin.controller.ts` — `@Controller(admin/quotes)`

- `GET /admin/quotes` — `?`
- `GET /admin/quotes/stats` — `getStats`
- `GET /admin/quotes/templates` — `getTemplates`
- `POST /admin/quotes/templates` — `createQuoteTemplate`
- `GET /admin/quotes/line-item-library` — `listLineItemLibrary`
- `POST /admin/quotes/line-item-library` — `createLineItemBlock`
- `PATCH /admin/quotes/line-item-library/:id` — `updateLineItemBlock`
- `DELETE /admin/quotes/line-item-library/:id` — `deactivateLineItemBlock`
- `GET /admin/quotes/payment-schedule-presets` — `listPaymentSchedulePresets`
- `POST /admin/quotes` — `createQuote`
- `POST /admin/quotes/:id/send` — `sendQuote`
- `POST /admin/quotes/:id/resend` — `resendQuote`
- `GET /admin/quotes/:id` — `getQuoteDetails`
- `PATCH /admin/quotes/:id` — `updateQuote`
- `DELETE /admin/quotes/:id` — `deleteQuote`
- `POST /admin/quotes/:id/duplicate` — `duplicateQuote`
- `POST /admin/quotes/:id/revise` — `createRevision`
- `GET /admin/quotes/:id/history` — `getHistory`
- `GET /admin/quotes/:id/documents/versions` — `listDocumentVersions`
- `POST /admin/quotes/:id/extend` — `extendQuote`
- `GET /admin/quotes/:id/pdf` — `getAdminPDF`
- `GET /admin/quotes/:id/contract` — `getAdminContract`

## `services/quotes/src/controllers/quotes.controller.ts` — `@Controller(quotes)`

- `GET /quotes/health` — `healthCheck`
- `GET /quotes` — `listQuotes`
- `GET /quotes/stats` — `getStats`
- `GET /quotes/:id` — `getQuoteDetails`
- `POST /quotes/:id/accept` — `acceptQuote`
- `POST /quotes/:id/decline` — `declineQuote`
- `POST /quotes/:id/request-changes` — `requestChanges`
- `GET /quotes/:id/pdf` — `downloadPdf`

## `services/requests/src/controllers/requests.admin.controller.ts` — `@Controller(admin/requests)`

- `GET /admin/requests` — `?`
- `GET /admin/requests/stats` — `getOverallStats`
- `GET /admin/requests/capacity/dashboard` — `getCapacityDashboard`
- `PATCH /admin/requests/settings/capacity` — `updateCapacity`
- `GET /admin/requests/:id` — `getRequestDetails`
- `PATCH /admin/requests/:id/status` — `updateRequestStatus`
- `POST /admin/requests/:id/quotes` — `createQuote`
- `POST /admin/requests/:id/quotes/prefill` — `suggestQuotePrefill`
- `POST /admin/requests/:id/notes` — `addNote`
- `GET /admin/requests/:id/notes` — `getNotes`
- `PATCH /admin/requests/:id` — `updateRequest`
- `POST /admin/requests/:id/assign` — `assignRequest`
- `DELETE /admin/requests/:id` — `deleteRequest`
- `GET /admin/requests/:id/attachments/:attachmentId/download` — `getAttachmentDownloadUrl`

## `services/requests/src/controllers/requests.controller.ts` — `@Controller(requests)`

- `GET /requests/health` — `healthCheck`
- `POST /requests` — `createRequest`
- `GET /requests` — `listRequests`
- `GET /requests/stats` — `getStats`
- `GET /requests/:id/status` — `getStatusTimeline`
- `GET /requests/:id` — `getRequestDetails`
- `PATCH /requests/:id` — `updateRequest`
- `POST /requests/:id/submit` — `submitRequest`
- `DELETE /requests/:id` — `deleteRequest`
- `GET /requests/:id/attachments` — `getAttachments`
- `POST /requests/:id/attachments` — `addAttachment`
- `DELETE /requests/:id/attachments/:attachmentId` — `removeAttachment`
- `GET /requests/:id/attachments/:attachmentId/download` — `getAttachmentDownloadUrl`
- `GET /requests/:id/quotes` — `getRequestQuotes`

## `services/requests/src/controllers/service-packages.admin.controller.ts` — `@Controller(admin/service-packages)`

- `GET /admin/service-packages` — `list`
- `POST /admin/service-packages` — `upsert`
- `PATCH /admin/service-packages/:id` — `update`

## `services/requests/src/controllers/services.public.controller.ts` — `@Controller(services)`

- `GET /services` — `list`
- `GET /services/:slug` — `getOne`

## `services/users/src/controllers/audit-logs.admin.controller.ts` — `@Controller(admin/logs)`

- `GET /admin/logs` — `getAuditLogs`
- `GET /admin/logs/security-stats` — `getSecurityStats`

## `services/users/src/controllers/users.admin.controller.ts` — `@Controller(admin/users)`

- `GET /admin/users` — `listUsers`
- `GET /admin/users/search` — `searchUsers`
- `GET /admin/users/security-stats` — `getUsersSecurityStatsAlias`
- `POST /admin/users/bulk` — `bulkOperation`
- `DELETE /admin/users/sessions/:sessionId` — `terminateUserSession`
- `GET /admin/users/:userId` — `getLogs`
- `GET /admin/users/logs` — `getLogs`
- `GET /admin/users/logs/security-stats` — `getSecurityStats`
- `GET /admin/users/:userId` — `getUserDetails`
- `PATCH /admin/users/:userId` — `updateUser`
- `PATCH /admin/users/:userId/role` — `changeRole`
- `PATCH /admin/users/:userId/status` — `changeUserStatus`
- `POST /admin/users/:userId/force-password-reset` — `forcePasswordReset`
- `POST /admin/users/:userId/reset-password` — `adminResetPassword`
- `GET /admin/users/:userId/sessions` — `getUserSessions`
- `POST /admin/users/:userId/terminate-all-sessions` — `terminateAllUserSessions`
- `POST /admin/users/:userId/export` — `exportUserData`
- `GET /admin/users/:userId/activity` — `getUserActivity`
- `DELETE /admin/users/:userId` — `deleteUser`
- `POST /admin/users/:userId/restore` — `restoreUser`

## `services/users/src/controllers/users.controller.ts` — `@Controller(users)`

- `GET /users/health` — `healthCheck`
- `GET /users/profile` — `getProfile`
- `PATCH /users/profile` — `updateProfile`
- `POST /users/avatar` — `uploadAvatar`
- `DELETE /users/avatar` — `removeAvatar`
- `GET /users/preferences` — `getPreferences`
- `PATCH /users/preferences` — `updatePreferences`
- `PATCH /users/password` — `changePassword`
- `POST /users/change-password` — `changePasswordPost`
- `POST /users/2fa/enable` — `enable2FA`
- `POST /users/2fa/verify` — `verify2FASetup`
- `POST /users/2fa/disable` — `disable2FA`
- `GET /users/2fa/status` — `get2FAStatus`
- `GET /users/2fa/backup-codes` — `getBackupCodes`
- `POST /users/2fa/regenerate-codes` — `regenerateBackupCodes`
- `GET /users/sessions` — `getSessions`
- `GET /users/sessions/:sessionId` — `getSessionDetails`
- `DELETE /users/sessions/:sessionId` — `terminateSession`
- `POST /users/sessions/terminate-others` — `terminateOtherSessions`
- `POST /users/delete-account` — `deleteAccount`
- `POST /users/cancel-deletion` — `cancelDeletion`
- `GET /users/activity` — `getActivity`
- `GET /users/export` — `requestDataExport`
- `GET /users/data-export` — `requestDataExportAlias`
- `GET /users/export/:id` — `downloadDataExport`

## `services/webhooks/src/controllers/webhook/webhook-receiver.controller.ts` — `@Controller()`

- `POST /razorpay` — `handleRazorpay`
- `POST /cloudflare` — `handleCloudflare`
- `POST /github` — `handleGitHub`
- `POST /stripe` — `handleStripe`
- `POST /:provider` — `handleProvider`

## `services/webhooks/src/controllers/webhook/webhooks-health.controller.ts` — `@Controller()`

- `GET /health` — `health`

## `ws-gateway/src/controllers/ws-health.controller.ts` — `@Controller()`

- `GET /health` — `health`

