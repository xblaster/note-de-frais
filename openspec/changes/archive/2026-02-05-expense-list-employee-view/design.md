# Design: Expense List Employee View

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    EXPENSE LIST PAGE                           │
└────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════╗
║  [Search bar - full width]          [@User] [Logout]         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Mes Notes de Frais                        [+ Nouvelle]     ║
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ Total: 1,234€  │  En attente: 3  │  Approuvées: 5   │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║  ┌────── FILTER CHIPS ──────┐  [Trier ▼]                   ║
║  │ [Toutes] [Brouillons (2)]│                               ║
║  │ [En attente (3)] [...]   │                               ║
║  └──────────────────────────┘                               ║
║                                                              ║
║  ⚠️  Nécessite une action (2)                               ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ [📝] Brouillon - À compléter                         │   ║
║  │      Restaurant Le Bistrot        123.45€            │   ║
║  │      15 janvier 2024             [Terminer →]        │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║  Toutes les dépenses                                        ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ [🕐] En attente de validation                        │   ║
║  │      Hotel Marriott               450.00€            │   ║
║  │      10 janvier 2024              [Voir →]           │   ║
║  └──────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════╝
```

## Component Breakdown

### 1. Layout Structure

**Before (Current):**
```
Sidebar (256px) | Main Content
```

**After (New):**
```
Full width main content (max-w-7xl centered)
```

**Rationale:**
- Sidebar is over-engineered for L1 app with 3-4 nav items
- Maximizes content space for list
- Simpler navigation via header actions

---

### 2. Header

```tsx
<header className="border-b border-border bg-card/50 px-6 py-4">
  <div className="flex items-center gap-4">
    {/* Logo/Brand (mobile only) */}
    <div className="lg:hidden">
      <Receipt /> Note de Frais
    </div>

    {/* Search - expands to fill space */}
    <div className="flex-1 max-w-2xl">
      <SearchBar />
    </div>

    {/* User actions */}
    <div className="flex items-center gap-3">
      <UserAvatar email={userEmail} />
      <LogoutButton />
    </div>
  </div>
</header>
```

**SearchBar Component:**
```tsx
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

// Behavior:
// - Debounce 300ms
// - Show clear button when value.length > 0
// - Placeholder: "Rechercher par nom, montant..."
// - Icon: Search (left), X (right, conditional)
```

---

### 3. Stats KPI Cards

**Keep existing but simplify:**
```tsx
// Remove "Rejetées" from stats (noise)
// Keep essential metrics:

<StatCard label="Total des dépenses" value={totalAmount} icon={TrendingUp} />
<StatCard label="En attente" value={pendingCount} icon={Clock} />
<StatCard label="Approuvées" value={approvedCount} icon={CheckCircle2} />
```

---

### 4. Filter Chips

```tsx
interface FilterChip {
  label: string;
  status: ExpenseStatus | 'ALL';
  count: number;
}

const filters: FilterChip[] = [
  { label: 'Toutes', status: 'ALL', count: expenses.length },
  { label: 'Brouillons', status: 'DRAFT', count: draftCount },
  { label: 'En attente', status: 'SUBMITTED', count: pendingCount },
  { label: 'Approuvées', status: 'APPROVED', count: approvedCount },
  { label: 'Rejetées', status: 'REJECTED', count: rejectedCount },
];

// State management:
const [activeFilter, setActiveFilter] = useState<ExpenseStatus | 'ALL'>('ALL');

// Behavior:
// - Radio: only one active at a time
// - Click updates activeFilter state
// - Filtered list = expenses.filter(e =>
//     activeFilter === 'ALL' || e.status === activeFilter
//   )
```

**Visual Design:**
```tsx
// Inactive chip:
className="px-4 py-2 rounded-lg border border-border bg-card
           text-muted-foreground hover:border-primary/30
           transition-colors cursor-pointer"

// Active chip:
className="px-4 py-2 rounded-lg border border-primary
           bg-primary/10 text-primary font-medium"

// Badge count:
<span className="ml-2 text-xs">(X)</span>
```

---

### 5. Sort Dropdown

```tsx
type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

const sortOptions = [
  { value: 'date-desc', label: 'Plus récent' },
  { value: 'date-asc', label: 'Plus ancien' },
  { value: 'amount-desc', label: 'Montant décroissant' },
  { value: 'amount-asc', label: 'Montant croissant' },
];

// Position: Right aligned next to filter chips
// Component: Simple <select> or custom dropdown
```

---

### 6. "Action Required" Section

```tsx
const actionableExpenses = expenses.filter(e =>
  e.status === 'DRAFT' || e.status === 'REJECTED'
);

{actionableExpenses.length > 0 && (
  <section className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <AlertTriangle className="w-5 h-5 text-warning" />
      <h2 className="text-lg font-semibold">
        Nécessite une action ({actionableExpenses.length})
      </h2>
    </div>

    <div className="space-y-3">
      {actionableExpenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} priority />
      ))}
    </div>
  </section>
)}
```

**Visual Distinction:**
- Distinct background: `bg-warning/5 border-l-4 border-warning`
- Or simply a section divider with warning icon

---

### 7. Expense Card Variants

**Base Structure:**
```tsx
interface ExpenseCardProps {
  expense: Expense;
  priority?: boolean; // For "Action Required" section
}

<div className={cn(
  "bg-card border rounded-xl p-4 transition-colors cursor-pointer",
  "hover:border-primary/30",
  priority && "border-l-4 border-l-warning"
)}>
  {/* Line 1: Status indicator + context */}
  <div className="flex items-center gap-2 mb-2">
    <StatusIcon status={expense.status} />
    <StatusText expense={expense} />
  </div>

  {/* Line 2: Vendor + Amount */}
  <div className="flex items-center justify-between mb-1">
    <h3 className="font-semibold truncate">{expense.vendor}</h3>
    <span className="font-bold">{formatCurrency(expense.amount)}</span>
  </div>

  {/* Line 3: Date + Action */}
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">
      {formatDate(expense.date)}
    </span>
    <ActionButton expense={expense} />
  </div>
</div>
```

**Status Variants:**

```tsx
// DRAFT
<StatusText>
  <span className="text-muted-foreground">
    📝 Brouillon - À compléter
  </span>
</StatusText>
<ActionButton>
  <button className="text-sm text-primary hover:underline">
    Terminer →
  </button>
</ActionButton>

// REJECTED
<StatusText>
  <span className="text-error">
    ❌ Rejeté - {expense.rejectionReason || 'Motif non spécifié'}
  </span>
</StatusText>
<ActionButton>
  <button className="text-sm text-primary hover:underline">
    Corriger →
  </button>
</ActionButton>

// SUBMITTED
<StatusText>
  <span className="text-warning">
    🕐 En attente de validation
  </span>
</StatusText>
<ActionButton>
  <button className="text-sm text-muted-foreground hover:text-foreground">
    Voir →
  </button>
</ActionButton>

// APPROVED
<StatusText>
  <span className="text-success">
    ✓ Approuvé le {formatDate(expense.approvedAt)}
  </span>
</StatusText>
<ActionButton>
  <button className="text-sm text-muted-foreground hover:text-foreground">
    Voir →
  </button>
</ActionButton>
```

---

### 8. Click Handlers & Routing

```tsx
const handleExpenseClick = (expense: Expense) => {
  switch (expense.status) {
    case 'DRAFT':
    case 'REJECTED':
      // Navigate to edit mode
      navigate(`/expenses/${expense.id}/edit`);
      break;

    case 'SUBMITTED':
    case 'APPROVED':
      // Navigate to detail view
      navigate(`/expenses/${expense.id}`);
      break;
  }
};
```

**New Routes Required:**
- `/expenses/:id` - Detail view (read-only)
- `/expenses/:id/edit` - Edit form (pre-filled)

---

### 9. Search Logic

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery] = useDebounce(searchQuery, 300);

const filteredExpenses = useMemo(() => {
  let result = expenses;

  // Apply status filter
  if (activeFilter !== 'ALL') {
    result = result.filter(e => e.status === activeFilter);
  }

  // Apply search
  if (debouncedQuery) {
    const query = debouncedQuery.toLowerCase();
    result = result.filter(e =>
      e.vendor?.toLowerCase().includes(query) ||
      e.amount.toString().includes(query) ||
      formatDate(e.date).toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query)
    );
  }

  // Apply sort
  result = sortExpenses(result, sortOption);

  return result;
}, [expenses, activeFilter, debouncedQuery, sortOption]);
```

**Search Scope:**
- `vendor` (primary)
- `amount` (exact match or contains)
- `date` (formatted string match)
- `description` (if exists)

---

### 10. Data Model Updates

**Current Expense interface:**
```tsx
interface Expense {
  id: string;
  amount: number;
  date: string;
  vendor: string | null;
  status: string;
}
```

**Required additions:**
```tsx
interface Expense {
  id: string;
  amount: number;
  date: string; // ISO string
  vendor: string; // Make required, no null
  status: ExpenseStatus;

  // New fields:
  description?: string;        // For richer search
  category?: string;           // Future: "Transport", "Repas", etc.
  rejectionReason?: string;    // If status = REJECTED
  approvedAt?: string;         // ISO string, if status = APPROVED
  approvedBy?: string;         // Manager name/email
  screenshotUrl?: string;      // Already exists in Prisma schema
  userId: string;              // Already exists
}

enum ExpenseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
```

**Backend changes needed:**
- Update `GET /expenses` response to include new fields
- Update Prisma schema if fields don't exist
- Migration to add `rejectionReason`, `approvedAt`, `approvedBy`, `description`, `category`

---

### 11. Pagination Strategy

**Phase 1 (Simple):**
```tsx
const [visibleCount, setVisibleCount] = useState(20);

<div className="space-y-3">
  {filteredExpenses.slice(0, visibleCount).map(expense => (
    <ExpenseCard key={expense.id} expense={expense} />
  ))}
</div>

{visibleCount < filteredExpenses.length && (
  <button
    onClick={() => setVisibleCount(prev => prev + 20)}
    className="w-full py-3 text-sm text-muted-foreground hover:text-foreground"
  >
    Charger plus... ({filteredExpenses.length - visibleCount} restantes)
  </button>
)}
```

**Phase 2 (Future):**
- Infinite scroll with Intersection Observer
- Server-side pagination with cursor/offset

---

### 12. Animation & Transitions

**Keep existing animations but simplify:**
```tsx
// List enter animation
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {expenses.map(expense => (
    <motion.div key={expense.id} variants={itemVariants}>
      <ExpenseCard expense={expense} />
    </motion.div>
  ))}
</motion.div>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};
```

**Remove:**
- Grid/List toggle animation
- Sidebar animations

---

### 13. Responsive Considerations

**Desktop (≥1024px):**
- Max width content: `max-w-7xl`
- Stats in 3-column grid
- Search bar full width

**Tablet (768px - 1023px):**
- Max width content: `max-w-4xl`
- Stats in 3-column grid (might wrap)
- Chips scroll horizontally if needed

**Mobile (<768px):**
- Full width with padding
- Stats in 1-column stack
- Chips scroll horizontally
- User email hidden (avatar only)
- Search bar full width
- "Nouvelle" button shows icon only

---

### 14. Loading & Empty States

**Loading:**
```tsx
// Keep existing LoadingSkeleton but adapt to list-only
<LoadingSkeleton count={6} />
```

**Empty State:**
```tsx
// Current EmptyState is good, keep it
<EmptyState
  title="Aucune dépense"
  message="Vous n'avez pas encore de notes de frais."
  action={<Button onClick={handleNewExpense}>Nouvelle dépense</Button>}
/>
```

**No Search Results:**
```tsx
<EmptyState
  title="Aucun résultat"
  message={`Aucune dépense ne correspond à "${searchQuery}"`}
  action={<Button variant="ghost" onClick={handleClearSearch}>Effacer la recherche</Button>}
/>
```

---

## Implementation Priority

**Phase 1 (Core functionality):**
1. ✅ Layout restructure (remove sidebar, update header)
2. ✅ Filter chips with state management
3. ✅ Search with debouncing
4. ✅ Card variants by status
5. ✅ "Action Required" section
6. ✅ Click handlers (routing)

**Phase 2 (Polish):**
7. Sort dropdown
8. Pagination ("Charger plus")
9. Backend data enrichment (rejectionReason, etc.)
10. Responsive refinements

**Phase 3 (Future):**
11. Detail view page (`/expenses/:id`)
12. Edit page with pre-fill (`/expenses/:id/edit`)
13. Infinite scroll
14. Advanced search (date range, etc.)

---

## Design Tokens

**Existing (from CLAUDE.md):**
- Background: `#030712`
- Primary: `#6366f1` (indigo)
- Glass effects: `.glass`, `.glass-card`
- French language throughout

**New additions needed:**
- Chip active state: `bg-primary/10 border-primary`
- Warning section: `bg-warning/5 border-l-warning`
- Status colors:
  - DRAFT: `text-muted-foreground`
  - SUBMITTED: `text-warning`
  - APPROVED: `text-success`
  - REJECTED: `text-error`

---

## Technical Dependencies

**No new dependencies required:**
- useState, useMemo, useEffect (React built-in)
- Framer Motion (already installed)
- React Router (already installed)
- Lucide icons (already installed)

**Optional (for future):**
- `use-debounce` (or implement custom hook)
- `date-fns` (for better date parsing in search)
