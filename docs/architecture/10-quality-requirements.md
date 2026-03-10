# arc42 – Chapter 10: Quality Requirements

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 10.1 Quality Tree

```
Newsletter AI Assistant Quality
│
├── Security (priority 1)
│   ├── Credential protection (SE-01, SE-02)
│   ├── SSRF prevention (SE-03)
│   ├── XSS prevention (SE-04)
│   ├── GDPR/AVG compliance (SE-05)
│   └── Dependency hygiene (SE-06)
│
├── Reliability (priority 2)
│   ├── Fault isolation per integration (RE-02, RE-03, RE-04)
│   ├── Session state durability (RE-05)
│   └── Uptime ≥ 99.5 % business hours (RE-01)
│
├── Usability (priority 3)
│   ├── Onboarding ≤ 30 minutes (US-01)
│   ├── Keyboard operability (US-04)
│   ├── Responsive desktop layout (US-05)
│   └── Accessible (WCAG 2.1 AA) (AC-01 – AC-04)
│
├── Maintainability (priority 4)
│   ├── TypeScript strict mode (MA-01)
│   ├── Single-responsibility components ≤ 300 lines (MA-02)
│   ├── Developer onboarding ≤ 15 minutes (MA-03)
│   ├── Env-var configuration (MA-04)
│   └── ESLint zero errors in CI (MA-05)
│
└── Performance (priority 5)
    ├── LCP ≤ 2 s (PF-01)
    ├── Tab switch ≤ 300 ms (PF-02)
    ├── RSS refresh ≤ 5 s (PF-03)
    ├── AI categorisation ≤ 30 s / 200 items (PF-04)
    ├── AI draft generation ≤ 10 s / article (PF-05)
    └── CMS publish ≤ 5 s (PF-06)
```

---

## 10.2 Quality Scenarios

### Security

| ID | Stimulus | Response | Metric |
|----|---------|----------|--------|
| QS-SEC-01 | Developer accidentally prefixes `JOOMLA_API_KEY` with `NEXT_PUBLIC_` | ESLint rule or code review catches it; CI build fails | Never exposed in browser |
| QS-SEC-02 | Editor submits an RSS URL pointing to an internal IP address | Server rejects the URL with validation error; no HTTP request made | 0 SSRF requests |
| QS-SEC-03 | AI service returns a draft containing a `<script>` tag | React JSX rendering escapes the tag; no script executes in browser | 0 XSS incidents |

### Reliability

| ID | Stimulus | Response | Metric |
|----|---------|----------|--------|
| QS-REL-01 | One of 10 RSS feed URLs times out during refresh | Other 9 feeds update normally; broken feed shows error indicator | No full-page crash |
| QS-REL-02 | AI service returns HTTP 503 during draft generation | Individual draft shows error state; other drafts generate normally; manual edit enabled | Graceful degradation |
| QS-REL-03 | Joomla API returns HTTP 500 during publish | Article remains in queue with "Failed" status and error message; draft content intact; Retry available | 0 data loss |
| QS-REL-04 | Editor navigates from Draft tab to RSS tab and back | All draft edits, approval states, and dirty flags are unchanged | 100 % state preserved |

### Performance

| ID | Stimulus | Response | Metric |
|----|---------|----------|--------|
| QS-PF-01 | Editor opens the application on a 25 Mbps connection | First contentful paint and LCP complete | LCP ≤ 2 s |
| QS-PF-02 | Editor clicks the "Selection" tab | Tab content renders from React state | ≤ 300 ms, no network call |
| QS-PF-03 | Editor triggers RSS refresh with 10 active feeds | All feeds polled in parallel; results displayed | ≤ 5 s total |
| QS-PF-04 | Editor opens Draft tab with 10 selected items | All 10 drafts generated concurrently | Each draft ≤ 10 s |

### Usability / Accessibility

| ID | Stimulus | Response | Metric |
|----|---------|----------|--------|
| QS-USA-01 | New editor, no prior AI tool experience, starts the application | Completes full workflow (select → draft → publish) without help | ≤ 30 minutes |
| QS-ACC-01 | Editor using only keyboard navigates through entire workflow | All interactive elements reachable and operable via Tab / Enter / Space | Full keyboard operability |
| QS-ACC-02 | Automated accessibility scan run post-build | No WCAG 2.1 AA violations | 0 axe-core errors |
