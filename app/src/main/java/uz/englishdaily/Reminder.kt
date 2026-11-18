package uz.englishdaily

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import java.util.Calendar

/** Ежедневное напоминание об уроке (по умолчанию 20:00). */
object Reminder {
    private const val PREFS = "reminder"
    const val CHANNEL = "daily_lesson"

    fun get(c: Context): String {
        val p = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        return String.format("%02d:%02d", p.getInt("h", 20), p.getInt("m", 0))
    }

    fun set(c: Context, h: Int, m: Int) {
        c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putInt("h", h).putInt("m", m).apply()
        schedule(c)
    }

    fun schedule(c: Context) {
        val p = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, p.getInt("h", 20))
            set(Calendar.MINUTE, p.getInt("m", 0))
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis() + 5000) add(Calendar.DAY_OF_YEAR, 1)
        }
        val am = c.getSystemService(AlarmManager::class.java) ?: return
        val pi = PendingIntent.getBroadcast(
            c, 0, Intent(c, ReminderReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        // Окно 5 минут: не требует особых разрешений и почти точно по времени.
        am.setWindow(AlarmManager.RTC_WAKEUP, cal.timeInMillis, 5 * 60 * 1000L, pi)
    }

    fun ensureChannel(c: Context) {
        val nm = c.getSystemService(NotificationManager::class.java) ?: return
        if (nm.getNotificationChannel(CHANNEL) == null) {
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL, "Урок дня", NotificationManager.IMPORTANCE_HIGH).apply {
                    description = "Ежедневное напоминание об уроке английского"
                }
            )
        }
    }

    fun canNotify(c: Context): Boolean =
        Build.VERSION.SDK_INT < 33 ||
            c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
}

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminder.ensureChannel(context)
        if (Reminder.canNotify(context)) {
            val open = PendingIntent.getActivity(
                context, 1, Intent(context, MainActivity::class.java),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val n = android.app.Notification.Builder(context, Reminder.CHANNEL)
                .setSmallIcon(R.drawable.ic_stat)
                .setContentTitle("Время английского 🇬🇧")
                .setContentText("Урок дня ждёт: слова, правило, тренировка и говорение — 25 минут.")
                .setContentIntent(open)
                .setAutoCancel(true)
                .build()
            context.getSystemService(android.app.NotificationManager::class.java)?.notify(100, n)
        }
        Reminder.schedule(context) // следующее напоминание — завтра
    }
}

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminder.schedule(context)
    }
}
