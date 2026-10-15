---
name: factory
description: Run the software factory end to end on one task (spec, build in a worktree, concurrent security/code/UI reviews, approve or escalate). Use for /factory feature "<description>", /factory next (top of factory/backlog.md), or /factory approve <job-id>.
argument-hint: feature "<description>" | next | approve <job-id>
disable-model-invocation: true
---

# Factory Orchestrator Skill

Execute complete end-to-end software factory workflows using sub-agents, worktrees, and strict review gates.

## Usage
- `/factory feature "<feature description>"`: Run factory workflow on a custom request.
- `/factory next`: Pick and process the top pending item from `factory/backlog.md`.
- `/factory approve <job-id>`: Manually resolve an escalated job and finish the merge.

## Workflow Orchestration Sequence

1. **Initialization**:
   - Generate a unique `<job-id>` (timestamp or slug, e.g., `job-20261009-001`).
   - Create job directory: `factory/jobs/<job-id>/` and subfolder `factory/jobs/<job-id>/reviews/`.
   - Update `factory/dashboard.md` state to `IN_PROGRESS`.
   - Create and switch to a dedicated Git branch/worktree: `git worktree add factory/jobs/<job-id>/workspace -b factory/<job-id>`.

2. **Phase 1: Technical Spec Generation**:
   - Delegate task to `@spec-writer`.
   - Wait for creation of `factory/jobs/<job-id>/spec.md`.

3. **Phase 2: Code Implementation**:
   - Delegate task to `@builder` operating inside `factory/jobs/<job-id>/workspace`.
   - Builder writes code, creates tests, and writes output to `factory/jobs/<job-id>/build-log.md`.

4. **Phase 3: Concurrent Code Review**:
   - Trigger review sub-agents concurrently:
     - `@reviewer-security` -> `factory/jobs/<job-id>/reviews/security.md`
     - `@reviewer-code` -> `factory/jobs/<job-id>/reviews/code-quality.md`
     - `@reviewer-ui-ux` -> `factory/jobs/<job-id>/reviews/ui-ux.md`

5. **Phase 4: Automated Merge / Escalation**:
   - Delegate decision to `@approver`.
   - Update `factory/dashboard.md` with final decision (`COMPLETED`, `NEEDS_HUMAN_REVIEW`, `FAILED`).
