import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('data/ktu-instructors-full.md', 'utf8');
const lines = content.split('\n');

const escape = (s) => s.replace(/'/g, "''").trim();

// ── 1. Üniversite ──────────────────────────────────────────────────
const uniId = 'aaaaaaaa-0000-0000-0000-000000000001';
let sql = `-- KampusKarne Seed Verisi — KTÜ\n\n`;
sql += `INSERT INTO universities (id, name) VALUES\n  ('${uniId}', 'Karadeniz Teknik Üniversitesi')\n  ON CONFLICT (name) DO NOTHING;\n\n`;

// ── 2. Bölümler ────────────────────────────────────────────────────
const deptNames = [];
let inDepts = false;
for (const line of lines) {
  if (line.includes('## Bölümler')) { inDepts = true; continue; }
  if (inDepts && line.startsWith('## ')) break;
  if (inDepts) {
    const m = line.match(/^- \[.\] (.+)/);
    if (m) deptNames.push(m[1].trim());
  }
}

// dept adı → sabit id map
const deptMap = {};
deptNames.forEach((name, i) => {
  const id = `bbbbbbbb-0000-0000-0000-${String(i + 1).padStart(12, '0')}`;
  deptMap[name] = id;
});

sql += `INSERT INTO departments (id, university_id, name) VALUES\n`;
const deptRows = Object.entries(deptMap).map(
  ([name, id]) => `  ('${id}', '${uniId}', '${escape(name)}')`
);
sql += deptRows.join(',\n') + `\n  ON CONFLICT (university_id, name) DO NOTHING;\n\n`;

// ── 3. Hocalar ve Dersler ──────────────────────────────────────────
const instructors = [];
const courses = [];

let currentInstructor = null;
let instrIdx = 0;
let courseIdx = 0;

// Hoca satırı tespiti: ### ile başlayan ve bilinen unvan içeren
const TITLE_RE = /^### ((?:Prof\.|Doç\.|Dr\.|Arş\.|Öğr\.|Yrd\.).+)/;
const DEPT_RE = /^\s*-\s*\*\*Ana Bölüm:\*\*\s*(.+)/;
const COURSE_RE = /^\s*-\s+([A-ZÇĞİÖŞÜa-zçğışöşü0-9]+)\s*[—–-]+\s*([^—–-]+?)\s*[—–-]+\s*([^—–-]+?)(?:\s*[—–-]+\s*.+)?$/;

// unvan çıkar
const extractTitle = (name) => {
  const titles = ['Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi', 'Dr.', 'Arş. Gör. Dr.', 'Arş. Gör.', 'Öğr. Gör. Dr.', 'Öğr. Gör.', 'Yrd. Doç. Dr.'];
  for (const t of titles) {
    if (name.startsWith(t)) return { title: t, full_name: name.slice(t.length).trim() };
  }
  return { title: null, full_name: name.trim() };
};

for (const line of lines) {
  const titleMatch = line.match(TITLE_RE);
  if (titleMatch) {
    currentInstructor = {
      id: `cccccccc-0000-0000-0000-${String(++instrIdx).padStart(12, '0')}`,
      raw: titleMatch[1].trim(),
      dept_id: null,
    };
    const { title, full_name } = extractTitle(currentInstructor.raw);
    currentInstructor.title = title;
    currentInstructor.full_name = full_name;
    instructors.push(currentInstructor);
    continue;
  }

  if (currentInstructor) {
    const deptMatch = line.match(DEPT_RE);
    if (deptMatch) {
      const dname = deptMatch[1].trim();
      currentInstructor.dept_id = deptMap[dname] || null;
      continue;
    }

    const courseMatch = line.match(COURSE_RE);
    if (courseMatch) {
      const code = courseMatch[1].trim();
      const name = courseMatch[2].trim();
      const deptName = courseMatch[3].trim();
      const deptId = deptMap[deptName] || currentInstructor.dept_id;
      courses.push({
        id: `dddddddd-0000-0000-0000-${String(++courseIdx).padStart(12, '0')}`,
        code,
        name,
        dept_id: deptId,
        instructor_id: currentInstructor.id,
      });
    }
  }
}

// Aynı hoca adından gelen duplikatları temizle, ID'leri remap et
const seenNames = new Map(); // full_name → ilk id
const idRemap = new Map();   // duplicate id → ilk id
const uniqueInstructors = instructors.filter(i => {
  const key = i.full_name.toLowerCase();
  if (seenNames.has(key)) {
    idRemap.set(i.id, seenNames.get(key));
    return false;
  }
  seenNames.set(key, i.id);
  return true;
});

// Derslerin instructor_id'sini remap et
courses.forEach(c => {
  if (idRemap.has(c.instructor_id)) {
    c.instructor_id = idRemap.get(c.instructor_id);
  }
});

sql += `INSERT INTO instructors (id, full_name, title, department_id) VALUES\n`;
sql += uniqueInstructors.map(i =>
  `  ('${i.id}', '${escape(i.full_name)}', ${i.title ? `'${escape(i.title)}'` : 'NULL'}, ${i.dept_id ? `'${i.dept_id}'` : 'NULL'})`
).join(',\n');
sql += `\n  ON CONFLICT DO NOTHING;\n\n`;

// Ders duplikatlarını temizle (aynı kod + hoca)
const seenCourses = new Set();
const uniqueCourses = courses.filter(c => {
  const key = `${c.code}__${c.instructor_id}`;
  if (seenCourses.has(key)) return false;
  seenCourses.add(key);
  return true;
});

if (uniqueCourses.length > 0) {
  sql += `INSERT INTO courses (id, code, name, instructor_id, department_id) VALUES\n`;
  sql += uniqueCourses.map(c =>
    `  ('${c.id}', '${escape(c.code)}', '${escape(c.name)}', '${c.instructor_id}', ${c.dept_id ? `'${c.dept_id}'` : 'NULL'})`
  ).join(',\n');
  sql += `\n  ON CONFLICT DO NOTHING;\n\n`;
}

writeFileSync('supabase/seed.sql', sql);

console.log(`✓ Üniversite: 1`);
console.log(`✓ Bölüm: ${deptNames.length}`);
console.log(`✓ Hoca: ${uniqueInstructors.length}`);
console.log(`✓ Ders: ${uniqueCourses.length}`);
console.log(`✓ supabase/seed.sql oluşturuldu`);
