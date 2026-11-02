import { useEffect, useState } from 'react'

export type StudentKind = 'local' | 'international'
export type Status = 'paid' | 'due' | 'overdue' | 'pending' | 'approved' | 'rejected'

export interface Student {
  kind: StudentKind
  name: string
  rollNo: string
  program: string
  batch: string
  section: string
  cgpa: number
  status: 'Active' | 'Probation'
  email: string
  phone: string
  nationality: string
  guardian: string
  passportNo?: string
  passportExpiry?: string
  visaType?: string
  visaExpiry?: string
  country?: string
  insuranceValid?: boolean
  immigrationStatus?: string
  scholarship?: string
}

export interface Semester {
  id: string
  label: string
  credits: number
  gpa: number
  status: 'Completed' | 'Current'
}

export interface Course {
  code: string
  title: string
  credits: number
  instructor: string
  days: string[]
  time: string
  room: string
  attendance: number
  grade: string
  marks: { quiz: number; assignment: number; midterm: number; final: number; project: number }
  color: string
  prerequisite?: string
}

export interface Voucher {
  id: string
  title: string
  due: string
  amount: number
  status: Status
  currency: 'PKR' | 'USD'
}

export interface LedgerEntry {
  id: string
  date: string
  description: string
  debit: number
  credit: number
  balance: number
}

export interface PortalRequest {
  id: string
  type: string
  submitted: string
  status: Status
  note: string
}

export interface PortalDocument {
  id: string
  name: string
  category: string
  status: 'Verified' | 'Pending' | 'Missing'
  updated: string
}

export interface Notification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  route: string
}

export interface Policies {
  passportBufferMonths: number
  passportWarningDays: number
  attendanceMinimum: number
  minCredits: number
  maxCredits: number
  probationCgpa: number
  scholarshipCgpa: number
  lateFeePercent: number
  semesterEnd: string
}

export interface PortalState {
  activeKind: StudentKind
  students: Record<StudentKind, Student>
  semesters: Semester[]
  courses: Course[]
  registered: string[]
  vouchers: Voucher[]
  ledger: LedgerEntry[]
  requests: PortalRequest[]
  documents: PortalDocument[]
  notifications: Notification[]
  announcements: { id: string; title: string; body: string; date: string }[]
  tickets: { id: string; subject: string; status: Status; updated: string }[]
  policies: Policies
  acknowledgements: { integrity: boolean; orientation: boolean; conduct: boolean }
  preferences: { density: 'comfortable' | 'compact'; language: string; email: boolean; sms: boolean }
  loggedIn: boolean
}

const semesters: Semester[] = [
  { id: 's24', label: 'Spring 2024', credits: 15, gpa: 3.24, status: 'Completed' },
  { id: 'f24', label: 'Fall 2024', credits: 18, gpa: 3.28, status: 'Completed' },
  { id: 's25', label: 'Spring 2025', credits: 18, gpa: 3.41, status: 'Completed' },
  { id: 'f25', label: 'Fall 2025', credits: 18, gpa: 3.51, status: 'Completed' },
  { id: 's26', label: 'Spring 2026', credits: 15, gpa: 3.28, status: 'Completed' },
  { id: 'su26', label: 'Summer 2026', credits: 6, gpa: 3.5, status: 'Completed' },
  { id: 'f26', label: 'Fall 2026', credits: 18, gpa: 3.36, status: 'Current' },
  { id: 's27', label: 'Spring 2027', credits: 0, gpa: 0, status: 'Current' },
]

const courses: Course[] = [
  { code: 'CS-413', title: 'Data Warehousing & Data Mining', credits: 3, instructor: 'Syed Imran Jami', days: ['Mon', 'Thu'], time: '11:30–12:25', room: 'Computing Lab IV', attendance: 82, grade: 'B+', marks: { quiz: 8, assignment: 9, midterm: 21, final: 38, project: 9 }, color: 'blue' },
  { code: 'CS-405', title: 'Information Security', credits: 3, instructor: 'Fauzan Saeed', days: ['Tue', 'Thu'], time: '08:30–09:25', room: 'R-301', attendance: 91, grade: 'A', marks: { quiz: 9, assignment: 9, midterm: 23, final: 42, project: 8 }, color: 'teal' },
  { code: 'CS-401', title: 'Parallel & Distributed Computing', credits: 3, instructor: 'Shaukat Wasi', days: ['Sat'], time: '09:30–10:25', room: 'Computing Lab II', attendance: 74, grade: 'B', marks: { quiz: 7, assignment: 8, midterm: 19, final: 36, project: 8 }, color: 'amber' },
  { code: 'MG-401', title: 'Principles of Management', credits: 3, instructor: 'Syed Hafeez-ur-Rahman', days: ['Sat'], time: '12:30–13:25', room: 'R-202', attendance: 88, grade: 'A-', marks: { quiz: 8, assignment: 9, midterm: 22, final: 40, project: 8 }, color: 'violet' },
  { code: 'SE-401', title: 'Software Construction & Development', credits: 3, instructor: 'Talha Ahmed', days: ['Mon'], time: '14:30–17:25', room: 'Communication Lab', attendance: 79, grade: 'B+', marks: { quiz: 8, assignment: 8, midterm: 20, final: 39, project: 9 }, color: 'rose', prerequisite: 'SE-301' },
  { code: 'SE-409', title: 'Software Quality Engineering', credits: 3, instructor: 'Usman Waheed', days: ['Wed'], time: '15:30–17:25', room: 'Computing Lab I', attendance: 86, grade: 'A-', marks: { quiz: 9, assignment: 8, midterm: 22, final: 40, project: 8 }, color: 'indigo', prerequisite: 'SE-305' },
]

export const initialState: PortalState = {
  activeKind: 'local',
  students: {
    local: { kind: 'local', name: 'Muneeb Ahmed Siddiqui', rollNo: '24SP-030-SE', program: 'BS Software Engineering', batch: 'Spring 2024', section: 'A', cgpa: 3.36, status: 'Active', email: 'muneeb.24sp@uit.edu', phone: '+92 300 1234567', nationality: 'Pakistani', guardian: 'Ahmed Siddiqui' },
    international: { kind: 'international', name: 'Amina Rahman', rollNo: '24SP-017-CS', program: 'BS Computer Science', batch: 'Spring 2024', section: 'B', cgpa: 3.18, status: 'Active', email: 'amina.24sp@uit.edu', phone: '+92 311 5550188', nationality: 'Bangladeshi', guardian: 'Farhan Khan', passportNo: 'BA0742198', passportExpiry: '2027-03-14', visaType: 'Student', visaExpiry: '2026-12-18', country: 'Bangladesh', insuranceValid: false, immigrationStatus: 'Renewal due', scholarship: 'International Merit 25%' },
  },
  semesters,
  courses,
  registered: ['CS-413', 'CS-405', 'CS-401', 'MG-401', 'SE-401', 'SE-409'],
  vouchers: [
    { id: 'FV-26091', title: 'Fall 2026 tuition & services', due: '2026-11-14', amount: 152187, status: 'due', currency: 'PKR' },
    { id: 'FV-26022', title: 'Spring 2026 tuition', due: '2026-03-10', amount: 138500, status: 'paid', currency: 'PKR' },
  ],
  ledger: [
    { id: 'L1', date: '2026-10-20', description: 'Fall 2026 tuition fee', debit: 134670, credit: 0, balance: 134670 },
    { id: 'L2', date: '2026-10-20', description: 'Semester charges', debit: 17517, credit: 0, balance: 152187 },
    { id: 'L3', date: '2026-03-08', description: 'Online payment — Spring 2026', debit: 0, credit: 138500, balance: 0 },
  ],
  requests: [
    { id: 'REQ-1042', type: 'Bonafide certificate', submitted: '2026-10-28', status: 'approved', note: 'Ready for download' },
    { id: 'REQ-1031', type: 'Course re-check', submitted: '2026-10-21', status: 'pending', note: 'With examination office' },
  ],
  documents: [
    { id: 'D1', name: 'National ID / Passport', category: 'Identity', status: 'Verified', updated: '2026-02-12' },
    { id: 'D2', name: 'Academic transcripts', category: 'Admission', status: 'Verified', updated: '2024-01-18' },
    { id: 'D3', name: 'Medical insurance', category: 'Compliance', status: 'Missing', updated: '—' },
    { id: 'D4', name: 'Equivalence certificate', category: 'Admission', status: 'Pending', updated: '2026-10-09' },
  ],
  notifications: [
    { id: 'N1', title: 'Registration closes soon', body: 'Complete your Fall 2026 registration by November 12.', time: '2h', read: false, route: 'registration' },
    { id: 'N2', title: 'Attendance shortage', body: 'CS-401 attendance is below the required 75%.', time: '1d', read: false, route: 'attendance' },
    { id: 'N3', title: 'Fee voucher generated', body: 'Fall 2026 voucher FV-26091 is ready.', time: '2d', read: true, route: 'finance/vouchers' },
  ],
  announcements: [
    { id: 'A1', title: 'Fall 2026 course registration', body: 'Registration is open for all eligible undergraduate students.', date: '2026-11-05' },
    { id: 'A2', title: 'Midterm examination datesheet', body: 'The revised midterm examination schedule is available.', date: '2026-11-03' },
  ],
  tickets: [{ id: 'T-882', subject: 'Unable to access lab portal', status: 'pending', updated: '2026-11-03' }],
  policies: { passportBufferMonths: 6, passportWarningDays: 90, attendanceMinimum: 75, minCredits: 12, maxCredits: 21, probationCgpa: 2, scholarshipCgpa: 3, lateFeePercent: 5, semesterEnd: '2027-01-31' },
  acknowledgements: { integrity: false, orientation: false, conduct: false },
  preferences: { density: 'comfortable', language: 'English', email: true, sms: false },
  loggedIn: false,
}

const STORAGE_KEY = 'uit-portal-v4'

export function usePortalStore() {
  const [state, setState] = useState<PortalState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
    } catch {
      return initialState
    }
  })
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state])
  const update = (recipe: (current: PortalState) => PortalState) => setState(current => recipe(current))
  const reset = () => { localStorage.removeItem(STORAGE_KEY); setState(initialState) }
  return { state, update, reset }
}

export const money = (value: number, currency = 'PKR') =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
