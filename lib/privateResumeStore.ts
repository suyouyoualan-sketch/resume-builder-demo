import { Pool } from "pg";

export type StoredResume = {
  resume: Record<string, unknown>;
  updatedAt: string;
};

type DatabaseGlobal = typeof globalThis & {
  easyCvPrivatePool?: Pool;
  easyCvPrivateTablePromise?: Promise<void>;
};

const databaseGlobal = globalThis as DatabaseGlobal;

function getPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!databaseGlobal.easyCvPrivatePool) {
    databaseGlobal.easyCvPrivatePool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }

  return databaseGlobal.easyCvPrivatePool;
}

async function ensureTable() {
  if (!databaseGlobal.easyCvPrivateTablePromise) {
    databaseGlobal.easyCvPrivateTablePromise = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS private_resume_snapshot (
          id SMALLINT PRIMARY KEY CHECK (id = 1),
          resume JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      .then(() => undefined)
      .catch((error) => {
        databaseGlobal.easyCvPrivateTablePromise = undefined;
        throw error;
      });
  }

  await databaseGlobal.easyCvPrivateTablePromise;
}

export async function getStoredResume(): Promise<StoredResume | null> {
  await ensureTable();

  const result = await getPool().query<{
    resume: Record<string, unknown>;
    updated_at: Date;
  }>(
    "SELECT resume, updated_at FROM private_resume_snapshot WHERE id = 1"
  );

  const row = result.rows[0];

  if (!row) return null;

  return {
    resume: row.resume,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function saveStoredResume(resume: Record<string, unknown>) {
  await ensureTable();

  const result = await getPool().query<{ updated_at: Date }>(
    `
      INSERT INTO private_resume_snapshot (id, resume, updated_at)
      VALUES (1, $1::jsonb, NOW())
      ON CONFLICT (id)
      DO UPDATE SET resume = EXCLUDED.resume, updated_at = NOW()
      RETURNING updated_at
    `,
    [JSON.stringify(resume)]
  );

  return result.rows[0].updated_at.toISOString();
}
