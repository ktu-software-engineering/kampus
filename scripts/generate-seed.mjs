// ktu-courses.json → supabase/seed.sql dönüştürücü
import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(readFileSync("data/ktu-courses.json", "utf8"));

const KTU_ID = "aaaaaaaa-0000-0000-0000-000000000001";

// UUID üretici — format: {prefix}-0000-0000-0000-{counter 12 hex}
// prefix 8 hex karakter olmalı (örn: "bbbbbbbb")
const counters = {};
function nextId(prefix) {
  counters[prefix] = (counters[prefix] || 0) + 1;
  const hex = counters[prefix].toString(16).padStart(12, "0");
  return `${prefix}-0000-0000-0000-${hex}`;
}

const departments = new Map(); // name → { id, name }
const instructors = new Map(); // "TITLE|NAME" → { id, title, name }
const courses = [];
const courseInstructors = [];

for (const program of data.programs) {
  if (program.status !== "ok" || !program.courses?.length) continue;

  const deptName = program.name.trim();
  if (!departments.has(deptName)) {
    departments.set(deptName, { id: nextId("dddddddd"), name: deptName });
  }
  const dept = departments.get(deptName);

  for (const course of program.courses) {
    if (!course.code || !course.name) continue;

    const courseId = nextId("eeeeeeee");
    courses.push({
      id: courseId,
      code: course.code.trim(),
      name: course.name.trim(),
      department_id: dept.id,
    });

    for (const inst of course.instructors ?? []) {
      if (!inst.name) continue;
      const key = `${(inst.title ?? "").trim()}|${inst.name.trim()}`;
      if (!instructors.has(key)) {
        instructors.set(key, {
          id: nextId("cccccccc"),
          title: (inst.title ?? "").trim() || null,
          full_name: inst.name.trim(),
        });
      }
      courseInstructors.push({
        course_id: courseId,
        instructor_id: instructors.get(key).id,
      });
    }
  }
}

function esc(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}

const lines = [];

lines.push("-- KampusKarne Seed Verisi — KTÜ");
lines.push("-- Otomatik üretilmiştir: scripts/generate-seed.mjs\n");

// Üniversite
lines.push("INSERT INTO universities (id, name) VALUES");
lines.push(`  (${esc(KTU_ID)}, 'Karadeniz Teknik Üniversitesi')`);
lines.push("ON CONFLICT (name) DO NOTHING;\n");

// Bölümler
lines.push("INSERT INTO departments (id, university_id, name) VALUES");
const deptRows = [...departments.values()].map(
  (d) => `  (${esc(d.id)}, ${esc(KTU_ID)}, ${esc(d.name)})`
);
lines.push(deptRows.join(",\n"));
lines.push("ON CONFLICT (university_id, name) DO NOTHING;\n");

// Hocalar
lines.push("INSERT INTO instructors (id, full_name, title) VALUES");
const instRows = [...instructors.values()].map(
  (i) => `  (${esc(i.id)}, ${esc(i.full_name)}, ${esc(i.title)})`
);
lines.push(instRows.join(",\n"));
lines.push("ON CONFLICT DO NOTHING;\n");

// Dersler — 500'lük batchler halinde (PostgreSQL limit)
const BATCH = 500;
for (let i = 0; i < courses.length; i += BATCH) {
  const batch = courses.slice(i, i + BATCH);
  lines.push("INSERT INTO courses (id, code, name, department_id) VALUES");
  lines.push(
    batch
      .map(
        (c) =>
          `  (${esc(c.id)}, ${esc(c.code)}, ${esc(c.name)}, ${esc(c.department_id)})`
      )
      .join(",\n")
  );
  lines.push("ON CONFLICT DO NOTHING;\n");
}

// Ders-Hoca bağlantıları — 500'lük batchler
for (let i = 0; i < courseInstructors.length; i += BATCH) {
  const batch = courseInstructors.slice(i, i + BATCH);
  lines.push("INSERT INTO course_instructors (course_id, instructor_id) VALUES");
  lines.push(
    batch
      .map((ci) => `  (${esc(ci.course_id)}, ${esc(ci.instructor_id)})`)
      .join(",\n")
  );
  lines.push("ON CONFLICT DO NOTHING;\n");
}

const sql = lines.join("\n");
writeFileSync("supabase/seed.sql", sql, "utf8");

const stats = {
  departments: departments.size,
  instructors: instructors.size,
  courses: courses.length,
  course_instructors: courseInstructors.length,
};
console.log("Seed üretildi:", stats);
