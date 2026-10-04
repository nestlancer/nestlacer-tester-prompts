# S12 — AI-era prompt-injection and untrusted-content resilience

**Priority:** P1  
**Role:** AI-era application security tester  
**Scope:** Defend the app against modern untrusted-content attacks, including prompt-injection-style content, malicious Markdown/HTML, poisoned documents and unsafe automation. Run now for content surfaces, and rerun if any AI/LLM feature is added.

## Pair with existing prompts

- P02, P10, P13, P14, P16, P32, P33, P34, P36, P37, P44, P47
- A07, A08, A09, A10, A15, A18, A19

## Mandatory checks

1. Identify every place untrusted text/content enters the system: contact forms, requests, quote notes, project updates, messages, comments, blog/portfolio CMS, notification templates, email templates, filenames, media metadata, PDF/export content and webhook payloads.
2. Store inert prompt-injection-style strings in demo records, such as content that tells a future assistant to ignore instructions, reveal secrets, click links, approve payments or change permissions. Verify the application treats it as plain content only.
3. Verify malicious Markdown/HTML/links/images are sanitized or rendered safely in web UI, admin UI, emails, PDFs, notifications and exports.
4. Verify admins are warned or protected when viewing untrusted external content, files or URLs.
5. Verify no automation/tooling executes user-provided instructions from messages/documents/webhooks/templates without explicit operator approval.
6. If an AI/LLM feature exists, test that it cannot access secrets, execute admin/payment actions, bypass RBAC, follow external instructions from user content, or leak hidden prompts/system data.
7. Verify logs/debug panels do not feed sensitive context back into user-visible summaries or generated outputs.
8. Verify outbound links from untrusted content use safe attributes/policies and cannot perform open redirects or credential capture through trusted-looking UI.

## Safety boundaries

Do not create real phishing pages, credential harvesters or malware. Use clearly labeled inert test strings in demo records only.

## Output

```markdown
# Result — S12 AI-era/untrusted-content resilience

## Untrusted-content ledger
| Source | Rendered/processed in | Test class | Expected | Actual | Verdict |
|---|---|---|---|---|---|

## AI/tooling safety ledger
| Feature/automation | Untrusted instruction attempted | Expected | Actual | Verdict |
|---|---|---|---|---|

## Findings
...
```
