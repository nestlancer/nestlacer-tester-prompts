# Frontend control/string inventory (regex-based)

This is not a runtime proof. It is a source-mined checklist for prompt completeness.

## `apps/admin/src/app/(dashboard)/AdminConsoleLayout.tsx`

- **prop:** Console
- **prop:** Sign out
- **prop:** Close navigation menu
- **prop:** Close menu
- **prop:** Open navigation menu
- **prop:** Console breadcrumb
- **prop:** Open command palette
- **text:** : null}
- **text:** void handleLogout()} title="Sign out" className= >
- **text:** Home
- **text:** Messages
- **text:** Panel
- **label:** Dashboard
- **label:** Pipelines
- **label:** Inquiries
- **label:** Notifications
- **label:** Requests
- **label:** Quotes
- **label:** Projects
- **label:** Payments
- **label:** Users
- **label:** Messages
- **label:** Moderation
- **label:** Analytics
- **label:** Blog
- **label:** Portfolio
- **label:** Media Library
- **label:** System Config
- **label:** Webhooks
- **label:** Audit Logs

## `apps/admin/src/app/(dashboard)/media/MediaPageClient.tsx`

- **prop:** Content
- **prop:** Media Library

## `apps/admin/src/app/(dashboard)/payments/disputes/page.tsx`

- **prop:** Breadcrumb
- **prop:** Operations
- **prop:** Payment disputes
- **text:** ← Back to payments

## `apps/admin/src/app/(dashboard)/projects/archive/page.tsx`

- **prop:** Archived projects

## `apps/admin/src/app/(dashboard)/projects/completed/page.tsx`

- **prop:** Completed projects

## `apps/admin/src/app/(dashboard)/projects/stats/page.tsx`

- **prop:** Project statistics

## `apps/admin/src/app/(dashboard)/quotes/drafts/page.tsx`

- **prop:** Draft quotes

## `apps/admin/src/app/(dashboard)/quotes/stats/page.tsx`

- **prop:** Quote statistics

## `apps/admin/src/app/error.tsx`

- **text:** reset()}> Retry
- **text:** Dashboard

## `apps/admin/src/app/not-found.tsx`

- **text:** Back to dashboard

## `apps/admin/src/components/admin/AdminConfirmDialog.tsx`

- **prop:** Reason for this action (audit log)
- **text:** finish( )}>

## `apps/admin/src/components/admin/AdminDataViews.tsx`

- **prop:** API payloads
- **prop:** Show raw API responses
- **text:** View

## `apps/admin/src/components/admin/AdminGentelellaUI.tsx`

- **prop:** Chart period
- **prop:** Quick settings
- **text:** onChange(opt)} >
- **text:** View all →

## `apps/admin/src/components/admin/AdminMessageLink.tsx`

- **text:** onOpen(conversation)} > ) : null}
- **text:** } className= > ) : null}
- **text:** Open message inbox

## `apps/admin/src/components/admin/AdminModerationLink.tsx`

- **text:** · ) : null} Open flagged message
- **text:** } className= > ) : null}
- **text:** Open moderation queue

## `apps/admin/src/components/admin/AdminNotificationLink.tsx`

- **text:** unread && onMarkRead(item.id)} >
- **text:** } className= > ) : null}
- **text:** markAllRead.mutate()} > Mark all read
- **text:** Open notification inbox

## `apps/admin/src/components/admin/AdminPageChrome.tsx`

- **prop:** Page sections
- **text:** onChange(i)} > ) : null}
- **text:** Previous
- **text:** = totalPages} onClick= > Next

## `apps/admin/src/components/admin/AdminTableViews.tsx`

- **text:** Search
- **text:** Clear
- **text:** View

## `apps/admin/src/components/admin/AdminThemeToggle.tsx`

- **text:** setTheme(isDark ? 'light' : 'dark')} className= title= aria-label= >

## `apps/admin/src/components/admin/AdminUserMenu.tsx`

- **text:** Operator profile
- **text:** Dashboard
- **text:** System settings
- **text:** void handleLogout()} > Sign out

## `apps/admin/src/components/admin/UserSearchCombobox.tsx`

- **text:** toggle(opt)} >
- **text:** } > ) : null}

## `apps/admin/src/components/command/AdminCommandPalette.tsx`

- **label:** Dashboard
- **label:** Pipelines
- **label:** Pipeline · User hub
- **label:** Pipeline · Project hub
- **label:** Inquiries
- **label:** Requests
- **label:** Quotes
- **label:** Projects
- **label:** Users
- **label:** Payments
- **label:** Settlement accounts
- **label:** Company legal identity
- **label:** Messages
- **label:** Moderation
- **label:** Analytics
- **label:** Blog
- **label:** Portfolio
- **label:** Media Library
- **label:** System Config
- **label:** Webhooks
- **label:** Audit Logs
- **label:** Create blog post
- **label:** New portfolio item
- **label:** Message client
- **label:** New group chat

## `apps/admin/src/features/analytics/AnalyticsClient.tsx`

- **prop:** Analytics
- **prop:** Analytics hub
- **prop:** Revenue
- **prop:** Completed payments for the selected period
- **prop:** Revenue by category
- **prop:** Users
- **prop:** Acquisition and role mix
- **prop:** Role breakdown
- **prop:** Projects
- **prop:** Lifecycle distribution and delivery health
- **prop:** Status breakdown
- **prop:** Requests
- **prop:** Inbound demand and quote conversion
- **prop:** Request volume
- **prop:** By status
- **prop:** By category
- **prop:** Quote conversion
- **text:** Download CSV
- **label:** Period trend
- **label:** Completed payments

## `apps/admin/src/features/audit/AuditClient.tsx`

- **prop:** System
- **prop:** Audit Logs
- **prop:** Auth audit logs
- **prop:** User admin logs
- **text:** Clear
- **label:** Action
- **label:** All actions
- **label:** Status
- **label:** All statuses
- **label:** Active
- **label:** Ended

## `apps/admin/src/features/auth/AdminGateHome.tsx`

- **prop:** Operations preview
- **text:** open auth →
- **text:** Authenticate to console

## `apps/admin/src/features/auth/AdminLoginForm.tsx`

- **prop:** you@company.com
- **prop:** Enter your password
- **text:** setShowPassword((v) => !v)} aria-pressed= aria-label= >

## `apps/admin/src/features/auth/AdminLoginShell.tsx`

- **prop:** Access policy
- **text:** ← gate
- **text:** ← Back to operator gate

## `apps/admin/src/features/auth/TwoFactorChallengeForm.tsx`

- **text:** setUseBackup((v) => !v)} >
- **text:** verify.mutate()} >

## `apps/admin/src/features/contact/ContactClient.tsx`

- **prop:** Inquiries
- **prop:** Search name, email, ticket…
- **prop:** Search inquiries
- **prop:** Status
- **prop:** Select an inquiry
- **prop:** Write a clear reply. This is emailed to the visitor…
- **text:** void q.refetch()} disabled= >
- **text:** setStatusFilter(f.id)} className= >
- **text:** selectInquiry(row)} className= >
- **text:** ); }} > Update status
- **text:** } > Mark spam
- **text:** ); }} > Archive
- **text:** = await confirm( ); if (!confirmed) return; deleteM.mutate(id); }} > Delete
- **text:** } > Reply
- **text:** `.slice(0, 200); respondM.mutate( ); }} className="gap-1.5" >
- **label:** All
- **label:** New
- **label:** Read
- **label:** Responded
- **label:** Spam
- **label:** Archived
- **label:** Inbox
- **label:** Open

## `apps/admin/src/features/content/AdminBlogPostEditorClient.tsx`

- **prop:** Settings
- **prop:** auto-generated-from-title
- **prop:** design, nextjs, tips
- **prop:** SEO & discovery
- **prop:** 155 characters that sell the click in Google
- **prop:** Writing stats
- **prop:** Blog
- **prop:** Desktop preview width
- **prop:** Mobile preview width
- **prop:** Post content
- **prop:** e.g. How we cut checkout drop-off
- **prop:** 1–2 sentences for cards and SEO
- **prop:** Write your post in Markdown…
- **text:** ← Back to blog
- **text:** Open live post
- **text:** publishM.mutate()} >
- **text:** (isEditing ? updateM.mutate() : createM.mutate())} >
- **text:** setEditorView(value)} >
- **text:** setPreviewDevice('desktop')} >
- **text:** setPreviewDevice('mobile')} >

## `apps/admin/src/features/content/BlogAnalyticsPanel.tsx`

- **label:** Period
- **label:** Last 7 days
- **label:** Last 30 days
- **label:** Last 90 days
- **label:** All time
- **label:** Total views
- **label:** Total likes
- **label:** Top-performing posts

## `apps/admin/src/features/content/BlogCommentsPanel.tsx`

- **text:** approve.mutate(id)} > Approve
- **text:** reject.mutate(id)} > Reject
- **text:** spam.mutate(id)}> Spam
- **text:** ); if (result.confirmed) remove.mutate(id); }} > Delete
- **label:** Status
- **label:** All statuses
- **label:** Pending
- **label:** Approved
- **label:** Rejected
- **label:** Spam

## `apps/admin/src/features/content/BlogPostActions.tsx`

- **text:** Edit
- **text:** View live

## `apps/admin/src/features/content/BlogTaxonomyPanel.tsx`

- **prop:** New category
- **prop:** New tag
- **text:** createCategory.mutate()} > Add
- **text:** createTag.mutate()} > Add
- **text:** ); if (result.confirmed) mergeTags.mutate(); }} > Merge tags
- **text:** ); if (result.confirmed) restoreRevision.mutate(revisionId); }} > Restore

## `apps/admin/src/features/content/ContentClient.tsx`

- **prop:** Content operations
- **prop:** Blog
- **text:** View live blog
- **text:** New post
- **label:** Posts
- **label:** Comments
- **label:** Pending
- **label:** Reported
- **label:** Analytics
- **label:** Taxonomy
- **label:** Total posts
- **label:** Published
- **label:** Drafts
- **label:** Pending comments

## `apps/admin/src/features/content/ContentPostsPanel.tsx`

- **prop:** Table view
- **prop:** Card view
- **text:** setViewMode('table')} >
- **text:** setViewMode('cards')} >
- **label:** Status
- **label:** All statuses
- **label:** Published
- **label:** Draft
- **label:** Scheduled
- **label:** Archived

## `apps/admin/src/features/dashboard/DashboardClient.tsx`

- **prop:** Operations
- **prop:** Command center
- **prop:** Needs attention
- **prop:** Revenue trajectory
- **prop:** Revenue over time
- **prop:** Project mix
- **prop:** Lifecycle share
- **prop:** Recent requests
- **prop:** Newest inbound work
- **prop:** Recent payments
- **prop:** Request volume over time
- **prop:** Inbound briefs · last 30 days · live
- **prop:** Moderation queues
- **prop:** Flagged + contact inbox
- **text:** Pipelines
- **text:** Analytics
- **text:** Inbox
- **text:** awaiting settlement` : ''}
- **label:** No data
- **label:** Flagged messages
- **label:** New contact mail
- **label:** Pending settlements
- **label:** Message center

## `apps/admin/src/features/documents/components/DocumentVersionsPanel.tsx`

- **prop:** No documents yet
- **text:** void action.onClick()} >
- **text:** Refresh
- **text:** if (row.downloadUrl) }} >

## `apps/admin/src/features/documents/components/LiveAdminPaymentDocumentsPanel.tsx`

- **prop:** Payment documents & versions
- **label:** Download latest invoice
- **label:** Download latest receipt

## `apps/admin/src/features/documents/components/LiveAdminQuoteDocumentsPanel.tsx`

- **prop:** Quote documents & versions
- **label:** Generate & download latest quote PDF
- **label:** Download signed service agreement

## `apps/admin/src/features/integrations/IntegrationsClient.tsx`

- **prop:** https://hooks.yourapp.com/nestlancer
- **prop:** request.created, quote.accepted
- **prop:** System
- **prop:** Webhooks
- **prop:** Integration health
- **prop:** Delivery preferences
- **prop:** Retry failed deliveries
- **prop:** Require signing secret
- **prop:** Event catalog
- **prop:** Configured webhooks
- **prop:** Project updates
- **prop:** https://example.com/hook
- **text:** id && updateM.mutate(id)} > Save
- **text:** setEditingId(null)}> Cancel
- **text:** } > Edit
- **text:** setDeliveriesWebhookId(id)}> Deliveries
- **text:** testM.mutate(id)} > Test
- **text:** enableM.mutate(id)} > Enable
- **text:** = await confirm( ); if (!confirmed) return; deleteM.mutate(id); }} > Delete
- **text:** setShowCreateForm((v) => !v)}>
- **text:** createM.mutate()} >
- **text:** } > Clear
- **label:** Status
- **label:** All statuses
- **dialog:** Webhook deliveries

## `apps/admin/src/features/media/AdminMediaAllFilesClient.tsx`

- **prop:** Search files…
- **prop:** Select all
- **text:** Clear filter
- **text:** uploadRef.current?.click()} >
- **text:** void handleBulkDelete()} > Delete selected ( )
- **text:** setPage((p) => p - 1)} > Previous
- **text:** = totalPages} onClick= > Next
- **text:** Details
- **label:** Newest first
- **label:** Oldest first
- **label:** Largest first
- **label:** Name A–Z

## `apps/admin/src/features/media/AdminMediaAnalyticsClient.tsx`

- **prop:** Uploads per day
- **prop:** Storage maintenance
- **text:** cleanupPreviewM.mutate()} >
- **label:** Total files
- **label:** Storage used
- **label:** Quarantined
- **label:** Processing

## `apps/admin/src/features/media/AdminMediaCreateShareDialog.tsx`

- **prop:** e.g. Client preview for milestone 2 — expires after review
- **prop:** Enter a password, or leave blank
- **text:** handleClose(false)} > Cancel
- **text:** void handleCreate()} >
- **text:** handleClose(false)}> Done
- **text:** catch }} > Copy link
- **label:** 24 hours
- **label:** 7 days
- **label:** 30 days
- **label:** 90 days
- **dialog:** Create share link

## `apps/admin/src/features/media/AdminMediaDetailDrawer.tsx`

- **prop:** Close
- **prop:** invoice-april.pdf
- **prop:** April invoice (client copy)
- **prop:** Receipt for milestone 2
- **text:** setEditOpen((v) => !v)}>
- **text:** Save metadata
- **text:** View user
- **text:** setShareOpen(true)} > Create link
- **text:** revokeShare.mutate()} > Revoke all
- **text:** catch }} > Copy
- **text:** revokeShareById.mutate(share.id)} > Revoke
- **text:** download.mutate()} > Download
- **text:** setReplaceOpen(true)}> Replace
- **text:** reprocess.mutate()} > Reprocess
- **text:** release.mutate()} > Release
- **text:** void handleDelete()}> Delete

## `apps/admin/src/features/media/AdminMediaQuarantineClient.tsx`

- **text:** setPage((p) => p - 1)} > Previous
- **text:** = totalPages} onClick= > Next
- **text:** · …` : ''} ) : null} ) : null} ) : null}
- **text:** Details
- **text:** Release
- **text:** Reprocess
- **text:** Delete

## `apps/admin/src/features/media/AdminMediaReferencesList.tsx`

- **text:** Open

## `apps/admin/src/features/media/AdminMediaReplaceDialog.tsx`

- **text:** inputRef.current?.click()} > Choose file
- **text:** handleClose(false)} > Cancel
- **text:** void handleReplace()} >
- **dialog:** Replace file

## `apps/admin/src/features/media/AdminMediaStorageBrowser.tsx`

- **prop:** Search name or email…
- **prop:** Search user storage accounts
- **prop:** Breadcrumb
- **prop:** Upload file
- **prop:** File type
- **prop:** Source
- **prop:** Search filename, mime, or ID…
- **prop:** Search files
- **prop:** Filter by status
- **prop:** Sort files
- **prop:** Grid view
- **prop:** List view
- **prop:** Select all on page
- **prop:** Media files
- **prop:** Select all
- **text:** uploadRef.current?.click()}>
- **text:** } className= >
- **text:** ); setForceFileView(true); }} className= >
- **text:** setViewMode('grid')} >
- **text:** setViewMode('list')} >
- **text:** } > View all files
- **text:** void handleBulkDelete()} > Delete
- **text:** setSelectedIds(new Set())}> Clear
- **text:** setPage((p) => p - 1)} > Previous
- **text:** = totalPages} onClick= > Next
- **text:** openDrawer(row.id)} >
- **text:** openDrawer(row.id)}> Details
- **text:** e.stopPropagation()} > Open
- **text:** downloadUserDocM.mutate(doc.id)} > Download
- **text:** ) : null}
- **label:** All sources
- **label:** Message attachments
- **label:** Projects
- **label:** Deliveries
- **label:** Uploads only
- **label:** Folders
- **label:** Newest
- **label:** Oldest
- **label:** Largest
- **label:** Name A–Z
- **label:** Storage

## `apps/admin/src/features/messages/AdminChatDock.tsx`

- **prop:** Active conversations

## `apps/admin/src/features/messages/AdminChatThreadClient.tsx`

- **prop:** Could not load messages
- **prop:** Messages
- **prop:** Reply as operator…
- **prop:** Edit your message
- **text:** Panel
- **text:** setShowGroupInfo((open) => !open)} >
- **text:** patchMessageM.mutate()} > Save
- **text:** } > Cancel

## `apps/admin/src/features/messages/AdminConversationQueue.tsx`

- **prop:** Search by name, preview, or ID…
- **prop:** Search conversations
- **prop:** Filter by type
- **text:** props.onKindFilterChange(chip.value); }} >
- **label:** All
- **label:** Unread
- **label:** Direct
- **label:** Project
- **label:** Group
- **label:** Active
- **label:** Archived
- **label:** Latest
- **label:** Unread first
- **label:** Longest wait

## `apps/admin/src/features/messages/AdminDockChatWindow.tsx`

- **prop:** Quick replies
- **prop:** Reply as operator…
- **text:** setQuickOpen((open) => !open)} >

## `apps/admin/src/features/messages/AdminGroupMembersPanel.tsx`

- **prop:** Search clients to add…
- **text:** unarchive.mutate()} > Restore group
- **text:** archive.mutate()} > Archive group
- **text:** addMembers.mutate()} > Add to group
- **text:** handleRemoveMember(member)} > Remove

## `apps/admin/src/features/messages/AdminMessageFileAttachment.tsx`

- **text:** downloadM.mutate(payload.mediaId)} > ) : null}

## `apps/admin/src/features/messages/AdminMessagesContextRail.tsx`

- **text:** Open client profile
- **text:** Open project

## `apps/admin/src/features/messages/AdminMessagesOverviewClient.tsx`

- **prop:** Operations
- **prop:** Messages
- **prop:** No conversations yet
- **prop:** Unread
- **text:** Message client
- **text:** New group
- **text:** Open messaging panel
- **label:** Open conversations
- **label:** Unread messages
- **label:** Unread threads

## `apps/admin/src/features/messages/AdminMessagesPanelClient.tsx`

- **prop:** Messaging panel
- **prop:** Select a conversation
- **text:** Overview
- **text:** Message client
- **text:** New group

## `apps/admin/src/features/messages/AdminNewDirectClient.tsx`

- **prop:** Operations
- **prop:** Message client
- **prop:** Search clients by name or email…
- **text:** Back to messages
- **text:** Cancel

## `apps/admin/src/features/messages/AdminNewGroupChatClient.tsx`

- **prop:** Operations
- **prop:** New group chat
- **prop:** e.g. Launch war room
- **prop:** Add clients to group…
- **text:** Back to messages
- **text:** Cancel
- **text:** create.mutate()} >

## `apps/admin/src/features/messages/AdminProjectThreadClient.tsx`

- **prop:** Could not load messages
- **prop:** Messages
- **prop:** Site visit confirmed Thursday 2pm
- **prop:** System broadcast message
- **prop:** Reply as operator…
- **prop:** Edit your message
- **text:** Panel
- **text:** = await confirm( ); if (!confirmed) return; broadcastM.mutate(); }} > Send
- **text:** patchMessageM.mutate()} > Save
- **text:** setEditingMessageId(null)} > Cancel

## `apps/admin/src/features/messages/AdminThreadActionsPanel.tsx`

- **text:** unarchive.mutate()} > Restore
- **text:** archive.mutate()} > Archive

## `apps/admin/src/features/moderation/ModerationClient.tsx`

- **prop:** Operations
- **prop:** Moderation
- **prop:** Edited message text (optional)
- **text:** setTab('queue')} > Active queue
- **text:** setTab('history')} > History
- **text:** } > Clear
- **text:** Open profile
- **text:** Open chat
- **text:** Sender
- **text:** Project
- **text:** id && dismissM.mutate(id)} > Dismiss
- **text:** id && escalateM.mutate(id)} >
- **text:** = await confirm( ); if (!confirmed) return; deleteM.mutate(id); }} > Delete
- **text:** messageId && restoreM.mutate( ) } > Restore to chat
- **text:** } > Cancel
- **text:** } > Restore / edit & restore
- **label:** Queue
- **label:** Escalated
- **label:** Project chats
- **label:** Review status
- **label:** All statuses
- **label:** Flagged
- **label:** Chat type
- **label:** All chats
- **label:** Project
- **label:** Direct
- **label:** Group
- **label:** Action
- **label:** All actions
- **label:** Removed
- **label:** Dismissed
- **label:** Restored

## `apps/admin/src/features/notifications/AdminNotificationsClient.tsx`

- **prop:** Mark as read
- **prop:** Delete notification
- **prop:** Send to user
- **prop:** Search by name or email…
- **prop:** Clear recipient
- **prop:** e.g. Quote ready for review
- **prop:** Short message shown in the user's notification inbox.
- **prop:** Broadcast to all users
- **prop:** e.g. Scheduled maintenance tonight
- **prop:** Short message shown in every user’s inbox.
- **prop:** Send to segment
- **prop:** Delivery report
- **prop:** Full notification UUID
- **prop:** No delivery rows
- **prop:** Platform log
- **prop:** My notifications
- **prop:** Notification categories
- **prop:** Operations
- **prop:** Notifications
- **text:** unread && onMarkRead(item.id)} >
- **text:** unread && onMarkRead(item.id)}>
- **text:** onMarkRead(item.id)} >
- **text:** onDelete(item.id)} >
- **text:** View user profile
- **text:** setRecipient(null)} >
- **text:** send.mutate()} >
- **text:** broadcast.mutate()} >
- **text:** segmentSend.mutate()} > `}
- **text:** Load report
- **text:** setPage((p) => Math.max(1, p - 1))} > Previous
- **text:** = pagination.totalPages || logQ.isLoading} onClick= > Next
- **text:** setScope(tab.value)} >
- **text:** markAllRead.mutate()} > Mark all read
- **text:** void refetch()}> Retry
- **label:** All active users
- **label:** Clients only
- **label:** Admins only
- **label:** All types
- **label:** Info
- **label:** Success
- **label:** Warning
- **label:** Error
- **label:** Audience
- **label:** All recipients
- **label:** Type
- **label:** Read state
- **label:** All
- **label:** Unread only
- **label:** Sort
- **label:** Newest first
- **label:** Oldest first
- **label:** Unread
- **label:** Today
- **label:** Yesterday
- **label:** This week
- **label:** Earlier

## `apps/admin/src/features/payments/AdminDisputesSection.tsx`

- **prop:** Explain resolution steps…
- **text:** Close
- **text:** respond.mutate()} >
- **text:** setSelectedId(id)}> View & respond
- **dialog:** Dispute details

## `apps/admin/src/features/payments/CompanyLegalProfilesClient.tsx`

- **prop:** Payments
- **prop:** Company legal identity
- **prop:** Primary profile is used on all generated tax documents
- **prop:** Full registered office address
- **prop:** Profiles
- **text:** ← Payments hub
- **text:** saveM.mutate()} >
- **text:** } > Cancel edit
- **text:** startEdit(p)}> Edit
- **text:** ”? It will no longer appear on new PDFs.` ) ) removeM.mutate(p.id); }} > Remove
- **label:** Primary legal entity

## `apps/admin/src/features/payments/ManualPaymentModal.tsx`

- **prop:** e.g. NEFT UTR 123456789012
- **text:** onOpenChange(false)}> Cancel
- **text:** createM.mutate()}>
- **dialog:** Record manual payment

## `apps/admin/src/features/payments/PaymentDetailClient.tsx`

- **prop:** Breadcrumb
- **prop:** Operations
- **prop:** Reject offline transfer
- **prop:** Client will be notified
- **prop:** e.g. UTR does not match the amount
- **prop:** Payment summary
- **prop:** Client, project, and milestone context
- **prop:** Documents
- **prop:** Invoice, receipt, and versions
- **prop:** Payment timeline
- **prop:** Audit events for this transaction
- **prop:** Transaction history
- **prop:** Captures and refunds
- **text:** ← Back to payments
- **text:** approveTransferM.mutate()} >
- **text:** setShowReject((v) => !v)}> Reject transfer
- **text:** verifyM.mutate()}>
- **text:** setRefundOpen(true)}> Refund
- **text:** rejectTransferM.mutate()} >
- **text:** catch (e) }} > Open proof …
- **label:** Amount
- **label:** Method
- **label:** Paid at
- **label:** Transactions

## `apps/admin/src/features/payments/PaymentRefundModal.tsx`

- **prop:** Customer requested refund…
- **text:** Cancel
- **text:** refundM.mutate()} >
- **dialog:** Process refund

## `apps/admin/src/features/payments/PaymentsClient.tsx`

- **prop:** Operations
- **prop:** Payments
- **prop:** e.g. UTR does not match the amount
- **prop:** No reconciliation data
- **text:** Manage →
- **text:** View →
- **text:** approveTransfer.mutate(pid)} > Approve
- **text:** } > Reject
- **text:** verifyPayment.mutate(pid)} > Verify
- **text:** setRefundTarget(row)} > Refund
- **text:** Settlement accounts
- **text:** Company legal identity
- **text:** } > Cancel
- **label:** By project
- **label:** All transactions
- **label:** Awaiting verification
- **label:** Disputes
- **label:** Reconciliation
- **label:** Status
- **label:** All statuses

## `apps/admin/src/features/payments/PlatformPaymentAccountsClient.tsx`

- **prop:** Payments
- **prop:** Settlement accounts
- **prop:** Primary account appears on invoices; all active accounts are offered at checkout
- **prop:** e.g. HDFC current — Nestlancer
- **prop:** Account holder name
- **prop:** e.g. HDFC Bank
- **prop:** Bank account number
- **prop:** HDFC0001234
- **prop:** studio@okicici
- **prop:** Transfer INR and upload the UTR on checkout
- **prop:** Accounts
- **text:** ← Payments hub
- **text:** saveM.mutate()} >
- **text:** } > Cancel edit
- **text:** startEdit(a)}> Edit
- **text:** disableM.mutate(a.id)} > Disable

## `apps/admin/src/features/payments/ProjectPaymentsClient.tsx`

- **prop:** Operations
- **text:** Payments
- **text:** Record manual payment
- **text:** ← All projects
- **text:** Project detail
- **text:** Pipeline hub
- **text:** a.action === 'submitForApproval' )?.enabled } title= onClick= >
- **text:** a.action === 'requestPayment' )?.enabled } title= onClick= >
- **text:** verifyPayment.mutate(latestPaymentId)} >
- **label:** Installments paid
- **label:** Outstanding
- **label:** Awaiting client

## `apps/admin/src/features/payments/TimeEntriesPanel.tsx`

- **prop:** e.g. 2.5
- **prop:** Hours
- **prop:** Worked at
- **prop:** Milestone ID (optional)
- **prop:** Milestone ID
- **prop:** What was worked on…
- **text:** setOpen((v) => !v)}>
- **text:** createM.mutate()} >

## `apps/admin/src/features/pipeline/PipelineHubClient.tsx`

- **prop:** Admin API reference
- **prop:** Operations
- **prop:** Pipelines
- **prop:** Standalone consoles
- **prop:** Independent tools — not sequential pipeline stages
- **text:** ) : null} Open →
- **text:** User hub
- **text:** Project hub

## `apps/admin/src/features/pipeline/PipelineHubTabs.tsx`

- **prop:** Pipeline views
- **label:** Stage pipeline
- **label:** User hub
- **label:** Project hub

## `apps/admin/src/features/pipeline/PipelineProjectPickerClient.tsx`

- **prop:** Operations · Project pipeline
- **prop:** Project hub
- **prop:** Select project
- **prop:** Search by title or id
- **prop:** Search projects…

## `apps/admin/src/features/pipeline/PipelineUserPickerClient.tsx`

- **prop:** Operations · User pipeline
- **prop:** User hub
- **prop:** Select user
- **prop:** Search by name or email
- **prop:** Search users…

## `apps/admin/src/features/pipeline/PipelineUserStageStrip.tsx`

- **text:** ) : null} Open →

## `apps/admin/src/features/pipeline/ProjectPipelineHubClient.tsx`

- **prop:** Operations · Project pipeline
- **prop:** Project hub
- **prop:** Milestone loop (E2E steps 11–17)
- **prop:** Repeat 11→16 until all milestones paid; then mark project COMPLETED
- **prop:** Milestones
- **prop:** From project record
- **prop:** Payments
- **prop:** Request & quote
- **prop:** Commercial origin
- **prop:** Deliverables
- **prop:** Progress timeline
- **prop:** Admin progress API
- **prop:** Quick actions
- **text:** Project detail →
- **text:** User hub
- **text:** Stage pipeline
- **label:** Progress
- **label:** Milestones
- **label:** Deliverables
- **label:** Payments
- **label:** Timeline events
- **label:** Status
- **label:** Add milestones
- **label:** Upload deliverable
- **label:** Approve deliverable
- **label:** Approve milestone
- **label:** Payment intent
- **label:** Confirm payment

## `apps/admin/src/features/pipeline/UserPipelineHubClient.tsx`

- **prop:** Operations · User pipeline
- **prop:** User hub
- **prop:** Stages for this user only — counts from filtered lists
- **prop:** Status parameters and records
- **prop:** Operator tasks
- **prop:** Cross-category signals
- **prop:** Recent activity
- **prop:** User activity log
- **prop:** Requests
- **prop:** Quotes
- **prop:** Projects
- **prop:** Use project hub for milestone loop and timeline
- **text:** User admin →
- **text:** Project hub
- **text:** Stage pipeline

## `apps/admin/src/features/portfolio/AdminPortfolioClient.tsx`

- **prop:** Content
- **prop:** Portfolio
- **prop:** New category name
- **prop:** Search portfolio…
- **prop:** Search portfolio
- **prop:** Move up
- **prop:** Move down
- **text:** View public page
- **text:** New item
- **text:** createCategoryM.mutate()} > Add category
- **text:** setAnalyticsItemId(null)}> Close
- **text:** moveItem(i, -1)} aria-label="Move up" > ↑
- **text:** moveItem(i, 1)} aria-label="Move down" > ↓
- **text:** setAnalyticsItemId(id)} > Analytics
- **text:** Edit
- **text:** unpublishM.mutate(id)} > Unpublish
- **text:** publishM.mutate(id)} > Publish
- **text:** setPage((p) => p - 1)} > Previous
- **text:** = totalPages} onClick= > Next
- **label:** On this page
- **label:** Published
- **label:** Draft
- **label:** Featured

## `apps/admin/src/features/portfolio/AdminPortfolioEditorClient.tsx`

- **prop:** Content
- **prop:** e.g. D2C store rebuild
- **prop:** auto-generated if empty
- **prop:** One-line case-study summary
- **prop:** Write the case study in Markdown…
- **prop:** shopify, d2c, checkout
- **prop:** Brand name or Confidential client
- **prop:** e.g. D2C fashion
- **prop:** https://
- **prop:** What did the client say about the project outcome?
- **prop:** Reviewer name
- **prop:** Founder, D2C brand
- **prop:** e.g. 8 weeks
- **prop:** Next.js, Razorpay, Shopify
- **prop:** https://github.com/…
- **prop:** SEO title for search results
- **prop:** 155 characters that sell the click
- **text:** ← Back to portfolio
- **text:** publishM.mutate()} >

## `apps/admin/src/features/portfolio/AdminPortfolioMediaPanel.tsx`

- **text:** inputRef.current?.click()} >
- **text:** thumbM.mutate(row.mediaId)} > Use as thumbnail
- **text:** videoM.mutate(row.mediaId)} > Use as featured video
- **text:** deleteM.mutate(row.mediaId)} > Remove

## `apps/admin/src/features/profile/OperatorProfileClient.tsx`

- **prop:** Account
- **prop:** Operator profile
- **text:** Dashboard
- **text:** System configuration
- **text:** Audit logs

## `apps/admin/src/features/projects/AdminDuplicateProjectWizard.tsx`

- **prop:** Search clients by name or email…
- **prop:** Admin user UUID (defaults to you)
- **prop:** e.g. Redesign marketing site
- **prop:** Goals, constraints, and what success looks like…
- **prop:** webDevelopment
- **prop:** e.g. Marketing site — fixed price
- **prop:** What the client receives in this phase…
- **prop:** 50000
- **prop:** 18
- **prop:** e.g. Two revision rounds per milestone
- **prop:** Milestone name
- **prop:** Amount
- **text:** patchForm( )} > Add row
- **text:** patchForm( ) } >
- **text:** patchForm( , ], }) } > Add milestone
- **text:** patchForm( ) } > Remove milestone
- **text:** Back
- **text:** onOpenChange(false)}> Cancel
- **text:** Next
- **dialog:** Use project as template

## `apps/admin/src/features/projects/AdminProgressUpdateSection.tsx`

- **prop:** Daily progress
- **prop:** e.g. Homepage wireframes in review
- **text:** openCreateDialog()}> Post today&apos;s update
- **text:** openCreateDialog( )} > Use daily template
- **text:** openCreateDialog( )}> Post internal note
- **text:** openEditDialog(r)}> Edit
- **text:** Cancel
- **text:** saveEntryM.mutate()} >

## `apps/admin/src/features/projects/AdminProjectAnalyticsPanel.tsx`

- **prop:** Project metrics
- **prop:** Progress analytics
- **prop:** Activity breakdown
- **label:** Total updates
- **label:** Progress
- **label:** Budget spent
- **label:** Project analytics

## `apps/admin/src/features/projects/AdminProjectDeliveryPanel.tsx`

- **prop:** Milestone timeline
- **prop:** Deliverables
- **prop:** Reason (optional)
- **prop:** e.g. Kickoff / Design / Launch
- **prop:** 5000
- **prop:** Or paste media UUIDs (comma-separated)
- **prop:** Description (optional)
- **text:** setMilestoneDialogOpen(true)}> Add milestone
- **text:** completeMilestoneM.mutate(String(m.id))} > Submit for approval
- **text:** Upload deliverable
- **text:** updateDeliverableM.mutate( ) } > Approve
- **text:** } > Reject
- **text:** , , } ); }} > Confirm reject
- **text:** setRejectDeliverableId(null)} > Cancel
- **text:** setMilestoneDialogOpen(false)}> Cancel
- **text:** createMilestoneM.mutate()} >
- **text:** setDeliverableDialogOpen(false)}> Cancel
- **text:** uploadDeliverableM.mutate()} >
- **dialog:** Add milestone
- **dialog:** Upload deliverable

## `apps/admin/src/features/projects/AdminProjectDetailClient.tsx`

- **prop:** Operations
- **prop:** Project not found
- **text:** ← Back to projects
- **text:** unarchiveM.mutate()} >
- **text:** = await confirm( ); if (!confirmed) return; archiveM.mutate(); }} >
- **text:** setTemplateOpen(true)} > Use as template
- **text:** exportM.mutate()} > Export

## `apps/admin/src/features/projects/AdminProjectDetailTabBar.tsx`

- **prop:** Project sections
- **text:** e.preventDefault(); router.push(href); }} className= >

## `apps/admin/src/features/projects/AdminProjectOverviewPanel.tsx`

- **prop:** Project details
- **prop:** Client
- **prop:** Project status
- **prop:** Operator assignment
- **prop:** Why this change?
- **prop:** Search admin by name or email…
- **text:** Update status
- **text:** Change operator
- **text:** Assign operator
- **text:** setStatusDialogOpen(false)}> Cancel
- **text:** statusM.mutate()}>
- **text:** setOperatorDialogOpen(false)}> Cancel
- **text:** addTeamM.mutate()} >
- **dialog:** Update project status

## `apps/admin/src/features/projects/AdminProjectPortfolioBridge.tsx`

- **prop:** Public showcase
- **text:** Edit portfolio
- **text:** View public
- **text:** setWizardOpen(true)}> Create portfolio draft
- **text:** setWizardOpen(false)}> Cancel
- **text:** 0 || previewQ.isPending} onClick= >
- **dialog:** Create portfolio draft

## `apps/admin/src/features/projects/ProjectsClient.tsx`

- **prop:** Operations
- **text:** View →
- **text:** unarchiveM.mutate(id)} > Unarchive
- **text:** archiveM.mutate(id)} > Archive
- **text:** setTemplateProjectId(id)}> Use as template
- **text:** } > Clear
- **label:** Status
- **label:** All statuses

## `apps/admin/src/features/quotes/AdminEditQuoteForm.tsx`

- **prop:** Quote editor steps
- **prop:** 18
- **prop:** Team-only context, discount approvals, delivery risks…
- **text:** setActiveTab(tab.id)} > .
- **text:** setActiveTab(QUOTE_FORM_TABS[stepIndex - 1]!.id)} > Back
- **text:** setActiveTab(QUOTE_FORM_TABS[stepIndex + 1]!.id)} > Next

## `apps/admin/src/features/quotes/AdminQuoteTemplatesPanel.tsx`

- **prop:** e.g. MVP build
- **prop:** Default scope and terms…
- **text:** setShowCreate((v) => !v)}>
- **text:** createM.mutate()} >

## `apps/admin/src/features/quotes/LineItemLibraryPanel.tsx`

- **prop:** e.g. Custom API Integration
- **prop:** Shown as the quote line description…
- **prop:** 50000
- **text:** onInsert( ) } > Insert
- **text:** deactivateM.mutate(id)} > Deactivate
- **text:** setIncludeInactive((v) => !v)}>
- **text:** setShowCreate((v) => !v)}>
- **text:** createM.mutate()} >

## `apps/admin/src/features/quotes/PaymentScheduleSection.tsx`

- **prop:** e.g. Kickoff deposit
- **prop:** 40
- **text:** onChange( )} > Preset
- **text:** onChange( )} > Custom %
- **text:** onChange( )} className= >
- **text:** onChange( ) } > Remove
- **label:** 50% deposit / 50% on completion
- **label:** Deposit
- **label:** Final payment
- **label:** 30% deposit / 70% on completion
- **label:** 30% / 40% / 30% phased
- **label:** Mid-project payment
- **label:** 25% × 4 milestones
- **label:** Milestone 2
- **label:** Milestone 3
- **label:** 100% upfront
- **label:** Full payment

## `apps/admin/src/features/quotes/QuoteDetailClient.tsx`

- **prop:** Operations
- **prop:** Quote not found
- **text:** ← All quotes
- **text:** View source request →
- **text:** Open quote editor with client brief →
- **text:** pdfM.mutate()} >
- **text:** resendM.mutate()} >
- **text:** duplicateM.mutate()} >
- **text:** extendM.mutate()} >

## `apps/admin/src/features/quotes/QuoteHistoryPanel.tsx`

- **text:** setOpen((v) => !v)}>

## `apps/admin/src/features/quotes/QuoteLineItemsEditor.tsx`

- **prop:** Paste a quote ID to copy its line items
- **prop:** Duplicate phase
- **prop:** Actions
- **prop:** What the client receives in this phase…
- **prop:** 50000
- **prop:** Move up
- **prop:** Remove row
- **prop:** Move down
- **text:** setShowLibrary((v) => !v)} >
- **text:** onChange([...groups, newGroup(`Phase $ `)])} > Add phase
- **text:** setActiveGroupId(group.id)} >
- **text:** addItem(group.id)} > Row
- **text:** duplicatePhase(group)} > Duplicate phase
- **text:** onChange(groups.filter((g) => g.id !== group.id))} >
- **text:** patchGroup(group.id, )} aria-expanded= >
- **text:** patchGroup(group.id, ) } > ↑
- **text:** removeItem(group.id, itemIndex)} >
- **text:** patchGroup(group.id, ) } > ↓
- **text:** addItem(group.id)} > + Add line to `}

## `apps/admin/src/features/quotes/QuoteSummaryPanel.tsx`

- **prop:** Quote builder steps
- **label:** Scope & line items
- **label:** Pricing & schedule
- **label:** Terms & review

## `apps/admin/src/features/quotes/QuotesClient.tsx`

- **prop:** Operations
- **text:** } > Clear
- **text:** } > View all statuses
- **label:** Status

## `apps/admin/src/features/requests/AdminCreateQuoteForm.tsx`

- **prop:** Quote builder steps
- **prop:** 18
- **prop:** Team-only context, discount approvals, delivery risks…
- **text:** setActiveTab(tab.id)} > .
- **text:** setActiveTab(QUOTE_FORM_TABS[stepIndex - 1]!.id)} > Back
- **text:** setActiveTab(QUOTE_FORM_TABS[stepIndex + 1]!.id)} > Next
- **text:** ` : 'Create quote'}
- **label:** Discovery
- **label:** Build
- **label:** Launch
- **label:** Development
- **label:** Release
- **label:** Phase 1 — Setup
- **label:** Phase 2 — Delivery
- **label:** Phase 3 — Wrap-up

## `apps/admin/src/features/requests/CapacityDashboard.tsx`

- **text:** saveM.mutate()} >
- **label:** Active projects
- **label:** Queued requests
- **label:** Capacity used
- **label:** Max active

## `apps/admin/src/features/requests/RequestBriefSidebar.tsx`

- **text:** setExpanded((v) => !v)} >

## `apps/admin/src/features/requests/RequestDetailClient.tsx`

- **prop:** Breadcrumb
- **prop:** Operations
- **prop:** Edit request
- **prop:** e.g. Redesign marketing site
- **prop:** Goals, constraints, and what success looks like…
- **prop:** Actions
- **prop:** Status, assignment, and operator workflow
- **prop:** Change status…
- **prop:** Select assignee…
- **prop:** Client
- **prop:** Project brief
- **prop:** Requirements
- **prop:** Technical preferences
- **prop:** Attachments
- **prop:** Status history
- **prop:** Internal notes
- **prop:** Team-only note, not visible to the client…
- **text:** ← Back to requests
- **text:** Open quote editor
- **text:** Open quote builder
- **text:** = await confirm( ); if (!confirmed) return; deleteM.mutate(); }} > Delete
- **text:** patchM.mutate()} >
- **text:** newStatus && changeStatusM.mutate(newStatus)} >
- **text:** assignM.mutate()} >
- **text:** downloadAttachmentM.mutate(aid)} >
- **text:** addNoteM.mutate()} >
- **text:** View quote (read-only) →
- **label:** Draft
- **label:** Submitted
- **label:** Under review
- **label:** Quoted
- **label:** Accepted
- **label:** Rejected
- **label:** Converted to project
- **label:** Changes requested
- **label:** Cancelled
- **label:** Expired quote

## `apps/admin/src/features/requests/RequestQuoteBuilderClient.tsx`

- **prop:** Quote builder
- **text:** Back to request

## `apps/admin/src/features/requests/RequestQuoteEditClient.tsx`

- **prop:** Quote editor
- **text:** Back to request

## `apps/admin/src/features/requests/RequestsClient.tsx`

- **prop:** Operations
- **prop:** Requests
- **text:** catch }} > Copy
- **text:** Review →
- **text:** } > Clear
- **label:** Status

## `apps/admin/src/features/system/SystemClient.tsx`

- **prop:** System
- **prop:** System Configuration
- **prop:** Diagnostics
- **prop:** Cache management
- **prop:** Exact cache key
- **prop:** System logs
- **prop:** Platform configuration
- **prop:** Search keys or labels…
- **prop:** No configuration keys
- **prop:** Feature flags
- **prop:** Search by name, description, or id…
- **prop:** No feature flags
- **prop:** No jobs
- **prop:** No email templates
- **prop:** Template name
- **prop:** Event type (e.g. account.deleted)
- **prop:** Title template
- **prop:** Message template
- **prop:** Channels JSON e.g. ["IN_APP","EMAIL"]
- **prop:** No notification templates
- **prop:** Subject
- **prop:** Body (HTML or plain text)
- **prop:** Email template preview
- **prop:** you@company.com
- **prop:** Name
- **prop:** Event type
- **prop:** Platform announcements
- **prop:** Announcement title
- **prop:** Message body (max 1000 characters)
- **prop:** Maintenance mode
- **prop:** System is under maintenance. Please check back later.
- **text:** setShowHealthDebug((v) => !v)} >
- **text:** = await confirm( ); if (!confirmed) return; clearCacheM.mutate(); }} >
- **text:** clearCacheKeyM.mutate(cacheKey.trim())} > Clear key
- **text:** downloadLogsM.mutate()} >
- **text:** setConfigEdits( )} disabled= > Discard
- **text:** updateConfigM.mutate(configEdits)} >
- **text:** setActiveTab('operations')} > Operations
- **text:** retryJobM.mutate(id)} > Retry
- **text:** = await confirm( ); if (!confirmed) return; cancelJobM.mutate(id); }} > Cancel
- **text:** setTemplatePane(pane.id)} className= >
- **text:** } > Edit & preview
- **text:** createNotifM.mutate()} >
- **text:** setNotifPage((p) => Math.max(0, p - 1))} > Previous
- **text:** = notifPageCount - 1} onClick= > Next
- **text:** } > Edit
- **text:** editingTemplateId && sendTestEmailM.mutate( ) } >
- **text:** Close
- **text:** editingTemplateId && updateTemplateM.mutate(editingTemplateId)} >
- **text:** Cancel
- **text:** editingNotifId && updateNotifM.mutate(editingNotifId)} >
- **text:** sendAnnouncementM.mutate()} >
- **text:** = await confirm( ); if (!confirmed) return; toggleMaintenanceM.mutate(); }} >
- **label:** Health
- **label:** Config
- **label:** Features
- **label:** Jobs
- **label:** Templates
- **label:** Operations
- **label:** Service
- **label:** Config keys
- **label:** Feature flags
- **label:** Gateway
- **label:** Maintenance
- **label:** Flags enabled
- **label:** Email
- **label:** Notifications
- **dialog:** Edit notification template

## `apps/admin/src/features/users/UserDetailClient.tsx`

- **prop:** Breadcrumb
- **prop:** Operations
- **prop:** Access management
- **prop:** Role and account status
- **prop:** Administrative actions
- **prop:** Security, data export, and elevated access
- **prop:** Active sessions
- **prop:** Activity log
- **prop:** Operator notes
- **prop:** Internal context for support staff
- **prop:** Enter a new password
- **prop:** Re-enter the password
- **text:** Users
- **text:** Edit profile
- **text:** View media
- **text:** Pipeline hub
- **text:** forceReset.mutate()} > Force password reset
- **text:** setPasswordOpen(true)}> Set password
- **text:** terminateAll.mutate()} > End all sessions
- **text:** exportData.mutate()} >
- **text:** restore.mutate()} > Restore account
- **text:** = await confirm( ); if (confirmed) del.mutate(); }} > Deactivate user
- **text:** Open pipeline hub
- **text:** setEditOpen(false)}> Cancel
- **text:** updateProfile.mutate()}> Save
- **text:** setPasswordOpen(false)}> Cancel
- **dialog:** Edit profile
- **dialog:** Set new password

## `apps/admin/src/features/users/UsersListClient.tsx`

- **prop:** Select all users
- **prop:** User management
- **prop:** Users directory
- **prop:** User creation is via client registration
- **prop:** Bulk action reason
- **text:** View →
- **text:** Add new user
- **text:** bulkMutation.mutate('activate')} > Activate ( )
- **text:** setSelected(new Set())} > Clear
- **text:** } > Search
- **text:** } > Clear
- **label:** Pending
- **label:** Status
- **label:** All statuses
- **label:** Role
- **label:** All roles
- **label:** USER
- **label:** ADMIN

## `apps/landing/src/app/about/page.tsx`

- **text:** Start a project →
- **label:** Full-stack product delivery
- **label:** UI/UX and brand systems
- **label:** Direct operator collaboration

## `apps/landing/src/app/contact/page.tsx`

- **text:** Open contact form →
- **text:** See pricing
- **text:** services

## `apps/landing/src/app/error.tsx`

- **text:** reset()}> Retry
- **text:** Home

## `apps/landing/src/app/not-found.tsx`

- **text:** Home
- **text:** Contact

## `apps/landing/src/app/page.tsx`

- **text:** Get started
- **text:** View portfolio

## `apps/landing/src/app/services/page.tsx`

- **text:** Request this service →
- **text:** Contact us →

## `apps/landing/src/components/marketing/FeaturedWorkSlider.tsx`

- **prop:** Selected studio work

## `apps/landing/src/components/marketing/HeroSection.tsx`

- **prop:** project-hub · NL-204
- **prop:** ⌘K · command
- **text:** Start a project →
- **text:** Tour the product

## `apps/landing/src/components/marketing/HomeBelowFold.tsx`

- **prop:** milestone timeline · NL-204
- **text:** View all →
- **text:** Start a project →
- **text:** Preview the portal

## `apps/landing/src/components/marketing/MarketingFooter.tsx`

- **prop:** Product
- **prop:** Company
- **prop:** Legal
- **label:** Project Hub
- **label:** Pricing
- **label:** Services
- **label:** Portfolio
- **label:** About
- **label:** Blog
- **label:** Contact
- **label:** Start a project
- **label:** Terms
- **label:** Privacy
- **label:** Verify document

## `apps/landing/src/components/marketing/MarketingHeader.tsx`

- **prop:** Primary
- **prop:** Mobile primary
- **text:** Sign in
- **text:** Start a project
- **text:** setMenuOpen(true)} >
- **text:** setMenuOpen(false)} >
- **text:** setMenuOpen(false)}> Sign in
- **text:** setMenuOpen(false)} > Start a project
- **label:** Product
- **label:** Portfolio
- **label:** Blog
- **label:** About
- **label:** Pricing
- **label:** Services
- **label:** Contact

## `apps/landing/src/components/theme-toggle.tsx`

- **text:** setTheme(nextTheme)} title= aria-label= >

## `apps/web/src/app/(auth)/AuthThemeToggle.tsx`

- **prop:** Theme

## `apps/web/src/app/(auth)/forgot-password/page.tsx`

- **prop:** Forgot password?
- **prop:** Enter your email and we will send you a secure reset link.

## `apps/web/src/app/(auth)/layout.tsx`

- **text:** Terms
- **text:** Privacy

## `apps/web/src/app/(auth)/login/page.tsx`

- **prop:** Sign in

## `apps/web/src/app/(auth)/register/page.tsx`

- **prop:** Sign up
- **prop:** Create your client account for the Nestlancer studio.

## `apps/web/src/app/(auth)/reset-password/ResetPasswordClient.tsx`

- **prop:** Missing reset token
- **prop:** Use the link from your password reset email, or request a new one.
- **prop:** Choose a new password
- **prop:** Enter a strong password you have not used on Nestlancer before.
- **prop:** Create a new password
- **prop:** Re-enter your password
- **text:** Request a new link
- **text:** Back to sign in

## `apps/web/src/app/(auth)/reset-password/page.tsx`

- **prop:** Reset password
- **prop:** Use the link from your password reset email, or request a new one.

## `apps/web/src/app/(auth)/verify-email/VerifyEmailClient.tsx`

- **prop:** Verifying your email…
- **prop:** Hang tight, this usually takes a second.
- **prop:** Email verified
- **prop:** We couldn't verify that link
- **prop:** Check your inbox
- **text:** Go to sign in
- **text:** resendMutation.mutate(displayEmail)} >
- **text:** Back to sign in
- **text:** Sign in

## `apps/web/src/app/(auth)/verify-email/page.tsx`

- **prop:** Check your inbox
- **prop:** Open the verification link we sent, or enter this page from that email.

## `apps/web/src/app/(dashboard)/dashboard/DashboardOverview.tsx`

- **prop:** Dashboard chart unavailable
- **prop:** Quotes to review
- **prop:** Pay now
- **prop:** Active projects
- **prop:** Inbox
- **text:** Start a request
- **text:** View projects
- **text:** View billing history
- **text:** View all
- **text:** ) : null}
- **label:** Review quotes
- **label:** Pending payment
- **label:** Quotes to review
- **label:** Unread messages
- **label:** Notifications

## `apps/web/src/app/(dashboard)/invoices/[id]/not-found.tsx`

- **text:** Back to invoices

## `apps/web/src/app/(dashboard)/payments/invoice/[id]/not-found.tsx`

- **text:** Back to invoices

## `apps/web/src/app/(dashboard)/projects/ProjectsListClient.tsx`

- **prop:** Could not load projects
- **text:** Work Hub
- **text:** View quotes
- **text:** View my requests
- **text:** ) : null}

## `apps/web/src/app/(dashboard)/projects/[id]/error.tsx`

- **text:** reset()}> Try again

## `apps/web/src/app/(dashboard)/projects/[id]/loading.tsx`

- **prop:** Loading project

## `apps/web/src/app/(dashboard)/projects/[id]/not-found.tsx`

- **text:** Back to projects

## `apps/web/src/app/(dashboard)/projects/[id]/page.tsx`

- **prop:** Loading project

## `apps/web/src/app/(dashboard)/quotes/[id]/not-found.tsx`

- **text:** Back to quotes

## `apps/web/src/app/(public)/about/page.tsx`

- **label:** Full-stack product delivery
- **label:** UI/UX and brand systems
- **label:** Direct operator collaboration

## `apps/web/src/app/(public)/blog/[slug]/page.tsx`

- **prop:** Breadcrumb
- **text:** Try again
- **text:** Back to blog
- **text:** Blog

## `apps/web/src/app/(public)/page.tsx`

- **prop:** Platform metrics
- **prop:** Trusted by
- **prop:** Platform reach
- **text:** View all projects &rarr;
- **text:** Browse portfolio
- **text:** View all articles &rarr;

## `apps/web/src/app/(public)/portfolio/page.tsx`

- **text:** Start a project

## `apps/web/src/app/(public)/privacy/page.tsx`

- **text:** contact page

## `apps/web/src/app/(public)/terms/page.tsx`

- **text:** contact page

## `apps/web/src/app/error.tsx`

- **text:** reset()}> Retry

## `apps/web/src/app/impersonate/ImpersonateHandoff.tsx`

- **text:** window.close()}> Close tab

## `apps/web/src/app/not-found.tsx`

- **text:** Home
- **text:** Contact

## `apps/web/src/app/share/[token]/page.tsx`

- **prop:** Enter share password
- **text:** setSubmittedPassword(password.trim() || undefined)} > Unlock file
- **text:** Back to Nestlancer

## `apps/web/src/components/auth/AuthBrandPanel.tsx`

- **prop:** project-hub · NL-204

## `apps/web/src/components/command/CommandPaletteRoot.tsx`

- **label:** Dashboard
- **label:** Requests
- **label:** Projects
- **label:** Quotes
- **label:** Messages
- **label:** Billing
- **label:** Notifications
- **label:** Profile
- **label:** Settings
- **label:** Blog
- **label:** Portfolio
- **label:** New request
- **label:** New project
- **label:** New direct message

## `apps/web/src/components/common/ErrorBoundary.tsx`

- **text:** this.setState( )}> Try again

## `apps/web/src/components/common/SwitchRow.tsx`

- **text:** onChange(!checked)} className= >

## `apps/web/src/components/layout/DashboardHeader.tsx`

- **prop:** Open navigation menu
- **prop:** Breadcrumb
- **prop:** Open command menu
- **text:** Dashboard
- **text:** )); }} aria-label="Open command menu" > Search ⌘K

## `apps/web/src/components/layout/DashboardMessageLink.tsx`

- **text:** ) : null}
- **text:** } className= > ) : null}
- **text:** Open message inbox

## `apps/web/src/components/layout/DashboardMobileNav.tsx`

- **prop:** Quick navigation
- **prop:** Open full menu
- **prop:** Main
- **text:** Menu
- **text:** onOpenChange(false)} className= >

## `apps/web/src/components/layout/DashboardNotificationLink.tsx`

- **text:** unread && onMarkRead(item.id)} >
- **text:** } className= > ) : null}
- **text:** markAllRead.mutate()} > Mark all read
- **text:** View all notifications

## `apps/web/src/components/layout/Footer.tsx`

- **label:** Pricing
- **label:** Services
- **label:** Portfolio
- **label:** Blog
- **label:** About
- **label:** Contact
- **label:** Start a project
- **label:** Terms
- **label:** Privacy
- **label:** Verify document

## `apps/web/src/components/layout/NavbarUserMenu.tsx`

- **text:** Dashboard
- **text:** Profile
- **text:** Settings
- **text:** void handleLogout()} >

## `apps/web/src/components/layout/PublicHeader.tsx`

- **prop:** Primary
- **prop:** Mobile primary
- **text:** Dashboard
- **text:** Sign in
- **text:** Start a project
- **text:** setMenuOpen(true)} >
- **text:** setMenuOpen(false)} >
- **text:** setMenuOpen(false)}> Dashboard
- **text:** setMenuOpen(false)}> Sign in
- **text:** setMenuOpen(false)}> Start a project
- **label:** Product
- **label:** Portfolio
- **label:** Blog
- **label:** About
- **label:** Pricing
- **label:** Services
- **label:** Saved
- **label:** Contact

## `apps/web/src/components/layout/Sidebar.tsx`

- **prop:** Main
- **text:** : null}

## `apps/web/src/components/theme-toggle.tsx`

- **text:** setTheme(nextTheme)} title= aria-label= >

## `apps/web/src/components/web/DashboardLivePanel.tsx`

- **text:** ) : null} ) : null}

## `apps/web/src/components/web/DashboardMetricCard.tsx`

- **text:** ) : null} ) : null}

## `apps/web/src/components/web/DashboardWorkspaceChart.tsx`

- **text:** Complete checkout →
- **label:** Active
- **label:** Done
- **label:** Requests
- **label:** Quotes

## `apps/web/src/components/web/WebConfirmProvider.tsx`

- **text:** close(false)}>
- **text:** close(true)} >

## `apps/web/src/features/auth/components/LoginForm.tsx`

- **prop:** you@company.com
- **prop:** Enter your password
- **text:** setShowPassword((v) => !v)} aria-pressed= aria-label= >
- **text:** Forgot password?
- **text:** Sign up

## `apps/web/src/features/auth/components/PasswordResetForm.tsx`

- **prop:** you@company.com
- **text:** ); }} > Send another link
- **text:** Sign in

## `apps/web/src/features/auth/components/RegisterForm.tsx`

- **prop:** Your first name
- **prop:** Your last name
- **prop:** you@company.com
- **prop:** Create a password
- **prop:** Re-enter your password
- **text:** Terms of Service
- **text:** Privacy Policy.
- **text:** Sign in

## `apps/web/src/features/auth/components/TwoFactorChallengeForm.tsx`

- **text:** verify.mutate()} >

## `apps/web/src/features/auth/components/TwoFactorPrompt.tsx`

- **prop:** Two-factor code
- **prop:** 000000
- **text:** Verify

## `apps/web/src/features/blog/BlogBookmarksClient.tsx`

- **prop:** Bookmarks
- **prop:** Could not load bookmarks
- **prop:** No bookmarks yet
- **text:** Browse the blog
- **text:** removeM.mutate(b.slug)} > Remove

## `apps/web/src/features/blog/BlogPostInteractionsClient.tsx`

- **prop:** Edit your comment
- **text:** View saved
- **text:** editCommentM.mutate(c.id)} >
- **text:** setEditingId(null)} > Cancel
- **text:** } > Edit
- **text:** ) ) }} > Delete
- **label:** Log in

## `apps/web/src/features/blog/BlogSearchClient.tsx`

- **prop:** Search posts…
- **prop:** Search blog posts
- **text:** setInput('')} > ) : null}

## `apps/web/src/features/blog/components/BlogArticleContextRail.tsx`

- **text:** All articles
- **text:** More in

## `apps/web/src/features/blog/components/BlogArticleShell.tsx`

- **text:** ← Back to articles

## `apps/web/src/features/blog/components/BlogArticleToc.tsx`

- **prop:** Table of contents

## `apps/web/src/features/blog/components/BlogCategoryNav.tsx`

- **prop:** Filter by category

## `apps/web/src/features/blog/components/BlogHeroFeatured.tsx`

- **text:** ) : ( <> )} Editor&apos;s pick ) : null} · ) : null} Read article →

## `apps/web/src/features/blog/components/BlogHireCta.tsx`

- **text:** Start a project →
- **text:** Contact us →

## `apps/web/src/features/blog/components/BlogMobileToc.tsx`

- **text:** setOpen((v) => !v)} > On this page

## `apps/web/src/features/blog/components/BlogNewsletterCta.tsx`

- **text:** Get in touch

## `apps/web/src/features/blog/components/BlogPagination.tsx`

- **prop:** Blog pagination
- **text:** Previous
- **text:** Next

## `apps/web/src/features/blog/components/BlogPrevNext.tsx`

- **prop:** Adjacent articles
- **text:** ← Previous
- **text:** Next →

## `apps/web/src/features/blog/components/BlogShareRail.tsx`

- **prop:** Copy link
- **prop:** Share on LinkedIn
- **prop:** Share on X

## `apps/web/src/features/blog/components/BlogSidebar.tsx`

- **prop:** Blog categories
- **text:** All articles
- **text:** Bookmarks
- **text:** Journal home

## `apps/web/src/features/contact/ContactFormClient.tsx`

- **prop:** Your full name
- **prop:** you@company.com
- **prop:** Tell us about your project, timeline, and budget…
- **label:** General
- **label:** Sales
- **label:** Support
- **label:** Billing
- **label:** Partnership

## `apps/web/src/features/documents/DocumentVerifyClient.tsx`

- **prop:** Paste PDF verify URL, or NL-INV-…?t=…
- **prop:** Document verification link or number
- **text:** Verify

## `apps/web/src/features/documents/components/DocumentVersionsCard.tsx`

- **prop:** No documents yet
- **text:** Download

## `apps/web/src/features/documents/components/DocumentVersionsPanel.tsx`

- **prop:** No documents yet
- **text:** void action.onClick()} >
- **text:** Refresh
- **text:** Download

## `apps/web/src/features/documents/components/LivePaymentDocumentsPanel.tsx`

- **prop:** Billing documents
- **label:** Download receipt

## `apps/web/src/features/documents/components/LiveQuoteDocumentsPanel.tsx`

- **prop:** Documents
- **label:** Download quote PDF
- **label:** Preview service agreement (draft)
- **label:** Download signed service agreement

## `apps/web/src/features/invoices/InvoicesListClient.tsx`

- **prop:** Invoices
- **prop:** Could not load invoices
- **prop:** No invoices yet
- **text:** View payments
- **text:** void downloadInvoice(row.id)} > PDF
- **text:** View

## `apps/web/src/features/marketing/PublicHomeHero.tsx`

- **text:** Browse portfolio

## `apps/web/src/features/media/MediaLibraryClient.tsx`

- **prop:** Upload files
- **prop:** File type
- **prop:** Storage source
- **prop:** Search files…
- **prop:** Search files
- **prop:** Filter by status
- **prop:** Grid view
- **prop:** List view
- **prop:** Could not load files
- **prop:** Media library
- **text:** setTypeFilter(t.value)} className= > ) : null}
- **text:** setContextFilter(t.value)} className= >
- **text:** setViewMode('grid')} >
- **text:** setViewMode('list')} >
- **text:** fileInputRef.current?.click()} > Upload
- **text:** setPreviewTarget( ) } >
- **text:** downloadM.mutate(m.id)} >
- **text:** setPreviewTarget( ) } > Preview
- **text:** downloadM.mutate(m.id)} > Download
- **text:** setShareTarget(m)} > Share
- **text:** e.stopPropagation()} > Open
- **text:** downloadDocM.mutate(doc.id)} > Download
- **text:** /share/$ `; try catch }} > Copy link
- **text:** ".` : undefined, destructive: true, }) ) ); } }} > Revoke
- **text:** setMoveTarget(null)}> Cancel
- **text:** moveM.mutate( )} >
- **text:** e.stopPropagation()} >
- **text:** Preview
- **text:** } > Download
- **text:** } > Share
- **text:** } > Copy
- **text:** } > Move to folder
- **text:** } > Regen thumbnail
- **text:** } > Delete
- **text:** Shared with you · Nestlancer
- **label:** General
- **label:** Documents
- **label:** Images
- **label:** All
- **label:** Video
- **label:** Archives
- **label:** All sources
- **label:** My uploads
- **label:** Message attachments
- **label:** Projects
- **label:** Deliveries
- **label:** Folders

## `apps/web/src/features/media/components/FilePreviewDialog.tsx`

- **prop:** Close preview
- **text:** Open
- **text:** Open in new tab

## `apps/web/src/features/media/components/FileUpload.tsx`

- **text:** inputRef.current?.click()} >

## `apps/web/src/features/media/components/ShareMediaModal.tsx`

- **prop:** Why are you sharing this file?
- **prop:** Enter a password, or leave blank
- **text:** Cancel
- **text:** void handleCreate()} >
- **text:** Close
- **text:** void handleCopy()}> Copy link
- **label:** 24 hours
- **label:** 7 days
- **label:** 30 days
- **label:** 90 days

## `apps/web/src/features/messaging/ClientConversationQueue.tsx`

- **prop:** Search by name, preview, or ID…
- **prop:** Filter by type
- **text:** props.onKindFilterChange(chip.value); }} >
- **text:** navigates even when automation only activates the listitem. if (href)
- **label:** All
- **label:** Unread
- **label:** Direct
- **label:** Project
- **label:** Group
- **label:** Active
- **label:** Archived
- **label:** Unread first
- **label:** Longest wait
- **label:** Latest

## `apps/web/src/features/messaging/ClientGroupMembersPanel.tsx`

- **text:** Leave group

## `apps/web/src/features/messaging/ClientMessagesContextRail.tsx`

- **text:** Open project

## `apps/web/src/features/messaging/ClientThreadActionsPanel.tsx`

- **text:** unarchive.mutate()} > Move to inbox
- **text:** archive.mutate()} > Archive
- **text:** Delete

## `apps/web/src/features/messaging/ConversationsListPanel.tsx`

- **prop:** Search conversations…
- **prop:** Search conversations
- **prop:** Could not load conversations
- **prop:** Conversations
- **prop:** Unread conversation
- **text:** } > All
- **text:** setStatusFilter(statusFilter === 'unread' ? 'all' : 'unread')} > Unread
- **text:** setKindFilter(kindFilter === 'project' ? 'all' : 'project')} > Project
- **text:** dock.openDock(c)} >

## `apps/web/src/features/messaging/MessageChatThreadClient.tsx`

- **prop:** Could not load messages
- **prop:** Messages
- **prop:** Edit your message
- **text:** Panel
- **text:** setShowGroupInfo((open) => !open)} >
- **text:** patchMessageM.mutate()} > Save
- **text:** } > Cancel

## `apps/web/src/features/messaging/MessageFileAttachment.tsx`

- **text:** downloadM.mutate(payload.mediaId)} > ) : null}

## `apps/web/src/features/messaging/MessageNewDirectClient.tsx`

- **prop:** New message
- **prop:** Could not open conversation
- **text:** start.mutate()} >
- **text:** Cancel

## `apps/web/src/features/messaging/MessageThreadClient.tsx`

- **prop:** Could not load messages
- **prop:** Edit your message
- **prop:** Messages
- **text:** patchMessageM.mutate()} > Save
- **text:** setEditingMessageId(null)} > Cancel
- **text:** Panel

## `apps/web/src/features/messaging/MessageThreadToolbar.tsx`

- **prop:** Back to messaging panel
- **text:** onMarkRead()} > Mark read

## `apps/web/src/features/messaging/MessagesEmptyState.tsx`

- **text:** Message support

## `apps/web/src/features/messaging/MessagesInboxPlaceholder.tsx`

- **prop:** Choose a conversation
- **text:** Message support

## `apps/web/src/features/messaging/MessagesOverviewClient.tsx`

- **prop:** Messages
- **prop:** No conversations yet
- **prop:** Unread
- **text:** Message support
- **text:** Open messaging panel

## `apps/web/src/features/messaging/MessagesPanelClient.tsx`

- **text:** Message support

## `apps/web/src/features/messaging/MessagingRealtimeStatus.tsx`

- **label:** Connecting…
- **label:** Live
- **label:** Reconnecting…
- **label:** Offline

## `apps/web/src/features/messaging/components/ConversationList.tsx`

- **prop:** Conversations

## `apps/web/src/features/messaging/dock/ClientChatDock.tsx`

- **prop:** Active conversations

## `apps/web/src/features/messaging/dock/ClientDockChatWindow.tsx`

- **prop:** Suggested replies
- **text:** setQuickOpen((open) => !open)} >

## `apps/web/src/features/notifications/NotificationsClient.tsx`

- **prop:** Mark as read
- **prop:** Delete notification
- **prop:** Notifications
- **prop:** Could not load notifications
- **text:** readAll.mutate()} > Mark all read
- **text:** ) ) }} > Clear read
- **label:** Today
- **label:** Yesterday
- **label:** This week
- **label:** Earlier

## `apps/web/src/features/notifications/NotificationsTabBar.tsx`

- **prop:** Notification views
- **text:** onChange(tab)} >

## `apps/web/src/features/notifications/components/NotificationBell.tsx`

- **prop:** Notifications
- **text:** unread notifications ) : ( No unread notifications )}

## `apps/web/src/features/payments/PaymentDetailClient.tsx`

- **prop:** Could not load payment
- **prop:** e.g. Charged twice for the same milestone
- **prop:** Dates, UTR, and what you expected instead
- **text:** Back to payments
- **text:** setShowDispute(true)} > File a payment dispute
- **text:** disputeM.mutate()} >
- **text:** setShowDispute(false)} > Cancel

## `apps/web/src/features/payments/PaymentInvoiceClient.tsx`

- **prop:** Invoice unavailable
- **prop:** Invoice
- **text:** Back to payment

## `apps/web/src/features/payments/PaymentMethodsClient.tsx`

- **prop:** Payment methods
- **prop:** Could not load payment methods
- **prop:** No saved methods yet
- **text:** Back to payments
- **text:** setDefaultM.mutate(m.id)} > Set as default
- **text:** ) ) }} > Remove
- **text:** Go to payments

## `apps/web/src/features/payments/PaymentsListClient.tsx`

- **prop:** Billing Center
- **prop:** Could not load payments
- **text:** Invoices
- **text:** Payment methods
- **text:** setStatusFilter('')}> Clear filter
- **label:** All statuses
- **label:** Pending
- **label:** Not due yet
- **label:** Processing
- **label:** Completed
- **label:** Failed
- **label:** Refunded
- **label:** Status

## `apps/web/src/features/payments/components/OfflineBankTransferPanel.tsx`

- **prop:** e.g. 123456789012
- **prop:** e.g. Paid from HDFC, project name in remarks
- **text:** setMediaIds((prev) => prev.filter((x) => x !== id))} > Remove
- **text:** submitM.mutate()}>

## `apps/web/src/features/payments/components/PaymentButton.tsx`

- **text:** ).catch(() => ); }} >

## `apps/web/src/features/payments/components/PaymentCheckoutPanel.tsx`

- **text:** setRail('razorpay')} > Pay online
- **text:** setRail('offline')} > Bank / UPI transfer
- **text:** Cancel payment

## `apps/web/src/features/payments/components/PaymentStatsHero.tsx`

- **text:** void statsQ.refetch()} > Retry

## `apps/web/src/features/payments/components/PaymentStatusTimeline.tsx`

- **prop:** Payment status
- **label:** Created
- **label:** Pending
- **label:** Processing
- **label:** Completed
- **label:** Refunded

## `apps/web/src/features/payments/components/UpiIdCheckoutSection.tsx`

- **prop:** yourname@okicici

## `apps/web/src/features/portfolio/PortfolioCaseStudyHero.tsx`

- **text:** ← Portfolio

## `apps/web/src/features/portfolio/PortfolioCaseStudySections.tsx`

- **text:** Start a similar project

## `apps/web/src/features/portfolio/PortfolioClientReview.tsx`

- **prop:** Client review

## `apps/web/src/features/portfolio/PortfolioFeaturedCarousel.tsx`

- **prop:** Featured portfolio projects
- **prop:** Previous project
- **prop:** Next project

## `apps/web/src/features/portfolio/PortfolioLikeButton.tsx`

- **text:** likeM.mutate()} className= `} >

## `apps/web/src/features/portfolio/PortfolioSearch.tsx`

- **prop:** Search projects, stacks, and industries…
- **prop:** Search portfolio
- **text:** void runSearch()} >
- **text:** · likes View case study →

## `apps/web/src/features/portfolio/PortfolioShowcaseCard.tsx`

- **text:** ) : null} ) : null} ) : null} ) : null}

## `apps/web/src/features/profile/ProfileEditClient.tsx`

- **prop:** Could not load profile
- **prop:** Edit profile
- **prop:** Your first name
- **prop:** Your last name
- **prop:** +91 98765 43210
- **prop:** e.g. Founder at a D2C brand
- **prop:** Short intro for your profile
- **prop:** e.g. Shopify, SEO, branding
- **text:** Back to profile
- **text:** removeAvatar.mutate()} > Remove
- **text:** Save changes

## `apps/web/src/features/profile/ProfileViewClient.tsx`

- **prop:** Could not load profile
- **prop:** Profile
- **text:** Edit profile
- **text:** Account settings
- **text:** Open settings

## `apps/web/src/features/progress/ProgressTimelineClient.tsx`

- **prop:** Could not load timeline
- **prop:** No progress entries yet
- **prop:** Describe what should change…
- **text:** requestChanges.mutate()} > Request changes

## `apps/web/src/features/progress/ProgressTimelineView.tsx`

- **text:** onFilterChange(key)} >

## `apps/web/src/features/projects/ProjectDeliverySection.tsx`

- **prop:** What should change before you approve
- **prop:** Could not load deliverables
- **prop:** e.g. Logo files are the old version
- **prop:** Could not load payments
- **prop:** Could not load feedback
- **prop:** What went well, and what to improve
- **text:** setTab(t)} >
- **text:** approveM.mutate()} > Approve delivery
- **text:** revisionM.mutate()} > Request revision
- **text:** 0 && !previewedIds.has(d.id)) } onClick= > Approve
- **text:** } > Reject
- **text:** rejectDeliverableM.mutate( ) } > Confirm reject
- **text:** setRejectTarget(null)} > Cancel
- **text:** Details
- **text:** feedbackM.mutate()} > Submit feedback

## `apps/web/src/features/projects/ProjectDetailClient.tsx`

- **prop:** Loading project

## `apps/web/src/features/projects/ProjectsNewClient.tsx`

- **prop:** New project
- **text:** View projects
- **text:** Go to Projects
- **text:** Review quotes
- **text:** new request
- **text:** Post a request
- **text:** View quotes

## `apps/web/src/features/projects/hub/DeliverableFileAction.tsx`

- **text:** setPreview( ) } >
- **text:** downloadM.mutate()} >

## `apps/web/src/features/projects/hub/ProjectHubContractStrip.tsx`

- **text:** Message
- **text:** View milestones

## `apps/web/src/features/projects/hub/ProjectHubDeliverablesTab.tsx`

- **prop:** Could not load deliverables
- **prop:** No deliverables yet
- **prop:** e.g. Logo files are the old version
- **text:** 0 && !previewedIds.has(d.id)) } onClick= > Accept
- **text:** } > Reject
- **text:** rejectDeliverableM.mutate( ) } > Confirm reject
- **text:** setRejectTarget(null)}> Cancel

## `apps/web/src/features/projects/hub/ProjectHubFilesTab.tsx`

- **prop:** Could not load files
- **prop:** No files yet
- **text:** setPreview( ) } > Preview

## `apps/web/src/features/projects/hub/ProjectHubMilestonesTab.tsx`

- **prop:** Could not load milestones
- **prop:** No milestones yet
- **prop:** Explain what changes are needed…
- **prop:** Milestone stepper
- **text:** } > Cancel
- **text:** revisionMutation.mutate( ) } >
- **text:** approveMutation.mutate(m.id)} > Approve delivery
- **text:** setRevisionTarget(m.id)} > Request revision
- **text:** setRevisionTarget(m.id)} > Request changes before paying

## `apps/web/src/features/projects/hub/ProjectHubOverviewTab.tsx`

- **prop:** What should change before you approve
- **prop:** Could not load progress
- **prop:** Could not load updates
- **prop:** Share your feedback…
- **text:** approveM.mutate()} > Approve delivery
- **text:** revisionM.mutate()} > Request revision
- **text:** View all progress
- **text:** feedbackM.mutate()} > Submit feedback

## `apps/web/src/features/projects/hub/ProjectHubProgressTab.tsx`

- **prop:** Could not load progress
- **prop:** No progress entries yet
- **prop:** Describe what should change…
- **text:** requestChanges.mutate()} >

## `apps/web/src/features/projects/hub/ProjectHubStatusPanel.tsx`

- **text:** View all milestones
- **text:** View deliverables
- **text:** View progress timeline

## `apps/web/src/features/projects/hub/ProjectHubTabBar.tsx`

- **prop:** Project sections
- **text:** onChange?.(tab)} >

## `apps/web/src/features/quotes/QuoteDetailClient.tsx`

- **prop:** Could not load quote
- **prop:** Breadcrumb
- **prop:** No line items
- **prop:** Type your full legal name
- **prop:** e.g. Reduce milestone 2 by ₹20,000 and drop logo design
- **prop:** e.g. Budget is above our range for this phase
- **text:** ← Back to quotes
- **text:** View request
- **text:** Open Projects
- **text:** Open project
- **text:** Accept quote &amp; sign agreement
- **text:** , ], ...(message.trim() ? : ), }, }); }} > Send change request
- **text:** setShowNegotiate((v) => !v)}>
- **text:** Decline
- **text:** scrollToAcceptForm(); }} >

## `apps/web/src/features/quotes/QuotesListClient.tsx`

- **prop:** Quotes
- **prop:** Could not load quotes
- **prop:** No quotes yet
- **text:** Browse requests
- **text:** Review quote →
- **label:** All statuses
- **label:** Awaiting response
- **label:** Viewed
- **label:** Changes requested
- **label:** Accepted
- **label:** Declined
- **label:** Expired
- **label:** Total
- **label:** Pending
- **label:** Filter quotes by status

## `apps/web/src/features/requests/NewRequestClient.tsx`

- **prop:** New request
- **prop:** e.g. Redesign marketing site
- **prop:** Goals, constraints, and what success looks like…
- **prop:** 50000
- **prop:** 150000
- **prop:** Must-haves, integrations, constraints…
- **text:** Back to requests
- **text:** Cancel

## `apps/web/src/features/requests/RequestDetailClient.tsx`

- **prop:** Could not load request
- **prop:** e.g. Redesign marketing site
- **prop:** Goals, constraints, and what success looks like…
- **prop:** 50000
- **prop:** 150000
- **prop:** Could not load status history
- **prop:** Could not load quotes
- **text:** ); if (!parsed.success) if (editBudgetMax
- **text:** downloadAttachmentM.mutate(a.id)} >
- **text:** ) ) ); } }} > Remove
- **text:** Review quote
- **text:** ) ) ); } }} > Delete draft
- **text:** ← Back to Work Hub
- **text:** View quote →

## `apps/web/src/features/requests/RequestsListClient.tsx`

- **prop:** Work Hub
- **text:** New request

## `apps/web/src/features/settings/SettingsAccountClient.tsx`

- **prop:** Could not load preferences
- **prop:** Enter your password
- **text:** Notification settings
- **text:** Profile
- **text:** exportM.mutate()} >
- **text:** downloadExportM.mutate()} > Check status / download
- **text:** ) ) }} > Delete account
- **text:** cancelM.mutate()} > Cancel pending deletion

## `apps/web/src/features/settings/SettingsActivityClient.tsx`

- **prop:** No activity yet

## `apps/web/src/features/settings/SettingsLayoutClient.tsx`

- **prop:** Settings
- **prop:** Settings sections
- **label:** Account
- **label:** Security
- **label:** Notifications
- **label:** Files
- **label:** Activity

## `apps/web/src/features/settings/SettingsNotificationsClient.tsx`

- **prop:** Could not load notification settings
- **prop:** e.g. Asia/Kolkata
- **text:** onChange(!checked)} className= >
- **text:** Open inbox

## `apps/web/src/features/settings/SettingsSecurityClient.tsx`

- **prop:** Enter your current password
- **prop:** Create a new password
- **prop:** Re-enter your password
- **prop:** Could not load sessions
- **prop:** Enter your password
- **prop:** 000000
- **text:** killOthers.mutate()} > Sign out other devices
- **text:** ) ) }} > Sign out all
- **text:** ) ) }} > Sign out
- **text:** enableM.mutate()} >
- **text:** void copySecret()} > Copy key
- **text:** verifyM.mutate()} >
- **text:** regenM.mutate()} > Regenerate backup codes
- **text:** disableM.mutate()} >

## `apps/web/src/features/work/WorkFilterBar.tsx`

- **prop:** Filter by status
- **prop:** Search work items…
- **prop:** Search work items
- **label:** All statuses
- **label:** Draft
- **label:** Submitted
- **label:** Under review
- **label:** Quoted
- **label:** Changes requested
- **label:** Converted to project
- **label:** Rejected
- **label:** Cancelled

## `apps/web/src/features/work/WorkHubTabBar.tsx`

- **prop:** Work hub views
- **text:** onChange(view)} >

## `apps/web/src/features/work/WorkListItem.tsx`

- **text:** ))} % ) : null} ) : null}

