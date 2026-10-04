# Frontend apiServices method usage

## apps/web/src

### apps/web/src/app/(auth)/reset-password/ResetPasswordClient.tsx
- `auth.resetPassword`

### apps/web/src/app/(auth)/verify-email/VerifyEmailClient.tsx
- `auth.resendVerification`
- `auth.verifyEmail`

### apps/web/src/app/(dashboard)/dashboard/DashboardOverview.tsx
- `messaging.conversations`
- `payments.list`
- `projects.list`
- `quotes.list`
- `users.getDashboardSummary`

### apps/web/src/app/(dashboard)/projects/ProjectsListClient.tsx
- `projects.list`

### apps/web/src/app/impersonate/ImpersonateHandoff.tsx
- `users.getProfile`

### apps/web/src/components/auth/SessionBootstrap.tsx
- `users.getProfile`

### apps/web/src/components/auth/WebAuthGuard.tsx
- `users.getProfile`

### apps/web/src/components/layout/DashboardMessageLink.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/web/src/components/layout/DashboardNotificationLink.tsx
- `notifications.list`
- `notifications.markRead`
- `notifications.readAll`
- `notifications.unreadCount`

### apps/web/src/components/layout/NavbarUserMenu.tsx
- `auth.logout`

### apps/web/src/components/push/PushRegistration.tsx
- `push.registerWebPushSubscription`

### apps/web/src/features/auth/components/PasswordResetForm.tsx
- `auth.forgotPassword`

### apps/web/src/features/auth/components/RegisterForm.tsx
- `auth.checkEmail`

### apps/web/src/features/auth/components/TwoFactorChallengeForm.tsx
- `auth.verify2FA`
- `users.getProfile`

### apps/web/src/features/blog/BlogBookmarksClient.tsx
- `blog.getBookmarks`
- `blog.unbookmarkPost`

### apps/web/src/features/blog/BlogPostInteractionsClient.tsx
- `blog.bookmarkPost`
- `blog.deleteComment`
- `blog.getBookmarks`
- `blog.getPostEngagement`
- `blog.likePost`
- `blog.listComments`
- `blog.patchComment`
- `blog.postComment`
- `blog.unbookmarkPost`

### apps/web/src/features/blog/BlogSearchClient.tsx
- `blog.searchPosts`

### apps/web/src/features/contact/ContactFormClient.tsx
- `contact.createInquiry`

### apps/web/src/features/documents/components/LivePaymentDocumentsPanel.tsx
- `payments.getInvoiceUrl`
- `payments.getReceiptUrl`

### apps/web/src/features/documents/components/LiveQuoteDocumentsPanel.tsx
- `documents.getQuoteContractPreviewUrl`
- `documents.getQuoteContractUrl`
- `quotes.getPdfDownloadUrl`

### apps/web/src/features/invoices/InvoicesListClient.tsx
- `invoices.getDownloadUrl`

### apps/web/src/features/media/MediaLibraryClient.tsx
- `documents.downloadMine`
- `documents.listMine`
- `media.copy`
- `media.downloadUrl`
- `media.getProcessingStatus`
- `media.list`
- `media.listShared`
- `media.move`
- `media.regenerateThumbnail`
- `media.remove`
- `media.revokeShareById`
- `media.share`
- `media.storageStats`

### apps/web/src/features/media/components/FilePreviewDialog.tsx
- `media.downloadUrl`

### apps/web/src/features/messaging/ClientGroupMembersPanel.tsx
- `messaging.getChatThread`
- `messaging.leaveChatThread`

### apps/web/src/features/messaging/ClientInboxQueuePane.tsx
- `messaging.conversations`

### apps/web/src/features/messaging/ClientThreadActionsPanel.tsx
- `messaging.getChatThread`
- `messaging.userArchiveChatThread`
- `messaging.userHideChatThread`
- `messaging.userUnarchiveChatThread`

### apps/web/src/features/messaging/ConversationSearchSidebar.tsx
- `messaging.searchMessages`

### apps/web/src/features/messaging/ConversationsListPanel.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/web/src/features/messaging/MessageChatThreadClient.tsx
- `messaging.chatThreadMessages`
- `messaging.conversations`
- `messaging.deleteMessage`
- `messaging.flagMessage`
- `messaging.getChatThread`
- `messaging.markChatThreadRead`
- `messaging.patchMessage`
- `messaging.sendChatThreadMessage`

### apps/web/src/features/messaging/MessageFileAttachment.tsx
- `media.downloadUrl`

### apps/web/src/features/messaging/MessageNewDirectClient.tsx
- `messaging.createDirectThread`

### apps/web/src/features/messaging/MessageThreadClient.tsx
- `messaging.conversations`
- `messaging.deleteMessage`
- `messaging.flagMessage`
- `messaging.markProjectRead`
- `messaging.patchMessage`
- `messaging.pinMessage`
- `messaging.projectMessages`
- `messaging.sendProjectMessage`
- `messaging.unpinMessage`

### apps/web/src/features/messaging/MessagesOverviewClient.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/web/src/features/messaging/MessagesPanelClient.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/web/src/features/messaging/dock/ClientChatDockProvider.tsx
- `messaging.conversations`

### apps/web/src/features/messaging/dock/ClientDockChatWindow.tsx
- `messaging.chatThreadMessages`
- `messaging.getChatThread`
- `messaging.markChatThreadRead`
- `messaging.markProjectRead`
- `messaging.projectMessages`
- `messaging.sendChatThreadMessage`
- `messaging.sendProjectMessage`

### apps/web/src/features/notifications/NotificationsClient.tsx
- `notifications.clearRead`
- `notifications.delete`
- `notifications.list`
- `notifications.markRead`
- `notifications.readAll`
- `notifications.unreadCount`

### apps/web/src/features/payments/PaymentDetailClient.tsx
- `payments.cancel`
- `payments.fileDispute`
- `payments.getById`
- `payments.getInvoiceUrl`
- `payments.getReceiptUrl`

### apps/web/src/features/payments/PaymentInvoiceClient.tsx
- `payments.getInvoiceUrl`

### apps/web/src/features/payments/PaymentMethodsClient.tsx
- `payments.deleteMethod`
- `payments.listMethods`
- `payments.setDefaultMethod`

### apps/web/src/features/payments/components/OfflineBankTransferPanel.tsx
- `payments.listPlatformAccounts`
- `payments.submitBankTransfer`

### apps/web/src/features/payments/components/PaymentCheckoutLink.tsx
- `payments.initiate`

### apps/web/src/features/payments/components/PaymentStatsHero.tsx
- `payments.getStats`

### apps/web/src/features/portfolio/PortfolioLikeButton.tsx
- `portfolio.like`

### apps/web/src/features/portfolio/PortfolioSearch.tsx
- `portfolio.search`

### apps/web/src/features/profile/ProfileEditClient.tsx
- `users.getProfile`
- `users.removeAvatar`
- `users.updateProfile`
- `users.uploadAvatar`

### apps/web/src/features/profile/ProfileViewClient.tsx
- `users.getProfile`

### apps/web/src/features/progress/ProgressAttachmentLinks.tsx
- `media.downloadUrl`
- `media.getById`

### apps/web/src/features/progress/ProgressTimelineClient.tsx
- `progress.requestProjectChanges`
- `projects.getTimeline`

### apps/web/src/features/projects/ProjectDeliverySection.tsx
- `payments.listByProject`
- `payments.listMilestonesByProject`
- `progress.approveDeliverable`
- `progress.rejectDeliverable`
- `projects.approve`
- `projects.getDeliverables`
- `projects.getFeedback`
- `projects.requestRevision`
- `projects.submitFeedback`

### apps/web/src/features/projects/ProjectDetailClient.tsx
- `progress.getProjectStatus`

### apps/web/src/features/projects/ProjectsNewClient.tsx
- `quotes.list`

### apps/web/src/features/projects/hub/DeliverableFileAction.tsx
- `media.downloadUrl`

### apps/web/src/features/projects/hub/ProjectHubDeliverablesTab.tsx
- `progress.approveDeliverable`
- `progress.rejectDeliverable`
- `projects.getDeliverables`

### apps/web/src/features/projects/hub/ProjectHubFilesTab.tsx
- `media.list`
- `projects.getDeliverables`

### apps/web/src/features/projects/hub/ProjectHubMilestonesTab.tsx
- `payments.listMilestonesByProject`
- `progress.approveMilestone`
- `progress.requestMilestoneRevision`

### apps/web/src/features/projects/hub/ProjectHubOverviewTab.tsx
- `projects.approve`
- `projects.getDeliverables`
- `projects.getProgress`
- `projects.getTimeline`
- `projects.requestRevision`
- `projects.submitFeedback`

### apps/web/src/features/projects/hub/ProjectHubProgressTab.tsx
- `progress.requestProjectChanges`
- `projects.getTimeline`

### apps/web/src/features/requests/RequestsListClient.tsx
- `projects.list`

### apps/web/src/features/settings/SettingsAccountClient.tsx
- `users.cancelDeletion`
- `users.downloadDataExport`
- `users.getPreferences`
- `users.requestAccountDeletion`
- `users.requestDataExport`
- `users.updatePreferences`

### apps/web/src/features/settings/SettingsActivityClient.tsx
- `users.getActivity`

### apps/web/src/features/settings/SettingsNotificationsClient.tsx
- `notifications.getChannels`
- `notifications.getPreferences`
- `notifications.patchPreferences`

### apps/web/src/features/settings/SettingsSecurityClient.tsx
- `auth.logoutAll`
- `users.changePassword`
- `users.deleteSession`
- `users.disable2FA`
- `users.enable2FA`
- `users.get2FAStatus`
- `users.listSessions`
- `users.regenerateBackupCodes`
- `users.terminateOtherSessions`
- `users.verify2FASetup`

### apps/web/src/features/auth/hooks/use2FA.ts
- `users.get2FAStatus`

### apps/web/src/features/auth/hooks/useLogin.ts
- `auth.login`
- `users.getProfile`

### apps/web/src/features/auth/hooks/useRegister.ts
- `auth.register`

### apps/web/src/features/documents/hooks/useDocumentsApi.ts
- `documents.listPaymentVersions`
- `documents.listQuoteVersions`
- `documents.verify`

### apps/web/src/features/invoices/hooks/useInvoicesApi.ts
- `invoices.getById`
- `invoices.list`

### apps/web/src/features/payments/hooks/usePaymentCheckout.ts
- `payments.confirm`
- `payments.createIntent`
- `payments.getStatus`
- `users.getProfile`

## apps/admin/src

### apps/admin/src/app/(dashboard)/AdminConsoleLayout.tsx
- `auth.logout`

### apps/admin/src/components/admin/AdminMessageLink.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/admin/src/components/admin/AdminModerationLink.tsx
- `admin.getFlaggedMessages`

### apps/admin/src/components/admin/AdminNotificationLink.tsx
- `notifications.list`
- `notifications.markRead`
- `notifications.readAll`
- `notifications.unreadCount`

### apps/admin/src/components/admin/AdminUserMenu.tsx
- `auth.logout`

### apps/admin/src/components/admin/UserSearchCombobox.tsx
- `admin.listUsers`
- `admin.searchUsers`

### apps/admin/src/components/auth/AdminAuthGuard.tsx
- `users.getProfile`

### apps/admin/src/components/auth/AdminSessionBootstrap.tsx
- `users.getProfile`

### apps/admin/src/features/analytics/AnalyticsClient.tsx
- `admin.getAdminQuoteStats`
- `admin.getAdminRequestStats`
- `admin.getProjectMetrics`
- `admin.getRevenueAnalytics`
- `admin.getUserMetrics`

### apps/admin/src/features/audit/AuditClient.tsx
- `admin.endImpersonationAlias`
- `admin.getAuditLogs`
- `admin.getImpersonationSessions`
- `admin.getSecurityStats`
- `admin.getUsersLogs`

### apps/admin/src/features/auth/TwoFactorChallengeForm.tsx
- `auth.verify2FA`
- `users.getProfile`

### apps/admin/src/features/contact/ContactClient.tsx
- `admin.deleteContactMessage`
- `admin.listContactMessages`
- `admin.markContactSpam`
- `admin.respondToContact`
- `admin.updateContactStatus`

### apps/admin/src/features/content/AdminBlogPostEditorClient.tsx
- `admin.createAdminBlogPostFull`
- `admin.getAdminBlogPost`
- `admin.listBlogCategories`
- `admin.publishBlogPost`
- `admin.updateAdminBlogPost`

### apps/admin/src/features/content/BlogAnalyticsPanel.tsx
- `admin.getBlogPostsAnalytics`

### apps/admin/src/features/content/BlogCommentsPanel.tsx
- `admin.approveBlogComment`
- `admin.deleteBlogComment`
- `admin.getReportedComments`
- `admin.listAdminBlogComments`
- `admin.listPendingBlogComments`
- `admin.markCommentSpam`
- `admin.rejectComment`

### apps/admin/src/features/content/BlogPostActions.tsx
- `admin.archivePost`
- `admin.deleteAdminBlogPost`
- `admin.featureBlogPost`
- `admin.publishBlogPost`
- `admin.unfeatureBlogPost`
- `admin.unpublishBlogPost`

### apps/admin/src/features/content/BlogTaxonomyPanel.tsx
- `admin.createBlogCategory`
- `admin.createBlogTag`
- `admin.getPostRevisions`
- `admin.listAdminBlogPosts`
- `admin.listBlogAuthors`
- `admin.listBlogCategories`
- `admin.listBlogTags`
- `admin.mergeTags`
- `admin.restorePostRevision`

### apps/admin/src/features/content/ContentClient.tsx
- `admin.listAdminBlogPosts`
- `admin.listPendingBlogComments`

### apps/admin/src/features/content/ContentPostsPanel.tsx
- `admin.listAdminBlogPosts`

### apps/admin/src/features/dashboard/DashboardClient.tsx
- `admin.getAdminPaymentStats`
- `admin.getAdminRequestStats`
- `admin.getDashboardOverview`
- `admin.getFlaggedMessages`
- `admin.listAdminRequests`
- `admin.listContactMessages`

### apps/admin/src/features/documents/components/LiveAdminPaymentDocumentsPanel.tsx
- `admin.getAdminPaymentInvoice`
- `admin.getAdminPaymentReceipt`
- `documents.getAdminDocumentDownloadUrl`

### apps/admin/src/features/documents/components/LiveAdminQuoteDocumentsPanel.tsx
- `admin.getAdminQuoteContract`
- `admin.getAdminQuotePdf`
- `documents.getAdminDocumentDownloadUrl`

### apps/admin/src/features/integrations/IntegrationsClient.tsx
- `admin.createWebhook`
- `admin.deleteWebhook`
- `admin.disableWebhook`
- `admin.enableWebhook`
- `admin.listWebhooks`
- `admin.patchWebhook`
- `admin.testWebhook`
- `admin.webhookDeliveries`
- `admin.webhooksEvents`
- `admin.webhooksHealth`

### apps/admin/src/features/media/AdminMediaAllFilesClient.tsx
- `media.directUpload`
- `mediaAdmin.bulkDelete`
- `mediaAdmin.list`

### apps/admin/src/features/media/AdminMediaAnalyticsClient.tsx
- `mediaAdmin.cleanup`
- `mediaAdmin.getAnalytics`

### apps/admin/src/features/media/AdminMediaQuarantineClient.tsx
- `mediaAdmin.deleteQuarantined`
- `mediaAdmin.listQuarantined`
- `mediaAdmin.releaseQuarantined`
- `mediaAdmin.reprocess`

### apps/admin/src/features/media/AdminMediaStorageBrowser.tsx
- `documents.getAdminDocumentDownloadUrl`
- `documents.listForUser`
- `media.directUpload`
- `mediaAdmin.browse`
- `mediaAdmin.bulkDelete`
- `mediaAdmin.list`

### apps/admin/src/features/media/LazyMediaThumbnail.tsx
- `mediaAdmin.getById`

### apps/admin/src/features/messages/AdminChatDockProvider.tsx
- `messaging.conversations`

### apps/admin/src/features/messages/AdminChatThreadClient.tsx
- `messaging.chatThreadMessages`
- `messaging.conversations`
- `messaging.deleteMessage`
- `messaging.flagMessage`
- `messaging.getChatThread`
- `messaging.markChatThreadRead`
- `messaging.patchMessage`
- `messaging.sendChatThreadMessage`

### apps/admin/src/features/messages/AdminDockChatWindow.tsx
- `messaging.chatThreadMessages`
- `messaging.getChatThread`
- `messaging.markChatThreadRead`
- `messaging.markProjectRead`
- `messaging.projectMessages`
- `messaging.sendChatThreadMessage`
- `messaging.sendProjectMessage`

### apps/admin/src/features/messages/AdminGroupMembersPanel.tsx
- `messaging.addChatThreadMembers`
- `messaging.archiveChatThread`
- `messaging.getChatThread`
- `messaging.removeChatThreadMember`
- `messaging.unarchiveChatThread`
- `messaging.updateChatThread`

### apps/admin/src/features/messages/AdminInboxQueuePane.tsx
- `messaging.conversations`

### apps/admin/src/features/messages/AdminMessageFileAttachment.tsx
- `media.downloadUrl`

### apps/admin/src/features/messages/AdminMessagesContextRail.tsx
- `admin.getAdminProject`

### apps/admin/src/features/messages/AdminMessagesOverviewClient.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/admin/src/features/messages/AdminMessagesPanelClient.tsx
- `messaging.conversations`
- `messaging.unreadCount`

### apps/admin/src/features/messages/AdminNewDirectClient.tsx
- `messaging.createDirectThread`

### apps/admin/src/features/messages/AdminNewGroupChatClient.tsx
- `messaging.createGroupThread`

### apps/admin/src/features/messages/AdminProjectThreadClient.tsx
- `admin.broadcastSystemMessage`
- `messaging.conversations`
- `messaging.deleteMessage`
- `messaging.flagMessage`
- `messaging.markProjectRead`
- `messaging.patchMessage`
- `messaging.pinMessage`
- `messaging.projectMessages`
- `messaging.sendProjectMessage`
- `messaging.unpinMessage`

### apps/admin/src/features/messages/AdminThreadActionsPanel.tsx
- `messaging.archiveChatThread`
- `messaging.getChatThread`
- `messaging.unarchiveChatThread`

### apps/admin/src/features/messages/ConversationSearchSidebar.tsx
- `messaging.searchMessages`

### apps/admin/src/features/moderation/ModerationClient.tsx
- `admin.deleteFlaggedMessage`
- `admin.dismissFlaggedMessage`
- `admin.escalateFlaggedMessage`
- `admin.getFlaggedMessages`
- `admin.getModerationHistory`
- `admin.restoreFlaggedMessage`

### apps/admin/src/features/notifications/AdminNotificationsClient.tsx
- `admin.broadcastNotification`
- `admin.getAdminNotificationStats`
- `admin.getDeliveryReport`
- `admin.listAdminNotifications`
- `admin.listUsers`
- `admin.sendAdminNotification`
- `admin.sendSegmentNotification`
- `notifications.delete`
- `notifications.list`
- `notifications.markRead`
- `notifications.readAll`

### apps/admin/src/features/payments/AdminDisputesSection.tsx
- `admin.getDisputeDetails`
- `admin.listPaymentDisputes`
- `admin.respondDispute`

### apps/admin/src/features/payments/CompanyLegalProfilesClient.tsx
- `admin.createCompanyLegalProfile`
- `admin.deleteCompanyLegalProfile`
- `admin.listCompanyLegalProfiles`
- `admin.updateCompanyLegalProfile`

### apps/admin/src/features/payments/ManualPaymentModal.tsx
- `admin.createManualPayment`

### apps/admin/src/features/payments/PaymentDetailClient.tsx
- `admin.approveTransfer`
- `admin.getAdminPaymentDetail`
- `admin.getAdminPaymentTimeline`
- `admin.getAdminPaymentTransactions`
- `admin.rejectTransfer`
- `admin.verifyPayment`
- `mediaAdmin.downloadUrl`

### apps/admin/src/features/payments/PaymentRefundModal.tsx
- `admin.processPaymentRefund`

### apps/admin/src/features/payments/PaymentsClient.tsx
- `admin.approveTransfer`
- `admin.getAdminPaymentStats`
- `admin.getReconciliation`
- `admin.listAdminPayments`
- `admin.listPaymentMilestones`
- `admin.rejectTransfer`
- `admin.verifyPayment`

### apps/admin/src/features/payments/PlatformPaymentAccountsClient.tsx
- `admin.createPlatformPaymentAccount`
- `admin.deletePlatformPaymentAccount`
- `admin.listPlatformPaymentAccounts`
- `admin.updatePlatformPaymentAccount`

### apps/admin/src/features/payments/ProjectPaymentsClient.tsx
- `admin.completeMilestone`
- `admin.getAdminProject`
- `admin.listAdminPayments`
- `admin.listPaymentMilestones`
- `admin.requestMilestonePayment`
- `admin.verifyPayment`

### apps/admin/src/features/payments/TimeEntriesPanel.tsx
- `admin.createTimeEntry`
- `admin.listTimeEntries`

### apps/admin/src/features/pipeline/PipelineHubClient.tsx
- `admin.getAdminQuoteStats`
- `admin.getAdminRequestStats`
- `admin.getFlaggedMessages`
- `admin.getProjectStats`
- `admin.listAdminPayments`
- `admin.listContactMessages`
- `admin.listUsers`

### apps/admin/src/features/pipeline/PipelineProjectPickerClient.tsx
- `admin.listAdminProjects`

### apps/admin/src/features/pipeline/ProjectPipelineHubClient.tsx
- `admin.getAdminProgressTimeline`
- `admin.getAdminProject`
- `admin.listAdminPayments`
- `admin.listProjectDeliverables`

### apps/admin/src/features/pipeline/UserPipelineHubClient.tsx
- `admin.getFlaggedMessages`
- `admin.getUser`
- `admin.getUserActivity`
- `admin.getUserSessions`
- `admin.listAdminPayments`
- `admin.listAdminProjects`
- `admin.listAdminQuotes`
- `admin.listAdminRequests`

### apps/admin/src/features/portfolio/AdminPortfolioClient.tsx
- `admin.createPortfolioCategory`
- `admin.deleteAdminPortfolio`
- `admin.deletePortfolioCategory`
- `admin.getPortfolioAnalytics`
- `admin.listAdminPortfolio`
- `admin.listPortfolioCategories`
- `admin.publishAdminPortfolio`
- `admin.reorderAdminPortfolio`
- `admin.unpublishAdminPortfolio`

### apps/admin/src/features/portfolio/AdminPortfolioEditorClient.tsx
- `admin.createAdminPortfolio`
- `admin.getAdminPortfolio`
- `admin.listPortfolioCategories`
- `admin.patchAdminPortfolio`
- `admin.publishAdminPortfolio`

### apps/admin/src/features/portfolio/AdminPortfolioMediaPanel.tsx
- `admin.deleteAdminPortfolioMedia`
- `admin.listAdminPortfolioMedia`
- `admin.setAdminPortfolioFeaturedVideo`
- `admin.setAdminPortfolioThumbnail`
- `admin.uploadAdminPortfolioMedia`

### apps/admin/src/features/projects/AdminDuplicateProjectWizard.tsx
- `admin.createProjectFromTemplate`
- `admin.getProjectDuplicatePreview`

### apps/admin/src/features/projects/AdminProgressUpdateSection.tsx
- `admin.createAdminProgressEntry`
- `admin.deleteAdminProgressEntry`
- `admin.listAdminProgressEntries`
- `admin.updateAdminProgressEntry`

### apps/admin/src/features/projects/AdminProjectDeliveryPanel.tsx
- `admin.completeMilestone`
- `admin.createProjectMilestone`
- `admin.deleteDeliverable`
- `admin.updateDeliverable`
- `admin.uploadProjectDeliverable`

### apps/admin/src/features/projects/AdminProjectDetailClient.tsx
- `admin.archiveProject`
- `admin.exportProject`
- `admin.getAdminProject`
- `admin.getProjectAnalytics`
- `admin.getProjectProgressAnalytics`
- `admin.listProjectDeliverables`
- `admin.unarchiveProject`

### apps/admin/src/features/projects/AdminProjectOverviewPanel.tsx
- `admin.addProjectTeamMember`
- `admin.getAdminProject`
- `admin.getAdminProjectStatusHistory`
- `admin.markProjectComplete`
- `admin.removeProjectTeamMember`
- `admin.updateProjectStatus`

### apps/admin/src/features/projects/AdminProjectPortfolioBridge.tsx
- `admin.createPortfolioDraftFromProject`
- `admin.getProjectPortfolioLink`
- `admin.getProjectPortfolioPreview`

### apps/admin/src/features/projects/ProjectsClient.tsx
- `admin.archiveProject`
- `admin.getProjectStats`
- `admin.listAdminProjects`
- `admin.unarchiveProject`

### apps/admin/src/features/quotes/AdminEditQuoteForm.tsx
- `admin.getAdminQuote`
- `admin.patchAdminQuote`

### apps/admin/src/features/quotes/AdminQuoteTemplatesPanel.tsx
- `admin.createAdminQuoteTemplate`
- `admin.getAdminQuoteTemplates`

### apps/admin/src/features/quotes/LineItemLibraryPanel.tsx
- `admin.createLineItemBlock`
- `admin.deactivateLineItemBlock`
- `admin.listLineItemLibrary`

### apps/admin/src/features/quotes/PaymentScheduleSection.tsx
- `admin.listPaymentSchedulePresets`

### apps/admin/src/features/quotes/QuoteDetailClient.tsx
- `admin.duplicateAdminQuote`
- `admin.extendQuoteValidity`
- `admin.getAdminQuote`
- `admin.getAdminQuotePdf`
- `admin.resendQuote`
- `admin.sendAdminQuote`

### apps/admin/src/features/quotes/QuoteHistoryPanel.tsx
- `admin.getAdminQuoteHistory`

### apps/admin/src/features/quotes/QuotesClient.tsx
- `admin.getAdminQuoteStats`
- `admin.listAdminQuotes`

### apps/admin/src/features/requests/AdminCreateQuoteForm.tsx
- `admin.createQuoteFromRequest`
- `admin.suggestQuotePrefill`

### apps/admin/src/features/requests/CapacityDashboard.tsx
- `admin.getCapacityDashboard`
- `admin.updateCapacitySettings`

### apps/admin/src/features/requests/RequestDetailClient.tsx
- `admin.addAdminRequestNote`
- `admin.assignAdminRequest`
- `admin.deleteAdminRequest`
- `admin.getAdminRequest`
- `admin.listAdminRequestNotes`
- `admin.patchAdminRequest`
- `admin.sendAdminQuote`
- `admin.updateAdminRequestStatus`
- `requests.getAdminAttachmentDownloadUrl`

### apps/admin/src/features/requests/RequestQuoteBuilderClient.tsx
- `admin.getAdminRequest`

### apps/admin/src/features/requests/RequestQuoteEditClient.tsx
- `admin.getAdminRequest`
- `admin.sendAdminQuote`

### apps/admin/src/features/requests/RequestsClient.tsx
- `admin.getAdminRequestStats`
- `admin.listAdminRequests`

### apps/admin/src/features/system/SystemClient.tsx
- `admin.cancelSystemJob`
- `admin.clearSystemCache`
- `admin.clearSystemCacheKey`
- `admin.createNotificationTemplate`
- `admin.deleteNotificationTemplate`
- `admin.downloadSystemLogs`
- `admin.getEmailTemplates`
- `admin.getHealthDebug`
- `admin.getNotificationTemplates`
- `admin.getSystemConfig`
- `admin.getSystemFeatures`
- `admin.getSystemJobs`
- `admin.health`
- `admin.patchSystemFeature`
- `admin.previewEmailTemplate`
- `admin.retrySystemJob`
- `admin.sendSystemAnnouncement`
- `admin.sendTestEmail`
- `admin.toggleMaintenanceMode`
- `admin.updateEmailTemplate`
- `admin.updateNotificationTemplate`
- `admin.updateSystemConfig`

### apps/admin/src/features/users/UserDetailClient.tsx
- `admin.adminResetPassword`
- `admin.changeUserRole`
- `admin.changeUserStatus`
- `admin.deleteUser`
- `admin.exportUserData`
- `admin.forcePasswordReset`
- `admin.getUser`
- `admin.getUserActivity`
- `admin.getUserSessions`
- `admin.listAdminPayments`
- `admin.listAdminProjects`
- `admin.listAdminRequests`
- `admin.listUsers`
- `admin.restoreUser`
- `admin.startImpersonation`
- `admin.terminateAllUserSessions`
- `admin.terminateAnySession`
- `admin.updateUser`

### apps/admin/src/features/users/UsersListClient.tsx
- `admin.bulkUserOperations`
- `admin.getUserMetrics`
- `admin.getUsersSecurityStats`
- `admin.listUsers`
- `admin.searchUsers`

### apps/admin/src/features/auth/useAdminLogin.ts
- `auth.login`
- `users.getProfile`

### apps/admin/src/features/documents/hooks/useAdminDocumentsApi.ts
- `documents.listAdminPaymentVersions`
- `documents.listAdminQuoteVersions`

### apps/admin/src/features/exports/open-project-export-download.ts
- `admin.downloadProjectExport`

### apps/admin/src/features/media/hooks/useAdminMediaDetail.ts
- `mediaAdmin.createShare`
- `mediaAdmin.deleteMedia`
- `mediaAdmin.deleteQuarantined`
- `mediaAdmin.downloadUrl`
- `mediaAdmin.getById`
- `mediaAdmin.getReferences`
- `mediaAdmin.getShares`
- `mediaAdmin.patchMetadata`
- `mediaAdmin.releaseQuarantined`
- `mediaAdmin.reprocess`
- `mediaAdmin.revokeShare`
- `mediaAdmin.revokeShareById`

### apps/admin/src/features/media/hooks/useAdminMediaReplace.ts
- `mediaAdmin.replace`

## apps/landing/src

