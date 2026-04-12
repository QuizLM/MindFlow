# MindFlow Quiz: Detailed React to Android (Kotlin/Jetpack Compose) Migration Guide

## 1. Executive Summary

This document provides a highly detailed conceptual breakdown for converting the **MindFlow Quiz** PWA into a **Native Android Application**.

Because MindFlow relies heavily on Supabase for the backend, the core data models, database schema, edge functions, and authentication flow remain identical. However, the frontend is a complete rewrite from React web technologies to native Android technologies using Kotlin and Jetpack Compose.

## 2. Technology Mapping

| Concept | MindFlow React (Current) | Android Native (Target) |
| :--- | :--- | :--- |
| **Language** | TypeScript | Kotlin |
| **UI Framework** | React (Declarative) | Jetpack Compose |
| **State Management** | Zustand (`useQuizSessionStore`) & React Context | `ViewModel` + Kotlin `StateFlow` / `SharedFlow` |
| **Routing**| React Router (`<BrowserRouter>`) | Jetpack Navigation Compose |
| **Styling** | Tailwind CSS | Compose Modifiers & Material 3 |
| **Backend SDK** | `@supabase/supabase-js` | Supabase Kotlin (`gotrue-kt`, `postgrest-kt`) |
| **Offline Storage** | IndexedDB (`src/lib/db.ts`) | Room Database (SQLite) |
| **Background Sync** | Service Workers (PWA) | Android WorkManager |
| **AI Integration** | `@google/genai` (Google GenAI) | `generativeai` (Google AI Client SDK for Android) |

## 3. High-Level Architecture & Clean Architecture Mapping

In migrating MindFlow to Android, we will adopt the recommended **App Architecture** (Clean Architecture):
- **UI Layer:** Jetpack Compose + ViewModels.
- **Domain Layer:** UseCases mapping to specific logic (e.g., `EvaluateAnswerUseCase`, `GenerateAIExplanationUseCase`).
- **Data Layer:** Repositories handling data fetching and offline-first caching via Room and Supabase Kotlin.

### A. Data Layer Mapping (`src/types/models.ts` -> Room Entities)
The TypeScript models in `src/types/models.ts` translate to Room Entities.
- **Question:** Becomes `@Entity(tableName = "questions") data class QuestionEntity(...)` with type converters for nested objects like `SourceInfo`, `Classification`, and `Explanation`.
- **Idiom & OWS:** Translate to `@Entity` classes for flashcards, storing `meanings`, `usage_sentences`, etc., using Room TypeConverters for lists.
- **Supabase Integration:** Replaces `supabase.from('questions').select()` with `supabase.postgrest["questions"].select().decodeList<QuestionDto>()`.

### B. The Quiz Engine (`useQuizSessionStore` -> `QuizViewModel`)
- **State:** The Zustand store holding `currentQuestionIndex`, `score`, `timer`, and `isFinished` becomes a `QuizViewModel` exposing a `MutableStateFlow<QuizState>`.
- **Actions:** Functions like `answerQuestion` or `nextQuestion` become methods in the ViewModel that update the `StateFlow`.
- **UI:** The `QuizLayout.tsx` and `QuestionDisplay.tsx` translate to `@Composable` functions that observe the state via `viewModel.uiState.collectAsState()`.

### C. Authentication (`src/features/auth` -> `GoTrue` Kotlin)
- The React `AuthGuard.tsx` and `AuthContext.tsx` translate to a centralized `AuthViewModel` or `UserRepository`.
- The UI listens to Supabase Kotlin's `supabase.gotrue.sessionStatus` flow. When `SessionStatus.Authenticated`, navigation routes to the Dashboard; otherwise, to Login.

### D. Flashcards & Animations
- The Framer Motion 3D flip effect in `src/features/flashcards` translates directly to Jetpack Compose's `Modifier.graphicsLayer { rotationY = animatable.value }`.
- Swiping logic translates to `Modifier.pointerInput` with drag detection.

### E. AI Tutor Integration
- Replaces Google GenAI JS SDK with the Android `generativeai` SDK.
- The `Ask AI Tutor` button triggers an `AITutorViewModel` which passes the current question context and options to `GenerativeModel.generateContent()`.

## 4. Phase-by-Phase Execution Plan

### Phase 1: Project Scaffolding
- Setup Android Kotlin DSL Gradle files.
- Establish `app/` module structure (`app/src/main/java/com/mindflow/quiz`).
- Introduce dependencies: Compose, Supabase Kotlin, Room, Navigation, GenerativeAI.
- Add `MainActivity.kt` with a basic theme.

### Phase 2: Core Data Layer
- Implement Room Entities based on `models.ts`.
- Initialize `SupabaseClient` in Kotlin.
- Setup `QuizRepository` for data fetching and caching.

### Phase 3: Authentication Module
- Implement Jetpack Compose UI for Login/Signup.
- Connect to `supabase.gotrue`.
- Establish Navigation Compose graph to switch from Auth to Main routes.

### Phase 4: Dashboard & Navigation
- Build the Bottom Navigation or Drawer architecture.
- Recreate the main Dashboard (`MainLayout.tsx`) showing stats, saved quizzes, and feature selection.

### Phase 5: The Quiz Engine
- Port `useQuizSessionStore` logic to `QuizViewModel`.
- Build the complex adaptive Quiz UI, incorporating Markdown/LaTeX parsing (using libraries like `markwon`).
- Implement scoring logic and the Post-Quiz Results screen.

### Phase 6: Flashcards (Idioms & OWS)
- Create interactive Compose flashcards with 3D flip animations.
- Implement spaced repetition or mastery logic backed by Room.

### Phase 7: AI Tutor & Polish
- Integrate Google Gemini natively.
- Add Text-to-Speech using Android's native `TextToSpeech` APIs.
- Enhance accessibility and apply Material Design 3 theming.
