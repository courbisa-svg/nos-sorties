package fr.nossorties.app;

import android.content.Intent;
import android.provider.CalendarContract;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Agenda")
public class AgendaPlugin extends Plugin {

    @PluginMethod
    public void add(PluginCall call) {
        String title = call.getString("title", "");
        String location = call.getString("location", "");
        String description = call.getString("description", "");
        Double begin = call.getDouble("begin");
        Double end = call.getDouble("end");
        Boolean allDay = call.getBoolean("allDay", false);

        Intent intent = new Intent(Intent.ACTION_INSERT);
        intent.setData(CalendarContract.Events.CONTENT_URI);
        intent.putExtra(CalendarContract.Events.TITLE, title);
        intent.putExtra(CalendarContract.Events.EVENT_LOCATION, location);
        intent.putExtra(CalendarContract.Events.DESCRIPTION, description);
        intent.putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, allDay != null && allDay);
        if (allDay != null && allDay) {
            intent.putExtra(CalendarContract.Events.EVENT_TIMEZONE, "UTC");
        }
        if (begin != null) {
            intent.putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, begin.longValue());
        }
        if (end != null) {
            intent.putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end.longValue());
        }
        try {
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Aucune application d'agenda trouvée sur ce téléphone");
        }
    }
}
