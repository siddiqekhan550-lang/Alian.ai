import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface UserCredits {
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  generation_id?: string;
  type: 'welcome_bonus' | 'generation_deduction' | 'refund' | 'admin_grant';
  amount: number;
  balance_after: number;
  description: string;
  idempotency_key?: string;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  type: 'image' | 'video';
  prompt: string;
  duration?: number; // 4, 5, 8, 10
  aspect_ratio: string; // '1:1', '16:9', '9:16', '4:3', '3:4'
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  output_url?: string;
  thumbnail_url?: string;
  provider: 'openai' | 'runway' | 'gemini';
  provider_task_id?: string;
  credits_charged: number;
  error_message?: string;
  created_at: string;
  reference_image_url?: string;
}

export interface UserUpload {
  id: string;
  user_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  created_at: string;
}

export interface GenerationSettings {
  image_credit_cost: number;
  video_credit_costs: {
    4: number;
    5: number;
    8: number;
    10: number;
  };
  new_user_credits: number;
  openai_api_key?: string;
  runway_api_key?: string;
  active_image_provider: 'openai' | 'gemini' | 'auto';
  active_video_provider: 'runway' | 'gemini' | 'auto';
}

interface DatabaseSchema {
  users: User[];
  credits: Record<string, number>; // user_id -> balance
  transactions: CreditTransaction[];
  generations: Generation[];
  uploads: UserUpload[];
  settings: GenerationSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'alien_ai_database.json');

const defaultSettings: GenerationSettings = {
  image_credit_cost: 5,
  video_credit_costs: {
    4: 5,
    5: 8,
    8: 10,
    10: 15,
  },
  new_user_credits: 50,
  active_image_provider: 'auto',
  active_video_provider: 'auto',
};

// Seed demo featured generation from blueprint page 7 ("Scene 1 · The sleepy dragon")
const defaultDragonVideo: Generation = {
  id: 'featured-dragon-01',
  user_id: 'system',
  type: 'video',
  prompt: 'Scene 1 · The sleepy dragon awakening in an enchanted bioluminescent nebula forest, cinematic 8k lighting, emerald glow',
  duration: 8,
  aspect_ratio: '16:9',
  status: 'completed',
  progress: 100,
  output_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80',
  thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  provider: 'runway',
  provider_task_id: 'task-dragon-featured',
  credits_charged: 10,
  created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
};

class AlienDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'alien_salt_2026').digest('hex');
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing db file, initializing fresh:', err);
    }

    // Initial seed
    const adminUser: User = {
      id: 'admin-user-01',
      username: 'AlienAdmin',
      email: 'admin@alien.ai',
      password_hash: this.hashPassword('AlienAdmin2026!'),
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      created_at: new Date().toISOString(),
    };

    const initialDb: DatabaseSchema = {
      users: [adminUser],
      credits: {
        'admin-user-01': 500,
      },
      transactions: [
        {
          id: 'tx-admin-initial',
          user_id: 'admin-user-01',
          type: 'admin_grant',
          amount: 500,
          balance_after: 500,
          description: 'Initial Administrator balance grant',
          created_at: new Date().toISOString(),
        },
      ],
      generations: [defaultDragonVideo],
      uploads: [],
      settings: defaultSettings,
    };

    this.saveData(initialDb);
    return initialDb;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- USER & AUTH METHODS ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(params: {
    username: string;
    email: string;
    password: string;
    avatar_url?: string;
  }): { user: User; isFirstSignup: boolean; creditsAwarded: number } {
    const existing = this.findUserByEmail(params.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = 'usr_' + crypto.randomUUID().slice(0, 12);
    const newUser: User = {
      id: userId,
      username: params.username.trim() || params.email.split('@')[0],
      email: params.email.toLowerCase().trim(),
      password_hash: this.hashPassword(params.password),
      avatar_url:
        params.avatar_url ||
        `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(params.username)}`,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    this.data.users.push(newUser);

    // Initial 50 free credits awarded strictly ONCE upon first-time signup
    const welcomeCredits = this.data.settings.new_user_credits || 50;
    this.data.credits[userId] = welcomeCredits;

    const tx: CreditTransaction = {
      id: 'tx_' + crypto.randomUUID().slice(0, 12),
      user_id: userId,
      type: 'welcome_bonus',
      amount: welcomeCredits,
      balance_after: welcomeCredits,
      description: 'Welcome Bonus: 50 Free Credits on First Signup',
      created_at: new Date().toISOString(),
    };
    this.data.transactions.unshift(tx);

    this.persist();
    return { user: newUser, isFirstSignup: true, creditsAwarded: welcomeCredits };
  }

  public verifyPassword(user: User, password: string): boolean {
    return user.password_hash === this.hashPassword(password);
  }

  public updateProfile(userId: string, updates: { username?: string; avatar_url?: string }): User {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');
    if (updates.username) user.username = updates.username.trim();
    if (updates.avatar_url) user.avatar_url = updates.avatar_url;
    this.persist();
    return user;
  }

  // --- CREDITS METHODS ---
  public getBalance(userId: string): number {
    return this.data.credits[userId] ?? 0;
  }

  public getTransactions(userId: string): CreditTransaction[] {
    return this.data.transactions.filter((t) => t.user_id === userId);
  }

  public reserveCredits(userId: string, amount: number, description: string, generationId?: string): { success: boolean; balanceAfter: number } {
    const current = this.getBalance(userId);
    if (current < amount) {
      return { success: false, balanceAfter: current };
    }

    const nextBalance = current - amount;
    this.data.credits[userId] = nextBalance;

    const tx: CreditTransaction = {
      id: 'tx_' + crypto.randomUUID().slice(0, 12),
      user_id: userId,
      generation_id: generationId,
      type: 'generation_deduction',
      amount: -amount,
      balance_after: nextBalance,
      description,
      created_at: new Date().toISOString(),
    };
    this.data.transactions.unshift(tx);
    this.persist();

    return { success: true, balanceAfter: nextBalance };
  }

  public refundCredits(userId: string, amount: number, description: string, generationId?: string): number {
    const current = this.getBalance(userId);
    const nextBalance = current + amount;
    this.data.credits[userId] = nextBalance;

    const tx: CreditTransaction = {
      id: 'tx_' + crypto.randomUUID().slice(0, 12),
      user_id: userId,
      generation_id: generationId,
      type: 'refund',
      amount: amount,
      balance_after: nextBalance,
      description: `Refund: ${description}`,
      created_at: new Date().toISOString(),
    };
    this.data.transactions.unshift(tx);
    this.persist();

    return nextBalance;
  }

  // --- GENERATIONS METHODS ---
  public createGeneration(gen: Omit<Generation, 'id' | 'created_at' | 'progress'>): Generation {
    const newGen: Generation = {
      ...gen,
      id: 'gen_' + crypto.randomUUID().slice(0, 12),
      progress: gen.status === 'completed' ? 100 : 10,
      created_at: new Date().toISOString(),
    };

    this.data.generations.unshift(newGen);
    this.persist();
    return newGen;
  }

  public updateGeneration(id: string, updates: Partial<Generation>): Generation | undefined {
    const gen = this.data.generations.find((g) => g.id === id);
    if (!gen) return undefined;

    Object.assign(gen, updates);
    this.persist();
    return gen;
  }

  public getGeneration(id: string): Generation | undefined {
    return this.data.generations.find((g) => g.id === id);
  }

  public getUserGenerations(userId: string, filter?: { type?: string; status?: string; search?: string }): Generation[] {
    return this.data.generations.filter((g) => {
      // Must belong to this user (or system default for preview)
      if (g.user_id !== userId && g.user_id !== 'system') return false;

      if (filter?.type && filter.type !== 'all' && g.type !== filter.type) return false;
      if (filter?.status && filter.status !== 'all' && g.status !== filter.status) return false;
      if (filter?.search && !g.prompt.toLowerCase().includes(filter.search.toLowerCase())) return false;

      return true;
    });
  }

  public deleteGeneration(id: string, userId: string): boolean {
    const idx = this.data.generations.findIndex((g) => g.id === id && (g.user_id === userId || userId === 'admin-user-01'));
    if (idx === -1) return false;

    this.data.generations.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- UPLOADS METHODS ---
  public addUpload(userId: string, file_url: string, file_type: string, file_name: string): UserUpload {
    const upload: UserUpload = {
      id: 'up_' + crypto.randomUUID().slice(0, 12),
      user_id: userId,
      file_url,
      file_type,
      file_name,
      created_at: new Date().toISOString(),
    };
    this.data.uploads.unshift(upload);
    this.persist();
    return upload;
  }

  public getUserUploads(userId: string): UserUpload[] {
    return this.data.uploads.filter((u) => u.user_id === userId);
  }

  // --- SETTINGS & ADMIN ---
  public getSettings(): GenerationSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<GenerationSettings>): GenerationSettings {
    Object.assign(this.data.settings, updates);
    this.persist();
    return this.data.settings;
  }

  public getAdminOverview() {
    return {
      totalUsers: this.data.users.length,
      totalGenerations: this.data.generations.length,
      totalImages: this.data.generations.filter((g) => g.type === 'image').length,
      totalVideos: this.data.generations.filter((g) => g.type === 'video').length,
      totalCreditsInCirculation: Object.values(this.data.credits).reduce((a, b) => a + b, 0),
      recentTransactions: this.data.transactions.slice(0, 20),
      recentGenerations: this.data.generations.slice(0, 20),
      users: this.data.users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        balance: this.getBalance(u.id),
        created_at: u.created_at,
      })),
    };
  }
}

export const db = new AlienDatabase();
