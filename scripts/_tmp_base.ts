import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { readFileSync } from "node:fs";
import { splitSql } from "./migration-plan";
const db = new PGlite({ extensions: { pgcrypto, btree_gist } });
const stmts = splitSql(readFileSync("/dev-server/db/0000_baseline.sql","utf8"));
let fails=0;
for (const s of stmts) { try { await db.exec(s); } catch(e:any) { fails++; if (fails<25) console.log("FAIL:", String(e.message).slice(0,150), "::", s.slice(0,160).replace(/\n/g," ")); } }
console.log("statements", stmts.length, "fails", fails);
