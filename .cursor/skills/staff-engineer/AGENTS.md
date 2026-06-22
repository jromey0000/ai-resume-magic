# Staff Engineer Standards — Agent Reference

> **For AI Agents:** This document contains engineering standards for Staff+ level code at top-tier startups. Apply these principles when generating, reviewing, or refactoring code. Prioritize by impact: Correctness > Clarity > Performance.

---

## Critical Rules (Always Apply)

### C1: Make Invalid States Unrepresentable
Use discriminated unions instead of nullable fields.

```typescript
// INCORRECT
interface State {
  data: Data | null
  error: Error | null  
  loading: boolean
}

// CORRECT
type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: Error }
```

### C2: Fail Fast with Descriptive Errors
Never swallow errors. Validate at boundaries.

```typescript
// INCORRECT
function getUser(id: string) {
  try { return db.find(id) } 
  catch { return null }
}

// CORRECT
function getUser(id: string): User {
  if (!id) throw new Error(`User id required, got: ${id}`)
  const user = db.find(id)
  if (!user) throw new NotFoundError(`User ${id} not found`)
  return user
}
```

### C3: Explicit Dependencies
Inject dependencies, don't import global singletons.

```typescript
// INCORRECT
import { db } from './database'
function getUsers() { return db.query('SELECT * FROM users') }

// CORRECT
function getUsers(db: Database) { return db.query('SELECT * FROM users') }
```

### C4: Handle All Error Cases
Every async operation needs error handling.

```typescript
// INCORRECT
const data = await fetch(url).then(r => r.json())

// CORRECT
const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${await response.text()}`)
}
const data = await response.json()
```

### C5: Timeouts on All External Calls

```typescript
// INCORRECT
await fetch(url)
await db.query(sql)

// CORRECT
await fetch(url, { signal: AbortSignal.timeout(5000) })
await db.query(sql, { timeout: 5000 })
```

---

## Code Quality Rules

### Q1: Descriptive Names
Names should reveal intent without needing comments.

```typescript
// INCORRECT
const d = data.filter(x => x.s === 'a')
const temp = users.map(u => u.id)

// CORRECT
const activeUsers = users.filter(user => user.status === 'active')
const userIds = users.map(user => user.id)
```

### Q2: Small Functions
Each function does one thing. If you need "and" to describe it, split it.

```typescript
// INCORRECT
function processOrder(order: Order) {
  // validate
  if (!order.items.length) throw new Error('...')
  // calculate
  const total = order.items.reduce((sum, item) => sum + item.price, 0)
  // save
  db.orders.insert({ ...order, total })
  // notify
  email.send(order.userId, 'Order confirmed')
}

// CORRECT
function validateOrder(order: Order): void { /* ... */ }
function calculateTotal(items: Item[]): number { /* ... */ }
function saveOrder(order: Order, total: number): void { /* ... */ }
function notifyOrderConfirmed(userId: string): void { /* ... */ }

function processOrder(order: Order) {
  validateOrder(order)
  const total = calculateTotal(order.items)
  saveOrder(order, total)
  notifyOrderConfirmed(order.userId)
}
```

### Q3: Pure Functions Where Possible
Same inputs → same outputs, no side effects.

```typescript
// INCORRECT (impure)
let counter = 0
function process(x: number) {
  counter++
  return x * 2
}

// CORRECT (pure)
function process(x: number): number {
  return x * 2
}
```

### Q4: Constants for Magic Values

```typescript
// INCORRECT
if (retries > 3) { /* ... */ }
await sleep(86400000)

// CORRECT
const MAX_RETRIES = 3
const ONE_DAY_MS = 24 * 60 * 60 * 1000

if (retries > MAX_RETRIES) { /* ... */ }
await sleep(ONE_DAY_MS)
```

### Q5: Early Returns
Reduce nesting by returning early.

```typescript
// INCORRECT
function process(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doWork(user)
      }
    }
  }
  return null
}

// CORRECT
function process(user: User | null) {
  if (!user) return null
  if (!user.isActive) return null
  if (!user.hasPermission) return null
  return doWork(user)
}
```

---

## Security Rules

### S1: Validate All Input
Never trust user input. Validate at system boundaries.

```typescript
// INCORRECT
app.post('/users', (req) => {
  db.users.insert(req.body)
})

// CORRECT
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

app.post('/users', (req) => {
  const data = CreateUserSchema.parse(req.body)
  db.users.insert(data)
})
```

### S2: Parameterized Queries
Never interpolate user input into queries.

```typescript
// INCORRECT (SQL injection)
db.query(`SELECT * FROM users WHERE id = '${userId}'`)

// CORRECT
db.query('SELECT * FROM users WHERE id = $1', [userId])
```

### S3: Authorization Checks
Always verify the user can access the resource.

```typescript
// INCORRECT
app.get('/orders/:id', async (req) => {
  return db.orders.find(req.params.id)
})

// CORRECT
app.get('/orders/:id', async (req) => {
  const order = await db.orders.find(req.params.id)
  if (!order) throw new NotFoundError()
  if (order.userId !== req.user.id) throw new ForbiddenError()
  return order
})
```

### S4: Never Log Secrets

```typescript
// INCORRECT
logger.info('Auth attempt', { user, password, token })

// CORRECT
logger.info('Auth attempt', { userId: user.id, email: user.email })
```

### S5: Rate Limiting on Public Endpoints

```typescript
// CORRECT
app.post('/login', 
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }),
  loginHandler
)
```

---

## Performance Rules

### P1: Avoid N+1 Queries

```typescript
// INCORRECT (N+1)
const orders = await db.orders.findAll()
for (const order of orders) {
  order.user = await db.users.find(order.userId)
}

// CORRECT (single query with join or batch)
const orders = await db.orders.findAllWithUsers()
// or
const userIds = [...new Set(orders.map(o => o.userId))]
const users = await db.users.findByIds(userIds)
const usersById = new Map(users.map(u => [u.id, u]))
orders.forEach(o => o.user = usersById.get(o.userId))
```

### P2: Use Appropriate Data Structures

```typescript
// INCORRECT - O(n) lookup
const ids = [1, 2, 3, 4, 5]
items.filter(item => ids.includes(item.id))

// CORRECT - O(1) lookup
const idSet = new Set([1, 2, 3, 4, 5])
items.filter(item => idSet.has(item.id))
```

### P3: Batch Operations

```typescript
// INCORRECT
for (const item of items) {
  await db.insert(item)
}

// CORRECT
await db.insertMany(items)
```

### P4: Lazy Loading
Don't load data until needed.

```typescript
// INCORRECT
const allUsers = await db.users.findAll() // loads everything
const filtered = allUsers.filter(u => u.isActive)

// CORRECT
const activeUsers = await db.users.findAll({ where: { isActive: true } })
```

---

## Testing Rules

### T1: Test Behavior, Not Implementation

```typescript
// INCORRECT - tests implementation
test('calls validateOrder', () => {
  const spy = jest.spyOn(service, 'validateOrder')
  service.processOrder(order)
  expect(spy).toHaveBeenCalled()
})

// CORRECT - tests behavior
test('rejects orders with no items', () => {
  const order = createOrder({ items: [] })
  expect(() => service.processOrder(order)).toThrow('Order must have items')
})
```

### T2: Test Edge Cases

```typescript
describe('divide', () => {
  it('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })
  
  // Edge cases
  it('throws on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero')
  })
  
  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })
  
  it('handles decimal results', () => {
    expect(divide(5, 2)).toBe(2.5)
  })
})
```

### T3: Deterministic Tests
No flaky tests. Mock time, randomness, and external services.

```typescript
// INCORRECT
test('expires after 1 hour', async () => {
  const token = createToken()
  await sleep(3600000) // Actually waits!
  expect(token.isExpired()).toBe(true)
})

// CORRECT
test('expires after 1 hour', () => {
  jest.useFakeTimers()
  const token = createToken()
  jest.advanceTimersByTime(3600000)
  expect(token.isExpired()).toBe(true)
})
```

### T4: Test Error Paths

```typescript
describe('fetchUser', () => {
  it('returns user on success', async () => {
    mockApi.get.mockResolvedValue({ id: '1', name: 'Test' })
    const user = await fetchUser('1')
    expect(user.name).toBe('Test')
  })
  
  it('throws NotFoundError on 404', async () => {
    mockApi.get.mockRejectedValue(new HttpError(404))
    await expect(fetchUser('1')).rejects.toThrow(NotFoundError)
  })
  
  it('throws on network error', async () => {
    mockApi.get.mockRejectedValue(new Error('Network error'))
    await expect(fetchUser('1')).rejects.toThrow('Network error')
  })
  
  it('retries on 503', async () => {
    mockApi.get
      .mockRejectedValueOnce(new HttpError(503))
      .mockResolvedValue({ id: '1', name: 'Test' })
    const user = await fetchUser('1')
    expect(user.name).toBe('Test')
    expect(mockApi.get).toHaveBeenCalledTimes(2)
  })
})
```

---

## Error Handling Patterns

### E1: Custom Error Classes

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404, { resource, id })
  }
}

class ValidationError extends AppError {
  constructor(message: string, public fields: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400, { fields })
  }
}
```

### E2: Result Types for Expected Failures

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E }

function parseJSON<T>(text: string): Result<T, SyntaxError> {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (error) {
    return { ok: false, error: error as SyntaxError }
  }
}

// Usage
const result = parseJSON<User>(text)
if (result.ok) {
  console.log(result.value.name)
} else {
  console.error('Invalid JSON:', result.error.message)
}
```

---

## Async Patterns

### A1: Promise.all for Independent Operations

```typescript
// INCORRECT - sequential
const user = await getUser(id)
const orders = await getOrders(id)
const preferences = await getPreferences(id)

// CORRECT - parallel
const [user, orders, preferences] = await Promise.all([
  getUser(id),
  getOrders(id),
  getPreferences(id),
])
```

### A2: Promise.allSettled When Partial Failure is OK

```typescript
const results = await Promise.allSettled([
  sendEmail(user1),
  sendEmail(user2),
  sendEmail(user3),
])

const failures = results.filter(r => r.status === 'rejected')
if (failures.length) {
  logger.warn('Some emails failed', { count: failures.length })
}
```

### A3: Retry with Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 100 } = options
  
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

### A4: Cancellation Support

```typescript
async function fetchWithCancel(
  url: string, 
  signal?: AbortSignal
): Promise<Response> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response
}

// Usage
const controller = new AbortController()
setTimeout(() => controller.abort(), 5000)

try {
  const response = await fetchWithCancel(url, controller.signal)
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled')
  }
}
```

---

## Logging Standards

### L1: Structured Logging

```typescript
// INCORRECT
console.log('User ' + userId + ' created order ' + orderId)

// CORRECT
logger.info('Order created', {
  userId,
  orderId,
  total: order.total,
  itemCount: order.items.length,
})
```

### L2: Log Levels

```typescript
logger.error('Payment failed', { error, orderId })     // Something broke
logger.warn('Rate limit approaching', { current, max }) // Concerning but handled
logger.info('Order completed', { orderId, total })      // Business event
logger.debug('Cache hit', { key, ttl })                 // Debugging only
```

### L3: Request Context

```typescript
// Include request ID in all logs
const requestLogger = logger.child({ requestId: req.id })
requestLogger.info('Processing request', { path: req.path })
```

---

## Database Patterns

### D1: Transactions for Multi-Step Operations

```typescript
// INCORRECT
await db.orders.insert(order)
await db.inventory.decrement(order.itemId)
// If second fails, data is inconsistent!

// CORRECT
await db.transaction(async (tx) => {
  await tx.orders.insert(order)
  await tx.inventory.decrement(order.itemId)
})
```

### D2: Optimistic Locking

```typescript
async function updateUser(id: string, updates: Partial<User>, expectedVersion: number) {
  const result = await db.users.update(
    { id, version: expectedVersion },
    { ...updates, version: expectedVersion + 1 }
  )
  
  if (result.modifiedCount === 0) {
    throw new ConflictError('User was modified by another request')
  }
}
```

### D3: Connection Pooling

```typescript
// Configure appropriate pool size
const pool = new Pool({
  max: 20,           // Max connections
  idleTimeoutMs: 30000,
  connectionTimeoutMs: 5000,
})
```

---

## Quick Decision Guide

| Situation | Do This |
|-----------|---------|
| Function > 30 lines | Split it |
| Nested callbacks > 2 levels | Refactor to async/await or extract functions |
| Repeated code > 2 times | Extract to function |
| Complex conditional | Extract to well-named function or use early returns |
| Hardcoded value | Extract to named constant |
| External call | Add timeout and error handling |
| User input | Validate with schema |
| Database write | Consider if transaction needed |
| Performance concern | Measure first, then optimize |
| Unclear code | Add comment explaining *why*, or refactor |

---

## Anti-Patterns to Avoid

1. **God functions** - Functions > 50 lines doing multiple things
2. **Stringly typed** - Using strings where enums/types would be safer
3. **Boolean blindness** - `doThing(true, false, true)` instead of named options
4. **Shotgun surgery** - One change requires edits in many places
5. **Primitive obsession** - Using primitives instead of domain types
6. **Silent failures** - Catching errors and doing nothing
7. **Temporal coupling** - Methods that must be called in specific order
8. **Feature envy** - Functions that use another object's data more than their own
9. **Speculative generality** - Building for hypothetical future needs
10. **Copy-paste programming** - Duplicating code instead of abstracting

---

*Apply these rules consistently. When in doubt, choose the simpler, more explicit option.*
