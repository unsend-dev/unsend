# Unsend Billing Flow Enhancement Plan

## Overview
Transform Unsend from a usage-only billing model to a comprehensive subscription + usage-based pricing system with proper free tier enforcement and upgrade prompts throughout the product.

## Current State Analysis

### ✅ What's Working
- **Stripe Integration**: Full integration with customer creation, checkout, and webhooks
- **Database Schema**: Solid foundation with Team, Subscription, and DailyEmailUsage tables
- **Usage Tracking**: Daily email usage tracked by type (transactional/marketing)
- **Payment Flows**: Upgrade flow with Stripe checkout and billing portal
- **Plan Definitions**: FREE and BASIC plans with clear feature limits

### 🔴 Critical Issues
- **No Limit Enforcement**: FREE plan limits (3,000/month, 100/day) are displayed but not enforced in email sending
- **Usage-Only Pricing**: Missing subscription base pricing - only usage-based pricing exists
- **Missing Upgrade Prompts**: No generic upgrade modal system throughout the product
- **Incomplete Restrictions**: Domain, contact book, and team member limits not enforced

## Phase 1: Database & Plan Structure Updates

### 1.1 Update Plan Enum & Add New Plan
```sql
-- Update existing Plan enum to include new tiers
enum Plan {
  FREE
  BASIC      // Current usage-based plan
  PRO        // New subscription + usage plan
  ENTERPRISE // Future expansion
}
```

### 1.2 Add Subscription Pricing Fields
```sql
-- Add subscription pricing to Team model
model Team {
  // ... existing fields
  subscriptionStatus: String?     // "active", "cancelled", "past_due"
  subscriptionPriceId: String?    // Stripe subscription price ID
  usagePriceId: String?          // Stripe usage price ID (existing)
  billingCycle: String?          // "monthly", "yearly"
  subscriptionAmount: Int?       // Base subscription amount in cents
}
```

### 1.3 Create Plan Limits Configuration
```typescript
// apps/web/src/lib/constants/plans.ts
export const PLAN_LIMITS = {
  FREE: {
    emailsPerMonth: 3000,
    emailsPerDay: 100,
    domains: 1,
    contactBooks: 1,
    teamMembers: 1,
    apiRateLimit: 2,
  },
  BASIC: {
    emailsPerMonth: -1, // unlimited
    emailsPerDay: -1,   // unlimited
    domains: -1,
    contactBooks: -1,
    teamMembers: -1,
    apiRateLimit: 10,
    subscriptionFee: 2900, // $29/month
    usageFees: {
      transactional: 0.0004,
      marketing: 0.001,
    },
    includedUsage: 1000, // $10 worth of usage included
  },
  PRO: {
    emailsPerMonth: -1,
    emailsPerDay: -1,
    domains: -1,
    contactBooks: -1,
    teamMembers: -1,
    apiRateLimit: 50,
    subscriptionFee: 9900, // $99/month
    usageFees: {
      transactional: 0.0003,
      marketing: 0.0008,
    },
    includedUsage: 5000, // $50 worth of usage included
  },
}
```

## Phase 2: Limit Enforcement System

### 2.1 Create Limit Checking Service
```typescript
// apps/web/src/server/service/limit-service.ts
export class LimitService {
  static async checkEmailLimit(teamId: number, emailCount: number): Promise<{canSend: boolean, reason?: string}>
  static async checkDomainLimit(teamId: number): Promise<{canCreate: boolean, reason?: string}>
  static async checkContactBookLimit(teamId: number): Promise<{canCreate: boolean, reason?: string}>
  static async checkTeamMemberLimit(teamId: number): Promise<{canInvite: boolean, reason?: string}>
  static async getCurrentUsage(teamId: number): Promise<UsageStats>
}
```

### 2.2 Update Email Service with Limits
```typescript
// Modify apps/web/src/server/service/email-service.ts
export async function sendEmail(emailContent: EmailContent & { teamId: number }) {
  // BEFORE any processing, check limits
  const team = await db.team.findUnique({ where: { id: emailContent.teamId } });
  
  if (team?.plan === 'FREE') {
    const limitCheck = await LimitService.checkEmailLimit(
      emailContent.teamId, 
      Array.isArray(emailContent.to) ? emailContent.to.length : 1
    );
    
    if (!limitCheck.canSend) {
      throw new UnsendApiError({
        code: "QUOTA_EXCEEDED",
        message: limitCheck.reason,
      });
    }
  }
  
  // ... rest of existing logic
}
```

### 2.3 Add Limit Checks to Domain Creation
```typescript
// apps/web/src/server/api/routers/domain.ts
export const domainRouter = createTRPCRouter({
  create: protectedProcedure
    .input(/* ... */)
    .mutation(async ({ ctx, input }) => {
      // Check domain limit before creation
      const limitCheck = await LimitService.checkDomainLimit(ctx.session.user.teamId);
      if (!limitCheck.canCreate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: limitCheck.reason,
        });
      }
      // ... rest of logic
    }),
});
```

## Phase 3: Generic Upgrade Modal System

### 3.1 Create Upgrade Modal Component
```typescript
// apps/web/src/components/upgrade/upgrade-modal.tsx
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  currentPlan: Plan;
  recommendedPlan?: Plan;
  customMessage?: string;
}

export function UpgradeModal({ isOpen, onClose, feature, currentPlan, recommendedPlan, customMessage }: UpgradeModalProps) {
  // Show plan comparison
  // Highlight blocked feature
  // Show upgrade CTA button
  // Handle Stripe checkout
}
```

### 3.2 Create Upgrade Context Provider
```typescript
// apps/web/src/providers/upgrade-provider.tsx
interface UpgradeContextType {
  showUpgradeModal: (feature: string, customMessage?: string) => void;
  hideUpgradeModal: () => void;
  checkLimitAndPrompt: (action: string, teamId: number) => Promise<boolean>;
}

export function UpgradeProvider({ children }: { children: React.ReactNode }) {
  // Manage modal state
  // Provide upgrade utilities
}
```

### 3.3 Create Upgrade Hook
```typescript
// apps/web/src/hooks/use-upgrade.ts
export function useUpgrade() {
  const context = useContext(UpgradeContext);
  
  return {
    showUpgradeModal: context.showUpgradeModal,
    checkAndPrompt: context.checkLimitAndPrompt,
    // Helper functions for common scenarios
    promptForDomainLimit: () => context.showUpgradeModal("domains", "You've reached your domain limit"),
    promptForEmailLimit: () => context.showUpgradeModal("emails", "You've reached your email sending limit"),
    promptForContactBookLimit: () => context.showUpgradeModal("contact-books", "You've reached your contact book limit"),
  };
}
```

## Phase 4: Integration Points & Error Handling

### 4.1 Update Domain Creation Page
```typescript
// apps/web/src/app/(dashboard)/domains/page.tsx
function DomainsPage() {
  const { promptForDomainLimit } = useUpgrade();
  
  const handleCreateDomain = async () => {
    try {
      await createDomainMutation.mutateAsync(data);
    } catch (error) {
      if (error.code === "FORBIDDEN" && error.message.includes("domain limit")) {
        promptForDomainLimit();
      }
    }
  };
}
```

### 4.2 Update Email Sending with User Feedback
```typescript
// apps/web/src/app/(dashboard)/emails/send/page.tsx
function SendEmailPage() {
  const { promptForEmailLimit } = useUpgrade();
  
  const handleSendEmail = async () => {
    try {
      await sendEmailMutation.mutateAsync(data);
    } catch (error) {
      if (error.code === "QUOTA_EXCEEDED") {
        promptForEmailLimit();
      }
    }
  };
}
```

### 4.3 Update Contact Book Creation
```typescript
// apps/web/src/app/(dashboard)/contacts/page.tsx
function ContactsPage() {
  const { promptForContactBookLimit } = useUpgrade();
  
  const handleCreateContactBook = async () => {
    try {
      await createContactBookMutation.mutateAsync(data);
    } catch (error) {
      if (error.code === "FORBIDDEN" && error.message.includes("contact book limit")) {
        promptForContactBookLimit();
      }
    }
  };
}
```

## Phase 5: Subscription + Usage Billing Implementation

### 5.1 Update Stripe Webhook Handler
```typescript
// apps/web/src/app/api/webhook/stripe/route.ts
export async function POST(req: Request) {
  // Handle subscription events
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Update team subscription status and plan
      // Handle plan upgrades/downgrades
      break;
    case 'invoice.payment_succeeded':
      // Handle usage billing
      // Reset usage allowances
      break;
    // ... existing event handlers
  }
}
```

### 5.2 Create Usage Billing Service
```typescript
// apps/web/src/server/service/usage-billing-service.ts
export class UsageBillingService {
  static async calculateMonthlyUsageCost(teamId: number, billingPeriodStart: Date, billingPeriodEnd: Date): Promise<number>
  static async createUsageRecord(teamId: number, usage: number, timestamp: Date): Promise<void>
  static async reportUsageToStripe(customerId: string, subscriptionItemId: string, usage: number): Promise<void>
}
```

### 5.3 Update Payment Flow
```typescript
// apps/web/src/server/billing/payments.ts
export async function createCheckoutSession(teamId: number, priceId: string, planType: 'subscription' | 'usage') {
  // Handle both subscription and usage price creation
  // Set up subscription with usage-based pricing
  // Configure billing thresholds
}
```

## Phase 6: UI/UX Enhancements

### 6.1 Update Settings/Billing Page
```typescript
// apps/web/src/app/(dashboard)/settings/billing/page.tsx
function BillingPage() {
  // Show current plan details
  // Display subscription status and next billing date
  // Show usage metrics and costs
  // Upgrade/downgrade options
  // Usage-based billing explanation
}
```

### 6.2 Create Usage Dashboard
```typescript
// apps/web/src/components/billing/usage-dashboard.tsx
function UsageDashboard() {
  // Current month usage vs limits
  // Cost breakdown (subscription + usage)
  // Usage trends
  // Projected monthly cost
}
```

### 6.3 Add Limit Warnings
```typescript
// apps/web/src/components/billing/usage-warnings.tsx
function UsageWarnings() {
  // Show warnings at 80% and 95% of limits
  // Daily email limit warnings
  // Monthly limit approaching warnings
}
```

## Phase 7: Testing & Validation

### 7.1 Unit Tests
- Limit checking service tests
- Email service limit enforcement tests  
- Usage calculation tests
- Billing service tests

### 7.2 Integration Tests
- Stripe webhook handling tests
- End-to-end upgrade flow tests
- Limit enforcement in API tests

### 7.3 Manual Testing Scenarios
- Free user hitting email limits
- Free user trying to create 2nd domain
- Upgrade flow from FREE to BASIC
- Usage billing calculation accuracy
- Upgrade modal triggering correctly

## Implementation Order

1. **Phase 1**: Database updates and plan configuration
2. **Phase 2**: Limit enforcement in email service (critical fix)
3. **Phase 3**: Generic upgrade modal system
4. **Phase 4**: Integration points and error handling
5. **Phase 5**: Subscription billing implementation
6. **Phase 6**: UI/UX improvements
7. **Phase 7**: Testing and validation

## Stripe Configuration Required

After implementation, you'll need to create in Stripe:

1. **Subscription Price IDs**:
   - `STRIPE_BASIC_SUBSCRIPTION_PRICE_ID` ($29/month)
   - `STRIPE_PRO_SUBSCRIPTION_PRICE_ID` ($99/month)

2. **Usage Price IDs** (if different from current):
   - `STRIPE_BASIC_USAGE_TRANSACTIONAL_PRICE_ID`
   - `STRIPE_BASIC_USAGE_MARKETING_PRICE_ID`
   - `STRIPE_PRO_USAGE_TRANSACTIONAL_PRICE_ID`
   - `STRIPE_PRO_USAGE_MARKETING_PRICE_ID`

3. **Products Configuration**:
   - Combined subscription + usage products
   - Usage reporting configuration
   - Billing thresholds setup

This plan addresses all three critical issues: enforces free tier limits, implements subscription + usage pricing, and creates a comprehensive upgrade prompt system throughout the product.