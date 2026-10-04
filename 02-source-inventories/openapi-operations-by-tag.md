# OpenAPI operations by tag

Source: /home/user/nestlancer-frontend-public/swagger-docs/openapi-gateway.json

Total paths: 542; operations: 637

## Blog - Admin Analytics (4)

- `GET /api/v1/admin/blog/analytics` — Get general analytics
- `GET /api/v1/admin/blog/analytics/engagement` — Get engagement metrics
- `GET /api/v1/admin/blog/analytics/top-posts` — Get top posts
- `GET /api/v1/admin/blog/analytics/{id}` — Get single post analytics

## Blog - Admin Authors (1)

- `GET /api/v1/admin/blog/authors` — List all authors

## Blog - Admin Categories (4)

- `GET /api/v1/admin/blog/categories` — List all categories
- `POST /api/v1/admin/blog/categories` — Create category
- `DELETE /api/v1/admin/blog/categories/{id}` — Delete category
- `PATCH /api/v1/admin/blog/categories/{id}` — Update category

## Blog - Admin Comments (10)

- `GET /api/v1/admin/comments` — List all comments (Admin)
- `GET /api/v1/admin/comments/pending` — List pending comments (Admin)
- `GET /api/v1/admin/comments/reported` — List reported comments (Admin)
- `DELETE /api/v1/admin/comments/{id}` — Delete comment (Admin)
- `POST /api/v1/admin/comments/{id}/approve` — Approve comment
- `POST /api/v1/admin/comments/{id}/pin` — Pin comment (Admin)
- `POST /api/v1/admin/comments/{id}/reject` — Reject comment
- `POST /api/v1/admin/comments/{id}/reply` — Post admin reply
- `POST /api/v1/admin/comments/{id}/spam` — Mark as spam
- `POST /api/v1/admin/comments/{id}/unpin` — Unpin comment (Admin)

## Blog - Admin Posts (19)

- `GET /api/v1/admin/posts` — List all posts (Admin)
- `POST /api/v1/admin/posts` — Create blog post
- `POST /api/v1/admin/posts/export` — Export posts
- `POST /api/v1/admin/posts/import` — Import posts
- `PATCH /api/v1/admin/posts/settings` — Update blog settings
- `DELETE /api/v1/admin/posts/{id}` — Delete blog post
- `GET /api/v1/admin/posts/{id}` — Get post detail (Admin)
- `PATCH /api/v1/admin/posts/{id}` — Update blog post
- `POST /api/v1/admin/posts/{id}/archive` — Archive post
- `POST /api/v1/admin/posts/{id}/duplicate` — Duplicate post
- `POST /api/v1/admin/posts/{id}/feature` — Feature blog post
- `POST /api/v1/admin/posts/{id}/pin` — Pin blog post
- `POST /api/v1/admin/posts/{id}/publish` — Publish post
- `GET /api/v1/admin/posts/{id}/revisions` — Get post revisions
- `POST /api/v1/admin/posts/{id}/revisions/{revisionId}/restore` — Restore revision
- `POST /api/v1/admin/posts/{id}/schedule` — Schedule post publication
- `POST /api/v1/admin/posts/{id}/unfeature` — Unfeature blog post
- `POST /api/v1/admin/posts/{id}/unpin` — Unpin blog post
- `POST /api/v1/admin/posts/{id}/unpublish` — Unpublish post

## Blog - Admin Tags (5)

- `GET /api/v1/admin/blog/tags` — List all tags
- `POST /api/v1/admin/blog/tags` — Create tag
- `POST /api/v1/admin/blog/tags/merge` — Merge tags
- `DELETE /api/v1/admin/blog/tags/{id}` — Delete tag
- `PATCH /api/v1/admin/blog/tags/{id}` — Update tag

## Blog - Standalone Comments (7)

- `DELETE /api/v1/comments/{commentId}` — Delete standalone comment
- `GET /api/v1/comments/{commentId}` — Get comment by ID
- `PATCH /api/v1/comments/{commentId}` — Patch comment
- `POST /api/v1/comments/{commentId}/like` — Like standalone comment
- `GET /api/v1/comments/{commentId}/replies` — Get standalone replies
- `POST /api/v1/comments/{commentId}/reply` — Reply standalone
- `POST /api/v1/comments/{commentId}/report` — Report standalone comment

## Chat threads (17)

- `GET /api/v1/messages/threads` — List direct and group threads for the current user
- `POST /api/v1/messages/threads/direct` — Open or resume a direct admin↔client thread
- `POST /api/v1/messages/threads/group` — Create a group thread (admin + multiple clients)
- `GET /api/v1/messages/threads/{threadId}` — Get chat thread details with members
- `PATCH /api/v1/messages/threads/{threadId}` — Update a group thread (title)
- `POST /api/v1/messages/threads/{threadId}/archive` — Archive a conversation (direct or group)
- `POST /api/v1/messages/threads/{threadId}/leave` — Leave a group thread (clients only)
- `GET /api/v1/messages/threads/{threadId}/members` — List members of a chat thread
- `POST /api/v1/messages/threads/{threadId}/members` — Add clients to a group thread
- `DELETE /api/v1/messages/threads/{threadId}/members/{memberUserId}` — Remove a client from a group thread
- `GET /api/v1/messages/threads/{threadId}/messages` — List root messages in a chat thread
- `POST /api/v1/messages/threads/{threadId}/messages` — Send a message in a chat thread
- `POST /api/v1/messages/threads/{threadId}/read` — Mark all messages in a thread as read
- `POST /api/v1/messages/threads/{threadId}/unarchive` — Restore an archived conversation
- `POST /api/v1/messages/threads/{threadId}/user-archive` — Archive a conversation for the current user only
- `POST /api/v1/messages/threads/{threadId}/user-hide` — Delete a conversation from your inbox (admin still has full record)
- `POST /api/v1/messages/threads/{threadId}/user-unarchive` — Restore a user-archived conversation to the inbox

## Contact - Admin (6)

- `GET /api/v1/admin/contact` — List all inquiries
- `DELETE /api/v1/admin/contact/{id}` — Delete inquiry
- `GET /api/v1/admin/contact/{id}` — Get inquiry details
- `POST /api/v1/admin/contact/{id}/respond` — Respond to inquiry
- `POST /api/v1/admin/contact/{id}/spam` — Mark as spam
- `PATCH /api/v1/admin/contact/{id}/status` — Update inquiry status

## Contact - Public (2)

- `POST /api/v1/contact` — Submit contact inquiry
- `GET /api/v1/contact/health` — Contact service health check

## Conversations (2)

- `GET /api/v1/conversations` — List user conversations
- `GET /api/v1/conversations/unread-count` — Get unread count

## Deliverable Reviews (2)

- `POST /api/v1/deliverables/{id}/approve` — Approve a deliverable
- `POST /api/v1/deliverables/{id}/reject` — Reject a deliverable

## Health - Admin Debug (1)

- `GET /api/v1/health/debug` — Retrieve system debug logs

## Health - Monitoring (16)

- `GET /api/v1/health/cache` — Cache health
- `GET /api/v1/health/database` — Database health
- `GET /api/v1/health/detailed` — Get detailed health diagnostics
- `GET /api/v1/health/external` — External services health
- `GET /api/v1/health/features` — Feature flag health
- `GET /api/v1/health/live` — Liveness probe
- `GET /api/v1/health/microservices` — Inter-service health
- `GET /api/v1/health/ping` — Ping (GET)
- `HEAD /api/v1/health/ping` — Ping (HEAD)
- `GET /api/v1/health/queue` — Queue health
- `GET /api/v1/health/ready` — Readiness probe
- `GET /api/v1/health/registry` — Registry health
- `GET /api/v1/health/storage` — Storage health
- `GET /api/v1/health/system` — System metrics
- `GET /api/v1/health/websocket` — WebSocket health
- `GET /api/v1/health/workers` — Workers health

## Internal Notifications (1)

- `POST /api/v1/internal/notifications/trigger` — Trigger an internal notification

## Invoices (3)

- `GET /api/v1/invoices` — List user invoices
- `GET /api/v1/invoices/{id}` — Get invoice details
- `GET /api/v1/invoices/{id}/download` — Download invoice PDF

## Media - Admin (24)

- `GET /api/v1/admin/media` — List all media
- `GET /api/v1/admin/media/analytics` — Get storage analytics
- `POST /api/v1/admin/media/backfill-context` — Backfill deliverable media context tags
- `GET /api/v1/admin/media/browse` — Browse storage folders
- `POST /api/v1/admin/media/bulk-delete` — Bulk delete media
- `POST /api/v1/admin/media/cleanup` — Run storage cleanup
- `POST /api/v1/admin/media/promote-to-portfolio` — Promote project deliverable media to public portfolio
- `GET /api/v1/admin/media/quarantine` — List quarantined media
- `DELETE /api/v1/admin/media/quarantine/{id}` — Purge quarantined media
- `POST /api/v1/admin/media/quarantine/{id}/release` — Release from quarantine
- `PATCH /api/v1/admin/media/settings` — Update media settings
- `GET /api/v1/admin/media/storage-usage` — Get storage usage
- `GET /api/v1/admin/media/users/{userId}` — List user media (admin)
- `DELETE /api/v1/admin/media/{id}` — Force delete media
- `GET /api/v1/admin/media/{id}` — Get media details (admin)
- `PATCH /api/v1/admin/media/{id}` — Update media metadata (admin)
- `GET /api/v1/admin/media/{id}/download` — Get media download URL (admin)
- `GET /api/v1/admin/media/{id}/references` — Get media references (admin)
- `POST /api/v1/admin/media/{id}/replace` — Replace media file (admin)
- `POST /api/v1/admin/media/{id}/reprocess` — Reprocess media
- `DELETE /api/v1/admin/media/{id}/share` — Revoke all share links (admin)
- `POST /api/v1/admin/media/{id}/share` — Create share link (admin)
- `GET /api/v1/admin/media/{id}/shares` — Get media share links (admin)
- `DELETE /api/v1/admin/media/{id}/shares/{shareLinkId}` — Revoke one share link (admin)

## Media - Chunked Upload (5)

- `POST /api/v1/media/upload/chunked/init` — Initialize chunked upload
- `POST /api/v1/media/upload/chunked/{uploadId}/abort` — Abort chunked upload
- `POST /api/v1/media/upload/chunked/{uploadId}/complete` — Complete chunked upload
- `POST /api/v1/media/upload/chunked/{uploadId}/part` — Record uploaded chunk part
- `GET /api/v1/media/upload/chunked/{uploadId}/status` — Get chunked upload status

## Media - Public Share (2)

- `GET /api/v1/share/{token}` — Resolve a public share link (no password)
- `POST /api/v1/share/{token}` — Resolve a password-protected public share link

## Media - Root (3)

- `GET /api/v1/stats` — Get root stats
- `POST /api/v1/upload` — Root upload
- `GET /api/v1/{id}/status` — Get processing status

## Media - Sharing (4)

- `DELETE /api/v1/media/{id}/share` — Revoke all share links for media
- `POST /api/v1/media/{id}/share` — Create share link
- `GET /api/v1/media/{id}/shares` — List share links for media
- `DELETE /api/v1/media/{id}/shares/{shareLinkId}` — Revoke one share link

## Message Threads (2)

- `GET /api/v1/messages/{messageId}/threads` — List thread replies
- `POST /api/v1/messages/{messageId}/threads` — Reply in thread

## Messaging - Admin (14)

- `GET /api/v1/admin/messages` — List all platform messages
- `GET /api/v1/admin/messages/analytics` — Get messaging analytics
- `GET /api/v1/admin/messages/conversations` — List all conversations
- `GET /api/v1/admin/messages/flagged` — List flagged messages
- `DELETE /api/v1/admin/messages/flagged/{id}` — Delete flagged message
- `POST /api/v1/admin/messages/flagged/{id}/dismiss` — Dismiss flagged message
- `POST /api/v1/admin/messages/flagged/{id}/escalate` — Escalate flagged message
- `POST /api/v1/admin/messages/flagged/{id}/restore` — Restore moderated message
- `GET /api/v1/admin/messages/moderation-history` — List message moderation history
- `GET /api/v1/admin/messages/project/{projectId}` — Get project messages
- `POST /api/v1/admin/messages/projects/{projectId}/system` — Broadcast system message
- `GET /api/v1/admin/messages/stats` — Get global messaging stats
- `DELETE /api/v1/admin/messages/{id}` — Force delete message
- `POST /api/v1/admin/messages/{id}/flag` — Flag message

## Milestone Approvals (2)

- `POST /api/v1/milestones/{id}/approve` — Approve a milestone
- `POST /api/v1/milestones/{id}/request-revision` — Request revision on a milestone

## Notification Preferences (5)

- `GET /api/v1/notifications/channels` — Get available delivery channels
- `GET /api/v1/notifications/preferences` — Get notification preferences
- `PATCH /api/v1/notifications/preferences` — Update notification preferences
- `PATCH /api/v1/notifications/preferences/channel/{channel}` — Update specific channel preference
- `GET /api/v1/notifications/preferences/channels` — Get delivery channels (Alias)

## Notifications/Root (2)

- `GET /api/v1/health` — Service health check
- `POST /api/v1/test` — Send test notification

## Payment Documents (1)

- `GET /api/v1/payments/{id}/documents/versions` — List payment document versions

## Payment Methods (5)

- `GET /api/v1/payments/methods` — List saved payment methods
- `POST /api/v1/payments/methods` — Add a new payment method
- `DELETE /api/v1/payments/methods/{id}` — Remove a payment method
- `PATCH /api/v1/payments/methods/{id}/default` — Set a payment method as default
- `PATCH /api/v1/payments/methods/{id}/nickname` — Update payment method nickname

## Public/Portfolio (10)

- `GET /api/v1/portfolio` — List published portfolio items
- `GET /api/v1/portfolio/categories` — Get all categories
- `GET /api/v1/portfolio/featured` — Get featured portfolio items
- `GET /api/v1/portfolio/health` — Service health check
- `GET /api/v1/portfolio/search` — Search portfolio items
- `GET /api/v1/portfolio/tags` — Get all unique tags
- `GET /api/v1/portfolio/timeline` — Portfolio project timeline
- `GET /api/v1/portfolio/{idOrSlug}` — Get portfolio item details
- `POST /api/v1/portfolio/{idOrSlug}/like` — Toggle like on portfolio item
- `POST /api/v1/portfolio/{idOrSlug}/view` — Record portfolio item view

## Public/Projects (2)

- `GET /api/v1/public` — List public projects
- `GET /api/v1/public/{id}` — Get public project details

## Public/Services (2)

- `GET /api/v1/services` — List active service packages
- `GET /api/v1/services/{slug}` — Get service package by slug

## Push Notifications (2)

- `POST /api/v1/push/register` — Register push device token
- `DELETE /api/v1/push/unregister/{deviceId}` — Unregister push device

## Push Subscriptions (2)

- `DELETE /api/v1/push-subscription` — Remove web push subscription
- `POST /api/v1/push-subscription` — Register web push subscription

## Quote Documents (3)

- `GET /api/v1/quotes/{id}/contract` — Download signed contract PDF
- `GET /api/v1/quotes/{id}/contract/preview` — Preview draft service agreement PDF before acceptance
- `GET /api/v1/quotes/{id}/documents/versions` — List quote document versions

## Webhooks (1)

- `POST /api/v1/webhooks/razorpay` — Handle Razorpay Webhook

## admin (239)

- `GET /api/v1/admin/audit` — List system audit logs (admin service)
- `POST /api/v1/admin/audit/export` — Export audit logs (CSV/JSON)
- `GET /api/v1/admin/audit/resource/{type}/{id}` — Resource audit trail
- `GET /api/v1/admin/audit/stats` — Audit log statistics
- `GET /api/v1/admin/audit/user/{userId}` — User audit trail
- `GET /api/v1/admin/audit/{id}` — Get audit log entry by id
- `POST /api/v1/admin/blog/categories/merge` — Merge blog categories (admin)
- `PATCH /api/v1/admin/comments/{id}/approve` — Approve blog comment
- `PATCH /api/v1/admin/comments/{id}/reject` — Reject comment (PATCH alias)
- `PATCH /api/v1/admin/comments/{id}/spam` — Mark comment as spam (PATCH alias)
- `GET /api/v1/admin/dashboard/activity` — Get recent activity
- `GET /api/v1/admin/dashboard/alerts` — Get system alerts
- `GET /api/v1/admin/dashboard/overview` — Get dashboard overview metrics
- `GET /api/v1/admin/dashboard/performance` — Get system performance metrics
- `GET /api/v1/admin/dashboard/projects` — Get project metrics
- `GET /api/v1/admin/dashboard/revenue` — Get revenue analytics
- `GET /api/v1/admin/dashboard/users` — Get user metrics
- `DELETE /api/v1/admin/deliverables/{deliverableId}` — Delete a deliverable (admin)
- `PATCH /api/v1/admin/deliverables/{deliverableId}` — Update deliverable metadata (admin)
- `GET /api/v1/admin/documents/users/{userId}` — List documents for a user (admin)
- `GET /api/v1/admin/documents/verify/{documentNumber}` — Verify document by number (admin)
- `GET /api/v1/admin/documents/{documentId}/download` — Download a specific generated document version (admin)
- `GET /api/v1/admin/health` — Admin service health check
- `POST /api/v1/admin/impersonate/end` — End impersonation session (documented path)
- `GET /api/v1/admin/impersonate/sessions` — List active impersonation sessions (documented path)
- `GET /api/v1/admin/logs` — List authentication audit logs
- `GET /api/v1/admin/logs/security-stats` — Security metrics for audit dashboard
- `PATCH /api/v1/admin/milestones/{milestoneId}` — Update a progress milestone (admin)
- `POST /api/v1/admin/milestones/{milestoneId}/complete` — Mark a milestone as complete (admin)
- `DELETE /api/v1/admin/notification-templates/{id}` — Delete notification template (legacy hyphenated path)
- `PATCH /api/v1/admin/notification-templates/{id}` — Update notification template (legacy hyphenated path)
- `GET /api/v1/admin/notifications` — Get all notifications (Admin)
- `POST /api/v1/admin/notifications/broadcast` — Broadcast notification to all users
- `GET /api/v1/admin/notifications/delivery-report` — Get delivery report
- `POST /api/v1/admin/notifications/segment` — Send notification to segment
- `POST /api/v1/admin/notifications/send` — Send targeted notification
- `GET /api/v1/admin/notifications/stats` — Get notification statistics
- `GET /api/v1/admin/notifications/templates` — Get all notification templates
- `POST /api/v1/admin/notifications/templates` — Create a new template
- `DELETE /api/v1/admin/notifications/templates/{id}` — Delete a template
- `PATCH /api/v1/admin/notifications/templates/{id}` — Update a template
- `DELETE /api/v1/admin/notifications/user/{userId}` — Clear notifications for a user
- `POST /api/v1/admin/notifications/{id}/resend` — Resend a notification
- `GET /api/v1/admin/payments` — List all payments (Admin)
- `GET /api/v1/admin/payments/accounts` — List platform payment accounts (bank/UPI)
- `POST /api/v1/admin/payments/accounts` — Create a platform payment account
- `DELETE /api/v1/admin/payments/accounts/{id}` — Disable a platform payment account (soft delete)
- `PATCH /api/v1/admin/payments/accounts/{id}` — Update a platform payment account
- `GET /api/v1/admin/payments/company-legal` — List company legal profiles (GSTIN/PAN/address)
- `POST /api/v1/admin/payments/company-legal` — Create company legal profile
- `DELETE /api/v1/admin/payments/company-legal/{id}` — Remove company legal profile
- `PATCH /api/v1/admin/payments/company-legal/{id}` — Update company legal profile
- `GET /api/v1/admin/payments/disputes` — List payment disputes
- `GET /api/v1/admin/payments/disputes/{id}` — Get dispute details
- `PATCH /api/v1/admin/payments/disputes/{id}` — Update a dispute
- `POST /api/v1/admin/payments/disputes/{id}/resolve` — Resolve a dispute
- `POST /api/v1/admin/payments/disputes/{id}/respond` — Respond to a dispute
- `POST /api/v1/admin/payments/manual` — Create manual payment entry
- `GET /api/v1/admin/payments/methods/supported` — Get supported payment methods
- `GET /api/v1/admin/payments/milestones` — List all payment milestones
- `GET /api/v1/admin/payments/milestones/{id}` — Get milestone details
- `PATCH /api/v1/admin/payments/milestones/{id}` — Update milestone payment fields
- `POST /api/v1/admin/payments/milestones/{id}/mark-complete` — Mark milestone complete (deprecated)
- `GET /api/v1/admin/payments/milestones/{id}/payments` — List payments for a milestone (admin)
- `POST /api/v1/admin/payments/milestones/{id}/release` — Confirm manual milestone payment (offline)
- `POST /api/v1/admin/payments/milestones/{id}/request-payment` — Request payment for milestone
- `POST /api/v1/admin/payments/projects/{projectId}/milestones` — Create milestones for a project
- `POST /api/v1/admin/payments/reconcile` — Reconcile payments with Razorpay
- `GET /api/v1/admin/payments/reconciliation` — Get payment reconciliation data
- `GET /api/v1/admin/payments/revenue/export` — Export revenue data
- `GET /api/v1/admin/payments/revenue/report` — Get revenue report
- `PATCH /api/v1/admin/payments/settings` — Update payment settings
- `GET /api/v1/admin/payments/stats` — Get payment statistics
- `GET /api/v1/admin/payments/{id}` — Get payment details (Admin)
- `POST /api/v1/admin/payments/{id}/approve-transfer` — Approve offline bank/UPI transfer
- `GET /api/v1/admin/payments/{id}/documents/versions` — List payment document versions (admin)
- `GET /api/v1/admin/payments/{id}/invoice` — Download payment invoice PDF (admin)
- `GET /api/v1/admin/payments/{id}/receipt` — Download payment receipt PDF (admin)
- `POST /api/v1/admin/payments/{id}/refund` — Process a refund
- `POST /api/v1/admin/payments/{id}/reject-transfer` — Reject offline bank/UPI transfer
- `GET /api/v1/admin/payments/{id}/timeline` — Get payment timeline
- `GET /api/v1/admin/payments/{id}/transactions` — Get transaction history for a payment
- `POST /api/v1/admin/payments/{id}/verify` — Verify a payment
- `GET /api/v1/admin/portfolio` — List portfolio items (admin)
- `POST /api/v1/admin/portfolio` — Create portfolio item (admin)
- `GET /api/v1/admin/portfolio/analytics` — Portfolio global analytics
- `GET /api/v1/admin/portfolio/analytics/{itemId}` — Portfolio item analytics
- `POST /api/v1/admin/portfolio/bulk-update` — Bulk update portfolio items (admin)
- `GET /api/v1/admin/portfolio/categories` — List portfolio categories
- `POST /api/v1/admin/portfolio/categories` — Create portfolio category
- `DELETE /api/v1/admin/portfolio/categories/{categoryId}` — Delete portfolio category
- `PATCH /api/v1/admin/portfolio/categories/{categoryId}` — Update portfolio category
- `POST /api/v1/admin/portfolio/reorder` — Reorder portfolio items
- `DELETE /api/v1/admin/portfolio/{id}` — Delete portfolio item (admin)
- `GET /api/v1/admin/portfolio/{id}` — Get portfolio item (admin)
- `PATCH /api/v1/admin/portfolio/{id}` — Update portfolio item (admin)
- `POST /api/v1/admin/portfolio/{id}/archive` — Archive portfolio item (admin)
- `POST /api/v1/admin/portfolio/{id}/duplicate` — Duplicate portfolio item (admin)
- `GET /api/v1/admin/portfolio/{id}/media` — List portfolio preview media (admin)
- `POST /api/v1/admin/portfolio/{id}/media` — Attach media to portfolio item (admin)
- `PATCH /api/v1/admin/portfolio/{id}/media/reorder` — Reorder portfolio item media (admin)
- `POST /api/v1/admin/portfolio/{id}/media/upload` — Upload portfolio preview media (admin)
- `DELETE /api/v1/admin/portfolio/{id}/media/{mediaId}` — Remove media from portfolio item (admin)
- `POST /api/v1/admin/portfolio/{id}/media/{mediaId}/featured-video` — Set featured showcase video (admin)
- `POST /api/v1/admin/portfolio/{id}/media/{mediaId}/thumbnail` — Set portfolio thumbnail image (admin)
- `PATCH /api/v1/admin/portfolio/{id}/privacy` — Update portfolio item privacy (admin)
- `POST /api/v1/admin/portfolio/{id}/publish` — Publish portfolio item (admin)
- `POST /api/v1/admin/portfolio/{id}/toggle-featured` — Toggle featured status (admin)
- `POST /api/v1/admin/portfolio/{id}/unpublish` — Unpublish portfolio item (admin)
- `GET /api/v1/admin/progress/projects/{projectId}` — List progress entries for project (admin)
- `POST /api/v1/admin/progress/projects/{projectId}` — Create progress entry (admin)
- `GET /api/v1/admin/progress/projects/{projectId}/analytics` — Get progress analytics for project
- `POST /api/v1/admin/progress/projects/{projectId}/complete` — Mark project complete (admin progress)
- `PATCH /api/v1/admin/progress/projects/{projectId}/status` — Update project status via progress admin (deprecated — prefer PATCH projects/:id/status)
- `GET /api/v1/admin/progress/projects/{projectId}/timeline` — Admin progress timeline
- `DELETE /api/v1/admin/progress/{entryId}` — Delete progress entry (admin)
- `PATCH /api/v1/admin/progress/{entryId}` — Update progress entry (admin)
- `GET /api/v1/admin/projects` — List all projects (admin)
- `POST /api/v1/admin/projects/from-template` — Create draft quote from project template
- `GET /api/v1/admin/projects/stats` — Get project stats
- `DELETE /api/v1/admin/projects/{id}` — Delete project (admin)
- `GET /api/v1/admin/projects/{id}` — Get project details (admin)
- `PATCH /api/v1/admin/projects/{id}` — Update project (admin)
- `GET /api/v1/admin/projects/{id}/analytics` — Get project analytics
- `POST /api/v1/admin/projects/{id}/archive` — Archive project
- `POST /api/v1/admin/projects/{id}/create-portfolio-draft` — Create portfolio draft from completed project
- `POST /api/v1/admin/projects/{id}/duplicate` — Duplicate project as template
- `GET /api/v1/admin/projects/{id}/duplicate-preview` — Preview project as duplicate template
- `POST /api/v1/admin/projects/{id}/export` — Export project
- `GET /api/v1/admin/projects/{id}/export/download` — Download latest project export (fresh signed URL)
- `POST /api/v1/admin/projects/{id}/extend` — Extend project deadline (admin)
- `GET /api/v1/admin/projects/{id}/portfolio-link` — Get linked portfolio status for a project
- `GET /api/v1/admin/projects/{id}/portfolio-preview` — Preview portfolio draft from completed project
- `PATCH /api/v1/admin/projects/{id}/status` — Override project status (admin)
- `GET /api/v1/admin/projects/{id}/status-history` — Project status change history (admin)
- `POST /api/v1/admin/projects/{id}/team` — Add team member to project
- `DELETE /api/v1/admin/projects/{id}/team/{memberId}` — Remove team member from project
- `POST /api/v1/admin/projects/{id}/unarchive` — Unarchive project
- `GET /api/v1/admin/projects/{projectId}/deliverables` — List deliverables for a project (admin)
- `POST /api/v1/admin/projects/{projectId}/deliverables` — Upload deliverable for a project (admin)
- `POST /api/v1/admin/projects/{projectId}/milestones` — Create a milestone for a project (admin)
- `GET /api/v1/admin/quotes` — List all quotes (Admin)
- `POST /api/v1/admin/quotes` — Create and issue a new quote
- `GET /api/v1/admin/quotes/line-item-library` — List reusable quote line-item blocks
- `POST /api/v1/admin/quotes/line-item-library` — Create a line-item library block
- `DELETE /api/v1/admin/quotes/line-item-library/{id}` — Deactivate a line-item library block
- `PATCH /api/v1/admin/quotes/line-item-library/{id}` — Update a line-item library block
- `GET /api/v1/admin/quotes/payment-schedule-presets` — List payment schedule presets
- `GET /api/v1/admin/quotes/stats` — Get overall quote statistics
- `GET /api/v1/admin/quotes/templates` — List quote templates (deprecated)
- `POST /api/v1/admin/quotes/templates` — Create quote template (removed)
- `DELETE /api/v1/admin/quotes/{id}` — Delete quote
- `GET /api/v1/admin/quotes/{id}` — Get quote administrative details
- `PATCH /api/v1/admin/quotes/{id}` — Update quote details (Admin)
- `GET /api/v1/admin/quotes/{id}/contract` — Download signed contract PDF (Admin)
- `GET /api/v1/admin/quotes/{id}/documents/versions` — List quote document versions (admin)
- `POST /api/v1/admin/quotes/{id}/duplicate` — Duplicate quote
- `POST /api/v1/admin/quotes/{id}/extend` — Extend quote validity
- `GET /api/v1/admin/quotes/{id}/history` — Get quote history
- `GET /api/v1/admin/quotes/{id}/pdf` — Get quote PDF metadata (Admin)
- `POST /api/v1/admin/quotes/{id}/resend` — Resend quote notification
- `POST /api/v1/admin/quotes/{id}/revise` — Create quote revision
- `POST /api/v1/admin/quotes/{id}/send` — Send quote to client
- `GET /api/v1/admin/reports` — List generated analytics reports
- `GET /api/v1/admin/reports/{id}/download` — Download analytics report
- `GET /api/v1/admin/requests` — List all requests (Admin)
- `GET /api/v1/admin/requests/capacity/dashboard` — Admin capacity usage dashboard
- `PATCH /api/v1/admin/requests/settings/capacity` — Update admin capacity settings
- `GET /api/v1/admin/requests/stats` — Get overall request statistics
- `DELETE /api/v1/admin/requests/{id}` — Delete request (Admin)
- `GET /api/v1/admin/requests/{id}` — Get request administrative details
- `PATCH /api/v1/admin/requests/{id}` — Update request details (Admin)
- `POST /api/v1/admin/requests/{id}/assign` — Assign request to staff
- `GET /api/v1/admin/requests/{id}/attachments/{attachmentId}/download` — Get attachment download URL (Admin)
- `GET /api/v1/admin/requests/{id}/notes` — List request notes
- `POST /api/v1/admin/requests/{id}/notes` — Add internal note
- `POST /api/v1/admin/requests/{id}/quotes` — Create quote from request
- `POST /api/v1/admin/requests/{id}/quotes/prefill` — Get quote prefill suggestions from a past quote
- `PATCH /api/v1/admin/requests/{id}/status` — Update request status (Admin)
- `GET /api/v1/admin/service-packages` — List all service packages (including inactive)
- `POST /api/v1/admin/service-packages` — Create or upsert service package
- `PATCH /api/v1/admin/service-packages/{id}` — Update service package by id
- `POST /api/v1/admin/system/announcements` — Send system announcement
- `POST /api/v1/admin/system/cache/clear` — Clear all system cache
- `POST /api/v1/admin/system/cache/clear/{key}` — Clear specific cache key
- `GET /api/v1/admin/system/config` — Get system configuration
- `PATCH /api/v1/admin/system/config` — Update system configuration
- `GET /api/v1/admin/system/email-templates` — List email templates
- `POST /api/v1/admin/system/email-templates` — Create or upsert email template by name
- `GET /api/v1/admin/system/email-templates/{id}` — Get email template
- `PATCH /api/v1/admin/system/email-templates/{id}` — Update email template
- `GET /api/v1/admin/system/email-templates/{id}/preview` — Preview email template
- `POST /api/v1/admin/system/email-templates/{id}/test` — Send test email
- `GET /api/v1/admin/system/features` — List feature flags (doc path: features)
- `PATCH /api/v1/admin/system/features/{flag}` — Toggle feature flag (doc param: flag)
- `GET /api/v1/admin/system/jobs` — List background jobs
- `DELETE /api/v1/admin/system/jobs/{id}` — Cancel job
- `POST /api/v1/admin/system/jobs/{id}/retry` — Retry failed job
- `GET /api/v1/admin/system/logs` — View system logs
- `GET /api/v1/admin/system/logs/download` — Download system logs
- `POST /api/v1/admin/system/maintenance` — Toggle maintenance mode
- `GET /api/v1/admin/templates` — Get notification templates (legacy path)
- `POST /api/v1/admin/templates` — Create notification template (legacy path)
- `DELETE /api/v1/admin/templates/{id}` — Delete notification template (legacy path)
- `PATCH /api/v1/admin/templates/{id}` — Update notification template (legacy path)
- `GET /api/v1/admin/time-entries` — List admin time entries
- `POST /api/v1/admin/time-entries` — Log admin time entry for a milestone
- `GET /api/v1/admin/users` — List all users (ADMIN only)
- `POST /api/v1/admin/users/bulk` — Bulk user operations
- `POST /api/v1/admin/users/impersonate/end/{sessionId}` — End impersonation
- `GET /api/v1/admin/users/logs` — List admin user-management audit logs
- `GET /api/v1/admin/users/logs/security-stats` — Get security statistics (users path)
- `GET /api/v1/admin/users/search` — Search users
- `GET /api/v1/admin/users/security-stats` — Security statistics (users path alias)
- `DELETE /api/v1/admin/users/sessions/{sessionId}` — Terminate specific user session
- `DELETE /api/v1/admin/users/{userId}` — Delete user account (soft delete)
- `GET /api/v1/admin/users/{userId}` — Get user details
- `PATCH /api/v1/admin/users/{userId}` — Update user (Admin)
- `GET /api/v1/admin/users/{userId}/activity` — Get user activity log
- `POST /api/v1/admin/users/{userId}/export` — Trigger user data export (GDPR)
- `POST /api/v1/admin/users/{userId}/force-password-reset` — Force password reset
- `POST /api/v1/admin/users/{userId}/impersonate` — Start impersonation session
- `POST /api/v1/admin/users/{userId}/reset-password` — Manually reset password
- `POST /api/v1/admin/users/{userId}/restore` — Restore user account
- `PATCH /api/v1/admin/users/{userId}/role` — Change user role
- `GET /api/v1/admin/users/{userId}/sessions` — Get user active sessions
- `PATCH /api/v1/admin/users/{userId}/status` — Change user status
- `POST /api/v1/admin/users/{userId}/terminate-all-sessions` — Terminate all user sessions
- `GET /api/v1/admin/webhooks` — List configured outgoing webhooks
- `POST /api/v1/admin/webhooks` — Register outgoing webhook
- `GET /api/v1/admin/webhooks/events` — List available webhook events
- `GET /api/v1/admin/webhooks/health` — Webhooks admin health
- `DELETE /api/v1/admin/webhooks/{id}` — Delete webhook configuration
- `GET /api/v1/admin/webhooks/{id}` — Get webhook configuration
- `PATCH /api/v1/admin/webhooks/{id}` — Update webhook configuration
- `GET /api/v1/admin/webhooks/{id}/deliveries` — Webhook delivery history
- `POST /api/v1/admin/webhooks/{id}/disable` — Disable webhook
- `POST /api/v1/admin/webhooks/{id}/enable` — Enable webhook
- `POST /api/v1/admin/webhooks/{id}/test` — Send test webhook delivery

## auth (13)

- `GET /api/v1/auth/check-email` — Check email availability (deprecated GET)
- `POST /api/v1/auth/check-email` — Check email availability
- `POST /api/v1/auth/forgot-password` — Forgot password
- `GET /api/v1/auth/health` — Service health check
- `POST /api/v1/auth/login` — User login
- `POST /api/v1/auth/logout` — Logout current session
- `POST /api/v1/auth/logout-all` — Logout all sessions
- `POST /api/v1/auth/refresh` — Refresh access token
- `POST /api/v1/auth/register` — Register new account
- `POST /api/v1/auth/resend-verification` — Resend verification email
- `POST /api/v1/auth/reset-password` — Reset password
- `POST /api/v1/auth/verify-2fa` — Verify 2FA code
- `POST /api/v1/auth/verify-email` — Verify email address

## blog (23)

- `GET /api/v1/blog/authors` — List blog authors
- `GET /api/v1/blog/authors/{id}` — Get author profile
- `GET /api/v1/blog/bookmarks` — List bookmarked posts
- `GET /api/v1/blog/categories` — List blog categories
- `GET /api/v1/blog/categories/{idOrSlug}` — Get category details
- `GET /api/v1/blog/feed/atom` — Get Atom feed
- `GET /api/v1/blog/feed/rss` — Get RSS feed
- `GET /api/v1/blog/posts` — List published blog posts
- `GET /api/v1/blog/posts/health` — Blog service health check
- `GET /api/v1/blog/posts/search` — Search blog posts
- `GET /api/v1/blog/posts/{slug}` — Get blog post by slug
- `DELETE /api/v1/blog/posts/{slug}/bookmark` — Remove bookmark from a post
- `POST /api/v1/blog/posts/{slug}/bookmark` — Bookmark a post
- `GET /api/v1/blog/posts/{slug}/comments` — Get post public comments
- `POST /api/v1/blog/posts/{slug}/comments` — Add a comment to a post
- `DELETE /api/v1/blog/posts/{slug}/comments/{commentId}` — Delete a comment on a post
- `PUT /api/v1/blog/posts/{slug}/comments/{commentId}` — Update a comment on a post
- `GET /api/v1/blog/posts/{slug}/engagement` — Get post engagement for current user
- `POST /api/v1/blog/posts/{slug}/like` — Like a post
- `GET /api/v1/blog/posts/{slug}/related` — Get related posts
- `POST /api/v1/blog/posts/{slug}/view` — Record post view
- `GET /api/v1/blog/tags` — List blog tags
- `GET /api/v1/blog/tags/{idOrSlug}` — Get tag details

## contact (6)

- `GET /api/v1/contact/inquiries` — List contact inquiries (Admin only)
- `POST /api/v1/contact/inquiries` — Submit contact inquiry (alias of POST /contact)
- `DELETE /api/v1/contact/inquiries/{id}` — Delete inquiry (Admin only)
- `GET /api/v1/contact/inquiries/{id}` — Get inquiry by ID (Admin only)
- `PATCH /api/v1/contact/inquiries/{id}` — Update inquiry status (Admin only)
- `POST /api/v1/contact/inquiries/{id}/respond` — Respond to inquiry (Admin only)

## documents (3)

- `GET /api/v1/documents/mine` — List documents issued to the current user
- `GET /api/v1/documents/mine/{documentId}/download` — Download a document issued to the current user
- `GET /api/v1/documents/verify/{documentNumber}` — Verify document authenticity (public)

## health (2)

- `GET /api/v1/health/dependencies` — Dependency health
- `GET /api/v1/health/services/{name}` — Check specific service health

## media (22)

- `GET /api/v1/media` — List user media
- `POST /api/v1/media/confirm` — Confirm upload (legacy alias)
- `POST /api/v1/media/direct-upload` — Direct upload (legacy alias)
- `GET /api/v1/media/health` — Media service health check
- `POST /api/v1/media/request` — Request upload (legacy alias)
- `GET /api/v1/media/shared` — List shared media
- `GET /api/v1/media/storage-stats` — Storage stats (legacy alias)
- `GET /api/v1/media/storage-usage` — Get storage stats
- `POST /api/v1/media/upload/chunked/{uploadId}/chunk` — Upload a chunk (legacy alias)
- `POST /api/v1/media/upload/confirm` — Confirm upload
- `POST /api/v1/media/upload/direct` — Direct upload
- `POST /api/v1/media/upload/request` — Request upload
- `DELETE /api/v1/media/{id}` — Delete media
- `GET /api/v1/media/{id}` — Get media details
- `PATCH /api/v1/media/{id}` — Update metadata
- `POST /api/v1/media/{id}/copy` — Copy media
- `GET /api/v1/media/{id}/download` — Get download URL
- `GET /api/v1/media/{id}/download-url` — Download URL (legacy alias)
- `POST /api/v1/media/{id}/move` — Move media
- `POST /api/v1/media/{id}/regenerate-thumbnail` — Regenerate thumbnail
- `GET /api/v1/media/{id}/status` — Get media processing status
- `GET /api/v1/media/{id}/versions` — List versions

## media-admin (1)

- `GET /api/v1/admin/media/storage/analytics` — Storage analytics (legacy path)

## messages (24)

- `GET /api/v1/messages` — List messages
- `POST /api/v1/messages` — Send message
- `GET /api/v1/messages/conversations` — List user conversations
- `GET /api/v1/messages/conversations/unread-count` — Get total unread message count
- `GET /api/v1/messages/health` — Messages service health check
- `GET /api/v1/messages/project/{projectId}` — List messages in a project thread
- `POST /api/v1/messages/project/{projectId}` — Send message (project alias)
- `GET /api/v1/messages/project/{projectId}/attachments` — List attachments
- `POST /api/v1/messages/project/{projectId}/read` — Mark project messages as read
- `GET /api/v1/messages/project/{projectId}/search` — Search project messages
- `GET /api/v1/messages/projects/{projectId}` — List project messages
- `POST /api/v1/messages/projects/{projectId}` — Send message (project)
- `POST /api/v1/messages/projects/{projectId}/read-all` — Mark project messages as read (Alias)
- `GET /api/v1/messages/search` — Search messages
- `GET /api/v1/messages/unread-count` — Get unread count
- `DELETE /api/v1/messages/{id}` — Delete message
- `GET /api/v1/messages/{id}` — Get message details
- `PATCH /api/v1/messages/{id}` — Edit message
- `POST /api/v1/messages/{id}/flag` — Flag message for moderation
- `POST /api/v1/messages/{id}/pin` — Pin message
- `POST /api/v1/messages/{id}/read` — Mark as read
- `POST /api/v1/messages/{id}/unpin` — Unpin message
- `GET /api/v1/messages/{messageId}/thread` — Get thread history
- `POST /api/v1/messages/{messageId}/thread` — Send thread reply

## notifications (11)

- `GET /api/v1/notifications` — Get current user notifications
- `DELETE /api/v1/notifications/clear-read` — Clear all read notifications
- `GET /api/v1/notifications/health` — Notifications service health check
- `GET /api/v1/notifications/history` — Get notification history
- `POST /api/v1/notifications/read-all` — Mark all notifications as read
- `POST /api/v1/notifications/read-selected` — Mark selected notifications as read
- `GET /api/v1/notifications/unread-count` — Get unread notification count
- `DELETE /api/v1/notifications/{id}` — Soft delete a notification
- `GET /api/v1/notifications/{id}` — Get a single notification
- `PATCH /api/v1/notifications/{id}/read` — Mark a notification as read
- `PATCH /api/v1/notifications/{id}/unread` — Mark a notification as unread

## payments (16)

- `GET /api/v1/payments` — List user payments
- `POST /api/v1/payments/bank-transfer/submit` — Submit offline bank/UPI transfer with receipt proof
- `POST /api/v1/payments/confirm` — Confirm a payment
- `POST /api/v1/payments/create-intent` — Create a payment intent
- `GET /api/v1/payments/health` — Payments service health check
- `POST /api/v1/payments/initiate` — Initiate a payment
- `GET /api/v1/payments/platform-accounts` — List active platform bank/UPI accounts for offline payment
- `GET /api/v1/payments/projects/{projectId}` — Get project payments
- `GET /api/v1/payments/projects/{projectId}/milestones` — Get payment milestones for project
- `GET /api/v1/payments/stats` — Get user payment statistics
- `GET /api/v1/payments/{id}` — Get payment details
- `POST /api/v1/payments/{id}/cancel` — Cancel a pending payment
- `POST /api/v1/payments/{id}/dispute` — File a payment dispute
- `GET /api/v1/payments/{id}/invoice` — Download payment invoice
- `GET /api/v1/payments/{id}/receipt` — Download payment receipt
- `GET /api/v1/payments/{id}/status` — Check payment status

## progress (11)

- `POST /api/v1/progress/deliverables/{id}/approve` — Approve a deliverable (client)
- `POST /api/v1/progress/deliverables/{id}/reject` — Reject a deliverable (client)
- `GET /api/v1/progress/health` — Progress service health check
- `POST /api/v1/progress/milestones/{id}/approve` — Approve a milestone (client)
- `POST /api/v1/progress/milestones/{id}/request-revision` — Request revision on a milestone (client)
- `GET /api/v1/progress/projects/{projectId}` — Get progress timeline for a project
- `POST /api/v1/progress/projects/{projectId}` — Create a progress entry for a project
- `GET /api/v1/progress/projects/{projectId}/milestones` — Get milestone progress for project
- `POST /api/v1/progress/projects/{projectId}/request-changes` — Request revisions on project progress
- `GET /api/v1/progress/projects/{projectId}/status` — Get overall project status summary
- `GET /api/v1/progress/projects/{projectId}/{entryId}` — Get single progress entry

## projects (19)

- `GET /api/v1/projects` — List my projects
- `GET /api/v1/projects/by-quote/{quoteId}` — Get project by quote ID
- `GET /api/v1/projects/health` — Service health check
- `GET /api/v1/projects/public` — List public projects (portfolio discovery)
- `GET /api/v1/projects/public/{publicId}` — Get public project details by id or slug
- `GET /api/v1/projects/stats` — Get user project statistics
- `GET /api/v1/projects/{id}` — Get project details
- `POST /api/v1/projects/{id}/approve` — Approve project
- `GET /api/v1/projects/{id}/deliverables` — Get project deliverables
- `GET /api/v1/projects/{id}/feedback` — Get project feedback
- `POST /api/v1/projects/{id}/feedback` — Submit project feedback
- `GET /api/v1/projects/{id}/messages` — Get project messages
- `POST /api/v1/projects/{id}/messages` — Send message to project
- `GET /api/v1/projects/{id}/milestones` — Get project milestones
- `GET /api/v1/projects/{id}/payments` — Get project payments
- `GET /api/v1/projects/{id}/progress` — Get project progress summary
- `POST /api/v1/projects/{id}/request-revision` — Request project revision
- `POST /api/v1/projects/{id}/sign-contract` — Sign project contract before deposit
- `GET /api/v1/projects/{id}/timeline` — Get project timeline

## quotes (8)

- `GET /api/v1/quotes` — List my quotes
- `GET /api/v1/quotes/health` — Service health check
- `GET /api/v1/quotes/stats` — Get user quote statistics
- `GET /api/v1/quotes/{id}` — Get quote details
- `POST /api/v1/quotes/{id}/accept` — Accept quote
- `POST /api/v1/quotes/{id}/decline` — Decline quote
- `GET /api/v1/quotes/{id}/pdf` — Download quote PDF
- `POST /api/v1/quotes/{id}/request-changes` — Request quote changes

## requests (14)

- `GET /api/v1/requests` — List my requests
- `POST /api/v1/requests` — Create a new request
- `GET /api/v1/requests/health` — Service health check
- `GET /api/v1/requests/stats` — Get user request statistics
- `DELETE /api/v1/requests/{id}` — Delete request
- `GET /api/v1/requests/{id}` — Get request details
- `PATCH /api/v1/requests/{id}` — Update request
- `GET /api/v1/requests/{id}/attachments` — List request attachments
- `POST /api/v1/requests/{id}/attachments` — Upload attachment
- `DELETE /api/v1/requests/{id}/attachments/{attachmentId}` — Delete attachment
- `GET /api/v1/requests/{id}/attachments/{attachmentId}/download` — Get attachment download URL
- `GET /api/v1/requests/{id}/quotes` — Get quotes for a request
- `GET /api/v1/requests/{id}/status` — Get request status timeline
- `POST /api/v1/requests/{id}/submit` — Submit request for review

## users (29)

- `GET /api/v1/users/2fa/backup-codes` — Get 2FA backup codes
- `POST /api/v1/users/2fa/disable` — Disable 2FA
- `POST /api/v1/users/2fa/enable` — Initiate 2FA setup
- `POST /api/v1/users/2fa/regenerate-codes` — Regenerate 2FA backup codes
- `POST /api/v1/users/2fa/setup` — Start 2FA setup (alias of 2fa/enable)
- `GET /api/v1/users/2fa/status` — Get 2FA status
- `POST /api/v1/users/2fa/verify` — Verify and finalize 2FA
- `POST /api/v1/users/2fa/verify-setup` — Complete 2FA setup (alias of 2fa/verify)
- `GET /api/v1/users/activity` — Get user activity log
- `DELETE /api/v1/users/avatar` — Remove avatar
- `POST /api/v1/users/avatar` — Upload avatar
- `POST /api/v1/users/cancel-deletion` — Cancel deletion request
- `POST /api/v1/users/change-password` — Change password (POST)
- `GET /api/v1/users/dashboard-summary` — Aggregated client dashboard data
- `GET /api/v1/users/data-export` — Request data export (alias)
- `POST /api/v1/users/delete-account` — Request account deletion
- `GET /api/v1/users/export` — Request data export
- `GET /api/v1/users/export/{id}` — Download data export
- `GET /api/v1/users/health` — Health check
- `POST /api/v1/users/logout` — Logout current session
- `PATCH /api/v1/users/password` — Change password
- `GET /api/v1/users/preferences` — Get user preferences
- `PATCH /api/v1/users/preferences` — Update user preferences
- `GET /api/v1/users/profile` — Get current user profile
- `PATCH /api/v1/users/profile` — Update profile
- `GET /api/v1/users/sessions` — List active sessions
- `POST /api/v1/users/sessions/terminate-others` — Terminate all other sessions
- `DELETE /api/v1/users/sessions/{sessionId}` — Terminate specific session
- `GET /api/v1/users/sessions/{sessionId}` — Get session details

## webhooks (5)

- `POST /api/v1/webhooks/cloudflare` — Cloudflare CDN webhook endpoint
- `POST /api/v1/webhooks/github` — GitHub webhook endpoint
- `GET /api/v1/webhooks/health` — Webhooks service health check
- `POST /api/v1/webhooks/inbound/{provider}` — Generic webhook endpoint for any provider
- `POST /api/v1/webhooks/stripe` — Stripe webhook endpoint (disabled)

