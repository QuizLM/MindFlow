package com.mindflow.quiz.di

import android.content.Context
import com.mindflow.quiz.data.local.MindFlowDatabase
import com.mindflow.quiz.data.repository.QuizRepository
import com.mindflow.quiz.data.repository.VocabularyRepository

/**
 * AppContainer provides manual Dependency Injection.
 * In a larger scale app, this would be replaced by Dagger Hilt or Koin.
 * This ensures Repositories and DAOs are singletons instantiated only once.
 */
interface AppContainer {
    val quizRepository: QuizRepository
    val vocabularyRepository: VocabularyRepository
}

class DefaultAppContainer(private val context: Context) : AppContainer {

    // Lazy initialization of the Room Database
    private val database: MindFlowDatabase by lazy {
        MindFlowDatabase.getDatabase(context)
    }

    // Lazy initialization of Repositories, passing in the required DAOs
    override val quizRepository: QuizRepository by lazy {
        QuizRepository(database.questionDao())
    }

    override val vocabularyRepository: VocabularyRepository by lazy {
        VocabularyRepository(database.idiomDao(), database.oneWordDao())
    }
}
