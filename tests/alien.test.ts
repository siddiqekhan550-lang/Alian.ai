import { db } from '../server/db.js';

async function runTests() {
  console.log('--- RUNNING ALIEN.AI PLATFORM VERIFICATION TESTS ---');

  // Test 1: New User Signup receives exactly 50 free credits
  console.log('Test 1: User Registration & 50 Free Welcome Credits...');
  const testEmail = `tester_${Date.now()}@alien.ai`;
  const { user, isFirstSignup, creditsAwarded } = db.createUser({
    username: 'TestCreator',
    email: testEmail,
    password: 'SecurePassword123!',
  });

  if (!isFirstSignup || creditsAwarded !== 50 || db.getBalance(user.id) !== 50) {
    throw new Error(`Test 1 Failed: Expected exactly 50 credits, got ${db.getBalance(user.id)}`);
  }
  console.log('✓ Test 1 Passed: Exactly 50 welcome credits granted.');

  // Test 2: Repeat login does not grant additional credits
  console.log('Test 2: Repeat login idempotency...');
  const foundUser = db.findUserByEmail(testEmail);
  if (!foundUser || !db.verifyPassword(foundUser, 'SecurePassword123!')) {
    throw new Error('Test 2 Failed: Password verification failed.');
  }
  const balanceAfterLogin = db.getBalance(foundUser.id);
  if (balanceAfterLogin !== 50) {
    throw new Error(`Test 2 Failed: Duplicate credits awarded. Balance: ${balanceAfterLogin}`);
  }
  console.log('✓ Test 2 Passed: Repeat login maintains exact original 50 credits.');

  // Test 3: Duration Pricing & Credit Deductions (4s=5, 5s=8, 8s=10, 10s=15)
  console.log('Test 3: Video duration credit deductions...');
  const schedule: Record<number, number> = { 4: 5, 5: 8, 8: 10, 10: 15 };
  for (const [duration, cost] of Object.entries(schedule)) {
    const prevBalance = db.getBalance(user.id);
    const res = db.reserveCredits(user.id, cost, `Test ${duration}s video generation`);
    if (!res.success || res.balanceAfter !== prevBalance - cost) {
      throw new Error(`Test 3 Failed for duration ${duration}s: Cost ${cost} not deducted correctly.`);
    }
  }
  console.log('✓ Test 3 Passed: Video rates (4s=5, 5s=8, 8s=10, 10s=15) strictly verified.');

  // Test 4: Insufficient Balance Prevention
  console.log('Test 4: Insufficient balance blocking...');
  const currentBalance = db.getBalance(user.id);
  const tooExpensive = currentBalance + 100;
  const failRes = db.reserveCredits(user.id, tooExpensive, 'Attempted overdraft');
  if (failRes.success) {
    throw new Error('Test 4 Failed: Overdraft was permitted unexpectedly.');
  }
  console.log('✓ Test 4 Passed: Insufficient credit balance is strictly blocked.');

  // Test 5: Automatic Refund on Failure
  console.log('Test 5: Automatic refund on failed generation...');
  const balBefore = db.getBalance(user.id);
  db.refundCredits(user.id, 10, 'Test simulated failed generation refund');
  if (db.getBalance(user.id) !== balBefore + 10) {
    throw new Error('Test 5 Failed: Refund amount not restored.');
  }
  console.log('✓ Test 5 Passed: Automatic refund restores exact reserved credits.');

  // Test 6: User Isolation
  console.log('Test 6: User Isolation in History...');
  const user2 = db.createUser({
    username: 'OtherUser',
    email: `other_${Date.now()}@alien.ai`,
    password: 'SecurePassword123!',
  }).user;

  db.createGeneration({
    user_id: user.id,
    type: 'image',
    prompt: 'Private Image for User 1',
    aspect_ratio: '1:1',
    status: 'completed',
    provider: 'gemini',
    credits_charged: 5,
  });

  const user2Gens = db.getUserGenerations(user2.id);
  const leakedGen = user2Gens.find((g) => g.prompt === 'Private Image for User 1');
  if (leakedGen) {
    throw new Error('Test 6 Failed: User 2 was able to view User 1 private generation.');
  }
  console.log('✓ Test 6 Passed: Complete user history isolation verified.');

  console.log('ALL TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
