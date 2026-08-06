import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vecwhxowbtmbnyjvwjpn.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlY3doeG93YnRtYm55anZ3anBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzM5MjIxNiwiZXhwIjoyMDk4OTY4MjE2fQ.GPsqrp-QrLYDIAHKr6oFWqLCtcnOqHSK0q_55IssgUY'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const FIRST = [
  'Alex','Jordan','Sam','Taylor','Morgan','Riley','Casey','Avery','Quinn','Blake',
  'Drew','Peyton','Skylar','Reese','Jamie','Finley','Emerson','Harper','Logan','Cameron',
  'Dakota','Sidney','Rowan','Kendall','Hayden','Parker','Elliot','Addison','Bailey','Charlie',
  'Robin','Dylan','Sage','Shawn','Corey','Lane','Devin','Remy','Tatum','Marlowe',
  'Lennox','Presley','Sutton','Phoenix','Waverly','Zion','August','River','Sloane','Wren',
  'Aiden','Ethan','Noah','Liam','Mason','Lucas','Olivia','Emma','Ava','Mia',
  'Chloe','Sophia','Isabella','Amara','Nadia','Kai','Eli','Jaden','Priya','Arjun',
]

const LAST = [
  'Chen','Patel','Kim','Rivera','Johnson','Williams','Davis','Martinez','Thompson','Lee',
  'Garcia','Wilson','Anderson','Taylor','Thomas','Jackson','White','Harris','Martin','Moore',
  'Allen','Clark','Scott','Baker','Nelson','Hill','Young','Adams','Roberts','Wright',
  'Nguyen','Singh','Okafor','Russo','Kowalski','Nakamura','Ahmed','Osei','Ferreira','Diallo',
]

function makeName(first, last) {
  const f = first.toLowerCase()
  const l = last.toLowerCase()
  const F = first
  const L = last
  const fi = f[0]                         // first initial
  const li = l[0]                         // last initial
  const yr = randInt(1999, 2008)          // birth-year style suffix
  const n2 = randInt(10, 99)
  const n3 = randInt(100, 999)

  const styles = [
    // classic formats
    () => `${F} ${L}`,                    // "Jordan Lee"
    () => `${f}.${l}`,                    // "jordan.lee"
    () => `${f}_${l}`,                    // "jordan_lee"
    () => `${f}${l}`,                     // "jordanlee"
    () => `${F}${L}`,                     // "JordanLee"
    // initials / abbreviated
    () => `${fi}${l}`,                    // "jlee"
    () => `${fi}.${l}`,                   // "j.lee"
    () => `${f}${li}`,                    // "jordanl"
    () => `${fi}${li}${n2}`,             // "jl47"
    () => `${fi}${l}${n2}`,              // "jlee47"
    () => `${f}${n2}`,                   // "jordan47"
    () => `${f}${yr}`,                   // "jordan2004"
    () => `${F}${n2}`,                   // "Jordan47"
    // last-first
    () => `${l}${fi}`,                   // "leej"
    () => `${L}${F}`,                    // "LeeJordan"
    () => `${l}.${f}`,                   // "lee.jordan"
    // with numbers embedded
    () => `${f}${l}${n2}`,              // "jordanlee23"
    () => `${fi}${l}${yr}`,             // "jlee2003"
    // underscores + numbers
    () => `${f}_${n3}`,                  // "jordan_182"
    () => `${fi}_${l}`,                  // "j_lee"
    // mixed case quirks
    () => `${f[0].toUpperCase()}${f.slice(1)}${l[0].toUpperCase()}${l.slice(1)}`, // "JordanLee" variant
    () => `${f}${L}`,                    // "jordanLee"
    // just first name + numbers (very common)
    () => `${F}${n3}`,                   // "Jordan182"
    () => `${f}${n3}`,                   // "jordan182"
    // last name dominant
    () => `${L}${n2}`,                   // "Lee47"
    () => `${l}${n3}`,                   // "lee182"
  ]

  return pick(styles)()
}

const LESSONS = [
  'u1-1','u1-2','u1-3','u1-4','u2-1','u2-2',
  'u2-3','u3-1','u3-2','u3-3','u4-1','u4-2',
  'u4-3','u5-1','u5-2','u6-1','u7-1','u7-2',
  'u7-3','u7-4','u7-5','u8-1','u9-1','u10-1',
  'u11-1','u12-1','u13-1','u14-1','u15-1',
  'u16-1','u17-1','u18-1','u19-1','u21-1','u22-1',
]
const TESTS = ['s1-test','s2-test','s3-test','s4-test','s5-test','s6-test']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

for (let i = 0; i < 12; i++) {
  const name = makeName(pick(FIRST), pick(LAST))
  const slug  = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)
  const email = `fake.${slug}.${randInt(100,999)}@incentive-seed.test`

  // Create auth user
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password: 'Seed#2026!',
    email_confirm: true,
  })
  if (authErr) { console.error(`[${i+1}] auth error for ${name}:`, authErr.message); continue }
  const uid = authData.user.id

  // Insert profile
  await supabase.from('profiles').upsert({ id: uid, name }, { onConflict: 'id' })

  // Random lesson progress — each user completes 3–35 lessons at varied scores
  const lessonCount = randInt(3, LESSONS.length)
  const testCount   = randInt(0, Math.min(6, Math.floor(lessonCount / 5)))
  const chosenLessons = shuffle(LESSONS).slice(0, lessonCount)
  const chosenTests   = shuffle(TESTS).slice(0, testCount)

  const progressRows = [...chosenLessons, ...chosenTests].map(lesson_id => ({
    user_id:   uid,
    lesson_id,
    completed: true,
    score:     randInt(40, 100),
  }))

  const { error: progErr } = await supabase.from('lesson_progress').insert(progressRows)
  if (progErr) console.error(`[${i+1}] progress error:`, progErr.message)

  console.log(`[${i+1}/50] ${name} — ${lessonCount} lessons, ${testCount} tests`)
}

console.log('\nDone.')
