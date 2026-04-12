package com.mindflow.quiz

import android.app.Application
import com.mindflow.quiz.di.AppContainer
import com.mindflow.quiz.di.DefaultAppContainer

/**
 * Custom Application class used to initialize global state like Dependency Injection.
 * We need to register this in the AndroidManifest.xml.
 */
class MindFlowApplication : Application() {

    // AppContainer instance used by the rest of classes to obtain dependencies
    lateinit var container: AppContainer

    override fun onCreate() {
        super.onCreate()
        container = DefaultAppContainer(this)
    }
}
