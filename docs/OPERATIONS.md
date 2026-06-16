# Early Pregnancy Tracking App — Operations & User Guide

## Overview

This document explains how the application works from the perspective of each user type, and gives practical steps admins need to manage content and respond to users. It is written for: Super Admins, Admins, Authenticated Users, and Anonymous Users.

## Roles & Permissions

- Super Admin: full backend access and the ability to bootstrap/administer other admin accounts.
- Admin: manages educational content, FAQs, videos, goals, health services, user accounts and responds to chats.
- Authenticated User: signed-in app user (patient) who can set goals, view educational material, and contact admins.
- Anonymous User: non-signed-in user who can access public materials and use the anonymous chat to reach admins.

## Quick Navigation (where to find things in the app)

- Admin interface screens (example names used in the codebase): `AdminManagementScreen`, `AdminTopicsScreen`, `AdminFaqsScreen`, `AdminChatDetailScreen`, `AdminTopicsScreen`.
- Public / consumer screens: `LoginScreen`, `DashboardScreen`, `FAQScreen`, `EducationalLibraryScreen`, `GoalsScreen`, `AnonymousChatScreen`.

If you need to inspect UI code, look under the mobile/web `src/screens` folders for the screens above.

## Admin Guide — Managing Content

1. Authentication and Access
   - Sign in via the app's admin login (`LoginScreen`). Super Admins may need initial provisioning (see backend bootstrap script).

2. Dashboard & Overview
   - After signing in, visit the Admin Dashboard (`AdminManagementScreen`) to see recent activity, new chats, and quick links to content areas.

3. Topics & Educational Content
   - Navigate to `AdminTopicsScreen` to create, edit, or delete educational topics.
   - Typical steps to add a topic: Title → Summary → Full Content (rich text/markdown) → Tags/Category → Save/Publish.
   - Use tagging and clear categorization so consumers can easily discover content in the library.

4. FAQs
   - Use `AdminFaqsScreen` to add or update frequently asked questions and answers.
   - Keep answers concise, link to supporting topics or videos, and mark status (draft/published) if the UI supports it.

5. Videos & Embedded Videos
   - Add new video entries (hosted or embedded) in the Videos/Embedded Videos area.
   - Provide title, duration, short description and relevant topic tags.

6. Goals & Quizzes
   - Create, edit or remove goal templates and quizzes so users can set measurable objectives.

7. Health Services & Resource Entries
   - Manage external resources (clinics, hotlines, partner services) that appear in the Health Services section.
   - Include contact phone/email, hours, and short descriptions.

8. Uploads & Media
   - Use the Uploads/Media area to add images, PDFs or other attachments used by content and chat.
   - Validate file types and sizes before publishing.

9. User Management
   - Search for users, view profile details, and update account status (activate/suspend) from the Users section.
   - For privacy-sensitive issues, follow your organization's data-retention and incident procedures.

10. Content Publishing Workflow (recommended)
   - Draft → Review (peer/admin) → Publish → Monitor feedback and metrics.
   - Keep a small changelog or notes field on content to track edits and publish dates.

## Admin Guide — Chat & Responding to Users

1. Incoming chats
   - Incoming messages from users appear in the Admin Chat list. Anonymous users create chat sessions that admins can reply to.

2. Opening a conversation
   - Open the conversation in `AdminChatDetailScreen`. Messages are displayed in chronological order.

3. Replying
   - Type and send responses directly from the chat detail view. Attach files if supported by the UI.

4. Session lifecycle
   - Mark the conversation as resolved/closed when the user's query is complete (if the UI supports status flags).
   - If a user is identified and has an account, link the chat to their profile for future reference.

5. Escalation
   - If a chat requires escalation (clinical or legal), follow internal escalation procedures and involve Super Admins or designated staff.

6. Privacy and safety
   - Never request unnecessary personal or identifying information in chat. For sensitive medical issues, provide links to local services and encourage contacting professional help.

## How Other Users Reach Admins

- In-app Chat: Primary channel. Authenticated and anonymous users can start chats from `AnonymousChatScreen` or an in-app messaging entry point.
- Help / Contact: A 'Help' or 'Contact Admin' option in the app should open a chat or message form.
- Health Services & Resource Links: Users can call or email listed partners directly from resource cards.

Recommended message flow for users:
1. Open Chat (or Help) → 2. Describe issue briefly → 3. Attach any relevant files/screenshots → 4. Submit and wait for admin reply.

Note: Encourage users to create an account if they want persistent chat history and personalized follow-up.

## User Guide — Authenticated Users

1. Signing in
   - Use `LoginScreen` to sign in with your credentials.

2. Dashboard
   - View your goals, recent educational content, and quick links to chat and help.

3. Library & Learning
   - Access `EducationalLibraryScreen` for topics, videos and FAQs. Use search and filters to find content.

4. Goals
   - Create personal goals in `GoalsScreen`. Update progress and mark milestones.

5. Chat
   - Start a chat from the Help or Chat entry point to reach admins. Your identity is attached to the conversation for follow-up.

6. Profile & Settings
   - Edit your profile (name, contact methods). Adjust notification preferences so you receive admin responses.

## User Guide — Anonymous Users

1. Accessing content
   - Most educational content and FAQs are accessible without an account.

2. Anonymous chat
   - Use `AnonymousChatScreen` to start a private session with admins. Sessions may be stored as anonymous threads.

3. Convert to authenticated
   - If you want persistent history or follow-up, sign up or log in so admins can re-contact you later.

## Data, Privacy & Safety (short)

- Personal data: Only collect the minimum required. Prefer linking to local services rather than collecting sensitive clinical details in chat.
- Data retention: Follow your organization's policy for how long chats and user data are stored.
- Security: Admins should use strong passwords and MFA (if supported). Protect admin credentials and limit role assignment.

## Troubleshooting (common admin/user issues)

- Missing chat messages: Check server logs and delivery queue; confirm network connectivity.
- Media upload failures: Verify file size and allowed types; retry upload.
- User cannot log in: Confirm credentials; reset password; check if account is suspended.

## Developer / Admin Quick Links

- Backend routes (examples): `routes/chat.ts`, `routes/education.ts`, `routes/embeddedVideos.ts`, `routes/goals.ts`, `routes/healthServices.ts`, `routes/users.ts` — check `backend/src/routes` for implementations.
- Admin UI screens: look under the app `src/screens` folders for files named above (e.g. `AdminChatDetailScreen.tsx`, `AdminTopicsScreen.tsx`).