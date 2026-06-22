---
name: staff-engineer
description: Engineering standards and practices for Staff+ engineers at elite startups. Apply when writing production code, reviewing PRs, designing systems, making architectural decisions, or mentoring. Emphasizes correctness, simplicity, maintainability, and technical excellence.
version: "1.0.0"
---

# Staff Engineer Standards

Engineering principles and practices for Staff+ engineers at top-tier startups like Anthropic, Stripe, Linear, and Vercel. These guidelines represent the bar for production code at companies where engineering excellence is a competitive advantage.

## When to Apply

Use these standards when:
- Writing any production code
- Reviewing pull requests
- Designing new systems or features
- Making architectural decisions
- Debugging complex issues
- Mentoring other engineers
- Writing technical documentation

---

## 1. Code Quality & Craftsmanship

### 1.1 Write Code for Readers, Not Writers

Code is read 10x more than it's written. Optimize for comprehension.

**Principles:**
- Names should reveal intent: `remainingRetries` not `r` or `count`
- Functions should do one thing and do it well
- Avoid clever code; prefer boring, obvious code
- If you need a comment to explain what code does, the code should be clearer
- Comments explain *why*, not *what*

**Bad:**
```typescript
const d = data.filter(x => x.s === 'a' && x.t > Date.now() - 86400000)
```

**Good:**
```typescript
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const oneDayAgo = Date.now() - ONE_DAY_MS

const activeRecentUsers = users.filter(user => 
  user.status === 'active' && user.lastLoginAt > oneDayAgo
)
```

### 1.2 Make Invalid States Unrepresentable

Use the type system to prevent bugs at compile time.

**Bad:**
```typescript
interface ApiResponse {
  data: User | null
  error: string | null
  loading: boolean
}
// Allows invalid states: { data: user, error: "failed", loading: true }
```

**Good:**
```typescript
type ApiResponse = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error }
```

### 1.3 Fail Fast and Loud

Errors should be impossible to ignore. Silent failures cause cascading bugs.

**Principles:**
- Validate inputs at system boundaries
- Throw on unexpected states rather than returning defaults
- Use assertions liberally in development
- Never swallow errors silently

**Bad:**
```typescript
function getUser(id: string): User | null {
  try {
    return db.users.find(id)
  } catch {
    return null // Hides database errors, network issues, etc.
  }
}
```

**Good:**
```typescript
function getUser(id: string): User {
  if (!id || typeof id !== 'string') {
    throw new Error(`Invalid user id: ${id}`)
  }
  
  const user = db.users.find(id)
  
  if (!user) {
    throw new NotFoundError(`User not found: ${id}`)
  }
  
  return user
}
```

### 1.4 Prefer Pure Functions

Pure functions are easier to test, reason about, and parallelize.

**Principles:**
- Same inputs always produce same outputs
- No side effects (no mutation, no I/O)
- Dependencies passed as arguments, not imported globals
- Isolate impure code at the edges of your system

**Bad:**
```typescript
let requestCount = 0

function processRequest(data: RequestData) {
  requestCount++ // Side effect
  const config = getGlobalConfig() // Hidden dependency
  return transform(data, config)
}
```

**Good:**
```typescript
function processRequest(data: RequestData, config: Config): Result {
  return transform(data, config)
}

// Impure shell at the edge
async function handleRequest(req: Request) {
  const config = await loadConfig()
  const result = processRequest(req.body, config)
  metrics.increment('requests') // Side effects isolated here
  return result
}
```

### 1.5 Small, Focused Pull Requests

Large PRs don't get reviewed well. Ship small, incremental changes.

**Guidelines:**
- < 400 lines of meaningful changes (excluding tests, generated code)
- One logical change per PR
- If you can split it, split it
- Stack PRs when building large features
- Refactoring PRs should be separate from feature PRs

---

## 2. System Design & Architecture

### 2.1 Start Simple, Evolve as Needed

Don't architect for hypothetical scale. Build for today, design for change.

**Principles:**
- YAGNI (You Aren't Gonna Need It)
- Prefer boring technology you understand
- Add abstraction when you feel pain, not before
- Optimize after measuring, not before

**Anti-patterns:**
- Microservices for a 3-person team
- Event sourcing for a CRUD app
- Kubernetes for a single service
- GraphQL when you have one client

### 2.2 Design for Failure

Everything fails eventually. Plan for it.

**Principles:**
- Timeouts on all external calls (and internal ones across boundaries)
- Retry with exponential backoff and jitter
- Circuit breakers for cascading failure prevention
- Graceful degradation over hard failures
- Idempotent operations where possible

**Essential patterns:**
```typescript
// Always set timeouts
const response = await fetch(url, { 
  signal: AbortSignal.timeout(5000) 
})

// Retry with backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 100
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      const jitter = Math.random() * delay * 0.1
      await sleep(delay + jitter)
    }
  }
  throw new Error('Unreachable')
}
```

### 2.3 Make Dependencies Explicit

Hidden dependencies make code hard to understand, test, and change.

**Principles:**
- Inject dependencies, don't import singletons
- Configuration passed explicitly, not read from environment mid-function
- Side effects declared in function signatures (async, throws)
- Database/network access obvious from call site

### 2.4 Design APIs for Consumers

APIs should be hard to misuse. Guide users toward success.

**Principles:**
- Required parameters should be required in the type signature
- Sensible defaults for optional parameters
- Impossible to call in invalid order (builder pattern when needed)
- Error messages should tell users how to fix the problem
- Breaking changes require major version bumps

---

## 3. Testing Philosophy

### 3.1 Test Behavior, Not Implementation

Tests should survive refactoring. They verify *what*, not *how*.

**Bad:**
```typescript
test('processOrder calls validateOrder then calculateTotal', () => {
  const validateSpy = jest.spyOn(service, 'validateOrder')
  const calculateSpy = jest.spyOn(service, 'calculateTotal')
  
  service.processOrder(order)
  
  expect(validateSpy).toHaveBeenCalledBefore(calculateSpy)
})
```

**Good:**
```typescript
test('processOrder returns total for valid orders', () => {
  const order = createOrder({ items: [{ price: 100, quantity: 2 }] })
  
  const result = service.processOrder(order)
  
  expect(result.total).toBe(200)
})

test('processOrder rejects orders with no items', () => {
  const order = createOrder({ items: [] })
  
  expect(() => service.processOrder(order)).toThrow('Order must have items')
})
```

### 3.2 The Testing Pyramid

More unit tests, fewer integration tests, even fewer E2E tests.

**Distribution:**
- **Unit tests (70%)**: Fast, isolated, test logic
- **Integration tests (20%)**: Test component boundaries, database queries
- **E2E tests (10%)**: Critical user paths only

**Unit test characteristics:**
- Run in < 10ms each
- No I/O (network, disk, database)
- Deterministic (no flaky tests)
- Test one thing

### 3.3 Test Edge Cases and Error Paths

Happy path testing catches < 50% of bugs.

**Always test:**
- Empty inputs (null, undefined, [], "")
- Boundary values (0, -1, MAX_INT)
- Error conditions and recovery
- Concurrent access patterns
- Timeout and cancellation
- Unicode and special characters

### 3.4 Tests as Documentation

Tests should demonstrate how to use the code.

```typescript
describe('RateLimiter', () => {
  it('allows requests under the limit', () => {
    const limiter = new RateLimiter({ maxRequests: 10, windowMs: 1000 })
    
    for (let i = 0; i < 10; i++) {
      expect(limiter.tryAcquire('user-1')).toBe(true)
    }
  })

  it('rejects requests over the limit', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 1000 })
    
    limiter.tryAcquire('user-1')
    limiter.tryAcquire('user-1')
    
    expect(limiter.tryAcquire('user-1')).toBe(false)
  })

  it('resets after the time window', async () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 100 })
    
    limiter.tryAcquire('user-1')
    expect(limiter.tryAcquire('user-1')).toBe(false)
    
    await sleep(150)
    
    expect(limiter.tryAcquire('user-1')).toBe(true)
  })
})
```

---

## 4. Code Review Standards

### 4.1 What to Look For

**Correctness:**
- Does it do what it's supposed to do?
- Are edge cases handled?
- Are errors handled appropriately?
- Are there race conditions or deadlocks?

**Security:**
- Input validation at boundaries
- No SQL injection, XSS, CSRF vulnerabilities
- Secrets not logged or exposed
- Proper authentication/authorization checks

**Performance:**
- No N+1 queries
- Appropriate indexing for queries
- No unnecessary work in hot paths
- Memory leaks (event listeners, subscriptions)

**Maintainability:**
- Could a new team member understand this?
- Is it tested appropriately?
- Does it follow project conventions?
- Is the abstraction level right?

### 4.2 How to Give Feedback

**Be specific and actionable:**

❌ "This is confusing"  
✅ "This function does three things: validation, transformation, and persistence. Consider splitting into validateOrder(), transformOrder(), and saveOrder() to make each step clear and testable."

**Distinguish severity:**
- `nit:` - Minor style preference, feel free to ignore
- `suggestion:` - Improvement idea, not blocking
- `question:` - Need clarification to review properly
- `blocker:` - Must be addressed before merge

**Praise good work:**
- "Nice catch handling the race condition here"
- "This abstraction will make the feature work cleaner"
- "Good test coverage on the edge cases"

### 4.3 Respond to Reviews Gracefully

- Assume good intent
- Explain your reasoning, don't just defend
- "Will fix" is a valid response
- Push back thoughtfully on suggestions you disagree with
- Resolve threads when addressed

---

## 5. Debugging & Incident Response

### 5.1 Systematic Debugging

**The scientific method:**
1. Observe the symptoms precisely
2. Form a hypothesis about the cause
3. Design an experiment to test it
4. Run the experiment
5. Analyze results, refine hypothesis
6. Repeat until root cause found

**Common mistakes:**
- Changing multiple things at once
- Not reading the actual error message
- Assuming you know the cause without evidence
- Not checking the obvious things first

### 5.2 Effective Logging

```typescript
// Include context for debugging
logger.error('Payment processing failed', {
  userId: user.id,
  orderId: order.id,
  amount: order.total,
  paymentMethod: order.paymentMethod,
  errorCode: error.code,
  errorMessage: error.message,
  // Never log: full card numbers, passwords, tokens
})
```

**Log levels:**
- `error` - Something broke, needs attention
- `warn` - Something unexpected, but handled
- `info` - Significant business events
- `debug` - Detailed flow for debugging (off in prod)

### 5.3 Incident Response

**During an incident:**
1. Acknowledge and communicate (status page, Slack)
2. Assess blast radius and severity
3. Mitigate first, root cause later
4. Keep stakeholders updated
5. Document as you go

**After an incident:**
- Blameless postmortem within 48 hours
- Focus on systemic fixes, not individual blame
- Action items with owners and deadlines
- Share learnings broadly

---

## 6. Technical Leadership

### 6.1 Make Decisions, Document Reasoning

**Use ADRs (Architecture Decision Records):**
```markdown
# ADR-001: Use PostgreSQL for primary database

## Status
Accepted

## Context
We need a database for user data and transactions.

## Decision
Use PostgreSQL.

## Consequences
- Strong ACID guarantees for financial data
- Team has existing expertise
- Hosting available on all major clouds
- Will need to manage connection pooling at scale
```

### 6.2 Unblock Others

Your multiplier effect matters more than your individual output.

**Staff+ responsibilities:**
- Review PRs within 24 hours (4 hours for small ones)
- Answer questions in public channels (helps everyone)
- Write documentation for decisions and systems
- Pair with struggling teammates
- Remove technical roadblocks proactively

### 6.3 Technical Communication

**Writing for different audiences:**
- **Engineers**: Technical depth, specific details, code examples
- **Product/Design**: Capabilities, constraints, tradeoffs in plain language
- **Leadership**: Business impact, timelines, risks, resource needs

**RFC structure:**
1. Problem statement (1 paragraph)
2. Proposed solution (1-2 pages)
3. Alternatives considered
4. Risks and mitigations
5. Timeline and milestones

---

## 7. Performance & Scalability

### 7.1 Measure Before Optimizing

**Profile, don't guess:**
```typescript
// Use real profiling tools
console.time('operation')
await expensiveOperation()
console.timeEnd('operation')

// Better: structured performance tracking
const start = performance.now()
await expensiveOperation()
metrics.histogram('operation_duration_ms', performance.now() - start)
```

### 7.2 Know Your Complexity

**Common operations to analyze:**
- Database queries (N+1 problems, missing indexes)
- Loop iterations (nested loops = O(n²))
- Memory allocations (object creation in hot loops)
- Network round trips (batching opportunities)

### 7.3 Caching Strategy

**Cache invalidation is hard. Be deliberate:**
- Cache immutable data aggressively
- Use short TTLs for mutable data
- Consider cache stampede (stale-while-revalidate)
- Monitor cache hit rates

---

## 8. Security Mindset

### 8.1 Defense in Depth

Never rely on a single security control.

**Layers:**
- Input validation at API boundary
- Type checking in business logic
- Parameterized queries at database layer
- Output encoding at rendering layer
- Principle of least privilege everywhere

### 8.2 Security Checklist

**For every feature:**
- [ ] All user input validated and sanitized
- [ ] Authentication required where needed
- [ ] Authorization checks (can THIS user do THIS action on THIS resource?)
- [ ] Sensitive data not logged
- [ ] Rate limiting on public endpoints
- [ ] HTTPS only, secure cookies
- [ ] No secrets in code or version control

### 8.3 Think Like an Attacker

**Common attack vectors:**
- Can I access another user's data by changing IDs?
- Can I inject SQL/JS/HTML?
- Can I bypass rate limits?
- Can I cause resource exhaustion?
- Can I exploit race conditions?

---

## 9. Developer Experience

### 9.1 Fast Feedback Loops

**Optimize for iteration speed:**
- Hot reload in < 1 second
- Tests run in < 10 seconds (frequently run subset)
- CI completes in < 10 minutes
- Deploy to staging in < 15 minutes

### 9.2 Good Defaults, Easy Overrides

**Make the right thing easy:**
```typescript
// Good defaults
export function createClient(options?: Partial<ClientOptions>) {
  return new Client({
    timeout: 5000,
    retries: 3,
    ...options,
  })
}

// Most users just call:
const client = createClient()

// Power users can customize:
const client = createClient({ timeout: 10000 })
```

### 9.3 Error Messages That Help

```typescript
// Bad
throw new Error('Invalid input')

// Good  
throw new Error(
  `Invalid date format: "${input}". ` +
  `Expected ISO 8601 format (e.g., "2024-01-15T10:30:00Z").`
)
```

---

## 10. Continuous Improvement

### 10.1 Leave Code Better Than You Found It

**The Boy Scout Rule:**
- Fix small issues while you're in the code
- Update outdated comments
- Improve variable names
- Add missing error handling
- But: don't mix big refactors with feature work

### 10.2 Learn From Production

**Instrument everything:**
- Request latency percentiles (p50, p95, p99)
- Error rates by endpoint and error type
- Business metrics (signups, conversions)
- Infrastructure metrics (CPU, memory, connections)

### 10.3 Stay Current

**Continuous learning:**
- Read source code of libraries you use
- Understand one level below your abstraction
- Follow engineering blogs (Anthropic, Stripe, Vercel, Linear)
- Contribute to open source
- Write about what you learn

---

## Quick Reference Card

| Principle | Action |
|-----------|--------|
| Correctness > Performance | Make it work, make it right, make it fast |
| Explicit > Implicit | Dependencies, errors, side effects visible |
| Simple > Clever | Boring code is maintainable code |
| Small > Large | Small PRs, small functions, small services |
| Measure > Assume | Profile before optimizing, A/B test changes |
| Fail Fast | Validate early, throw on unexpected states |
| Defense in Depth | Multiple security layers, never trust one |
| Automate Toil | If you do it twice, automate it |

---

*"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."* — Martin Fowler
