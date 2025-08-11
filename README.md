# Developer Assessment Platform

Aplikasi web berbasis React untuk melakukan assessment developer dengan berbagai jenis challenge (coding dan open-ended questions).

## Fitur Utama

### 1. **Halaman Login**
- Input nama dan email candidate
- Validasi assessment ID dari URL
- Tampilan informasi assessment

### 2. **Dashboard Challenge**
- List semua challenges dalam assessment
- Progress tracking
- Indikator status completion

### 3. **Halaman Challenge Detail**
- **Open-ended Questions**: Textarea untuk jawaban bebas
- **Coding Challenges**: 
  - File tree explorer dengan add/delete files
  - Monaco code editor dengan syntax highlighting
  - Multi-language support (JavaScript, TypeScript, Python, Java, C++, dll)
  - Auto-save draft functionality
- Timer countdown untuk challenges terbatas waktu
- Save draft dan submit functionality

### 4. **Sistem Submission**
- Auto-submit saat waktu habis
- Konfirmasi sebelum submit
- Track completed challenges
- Final assessment submission

## Teknologi yang Digunakan

- **React** dengan **Vite** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **Monaco Editor** - Code editor (VS Code editor)
- **Lucide React** - Icons
- **Context API** - State management

## Instalasi dan Setup

### Prerequisites
- Node.js (v18+)
- npm atau yarn

### Langkah Instalasi

1. **Install dependencies**
```bash
npm install
```

2. **Jalankan development server**
```bash
npm run dev
```

3. **Akses aplikasi**
Buka browser dan kunjungi: `http://localhost:5173`

## Penggunaan

### **Demo URL untuk Testing:**
`http://localhost:5173/assessment/assessment-123`

### **Flow Aplikasi:**
1. Candidate mengakses URL assessment yang diberikan
2. Input nama dan email di halaman login
3. Masuk ke dashboard dengan list challenges
4. Pilih challenge yang ingin dikerjakan
5. Kerjakan challenge (coding atau text answer)
6. Submit individual challenge
7. Setelah semua challenge selesai, submit final assessment

## Data Sample untuk Testing

### **Assessment ID:**
- `assessment-123` - Frontend Developer Assessment

### **Challenges Available:**
1. **React Component Implementation** (Code) - 60 menit
2. **Algorithm Problem** (Open-ended) - 30 menit  
3. **System Design Question** (Open-ended) - 45 menit

## API Endpoints (Mock)

Project menggunakan mock API dengan data dummy di `src/services/api.js`:

- `authenticate(name, email, assessmentId)` - Login candidate
- `getAssessment(assessmentId)` - Get assessment details
- `getChallenges(assessmentId)` - Get list challenges
- `getChallengeDetails(challengeId)` - Get challenge detail
- `submitChallenge(submissionData)` - Submit individual challenge
- `submitAssessment(assessmentData)` - Submit final assessment

## Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview build
npm run preview
```

**Credentials untuk testing:** Nama dan email apa saja yang valid.
