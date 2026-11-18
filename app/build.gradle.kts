plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val buildNumber = (System.getenv("GITHUB_RUN_NUMBER") ?: "1").toInt()

android {
    namespace = "uz.englishdaily"
    compileSdk = 34

    defaultConfig {
        applicationId = "uz.englishdaily.app"
        minSdk = 26
        targetSdk = 34
        versionCode = buildNumber
        versionName = "1.$buildNumber"
    }

    signingConfigs {
        create("release") {
            // Ключ хранится в репозитории, чтобы каждое обновление ставилось поверх старой версии.
            storeFile = file("release.jks")
            storePassword = "englishdaily"
            keyAlias = "englishdaily"
            keyPassword = "englishdaily"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    sourceSets {
        getByName("main") {
            // Веб-часть приложения (уроки и интерфейс) берётся из папки web/
            assets.srcDirs("src/main/assets", "../web")
        }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.11.0")
}
