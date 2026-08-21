import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
  Trash2,
  Loader2,
  Radio,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlusCircle,
  X,
  Link as LinkIcon
} from "lucide-react";

const API_URL = "http://localhost:5000/api/events";

export default function EventsView({
  currentUser,
  searchQuery = ""
}) {
  const [events, setEvents] = useState([]);

  const [activeTab, setActiveTab] = useState("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState("Workshop");

  const [venue, setVenue] = useState("");

  const [startDateTime, setStartDateTime] =
    useState("");

  const [endDateTime, setEndDateTime] =
    useState("");

  const [registrationDeadline, setRegistrationDeadline] =
    useState("");

  const [registrationLink, setRegistrationLink] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const tabs = [
    "All",
    "Upcoming",
    "Registered",
    "Past"
  ];

  const categories = [
    "Workshop",
    "Seminar",
    "Fest",
    "Annual Day",
    "Auditorium Session",
    "Resume Session",
    "Other"
  ];

  // ==========================================
  // FETCH EVENTS
  // ==========================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        API_URL,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const text =
        await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(
          "Invalid server response:",
          text
        );

        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to fetch events"
        );
      }

      setEvents(
        data.events || []
      );

    } catch (error) {
      console.error(
        "Fetch events error:",
        error
      );

      setError(
        error.message ||
        "Failed to load events"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================================
  // CREATE EVENT
  // ==========================================

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(
        "Please enter an event title."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter an event description."
      );
      return;
    }

    if (!venue.trim()) {
      setError(
        "Please enter the venue."
      );
      return;
    }

    if (!startDateTime) {
      setError(
        "Please select the event start date and time."
      );
      return;
    }

    if (!endDateTime) {
      setError(
        "Please select the event end date and time."
      );
      return;
    }

    if (!registrationDeadline) {
      setError(
        "Please select the registration deadline."
      );
      return;
    }

    if (!registrationLink.trim()) {
      setError(
        "Please enter the registration link."
      );
      return;
    }

    try {
      setCreating(true);

      setError("");
      setSuccess("");

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            title:
              title.trim(),

            description:
              description.trim(),

            category,

            venue:
              venue.trim(),

            startDateTime,

            endDateTime,

            registrationDeadline,

            registrationLink:
              registrationLink.trim()
          })
        }
      );

      const text =
        await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(
          "Server response:",
          text
        );

        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create event"
        );
      }

      if (data.event) {
        setEvents((prev) => [
          data.event,
          ...prev
        ]);
      } else {
        await fetchEvents();
      }

      setTitle("");
      setDescription("");
      setCategory("Workshop");
      setVenue("");
      setStartDateTime("");
      setEndDateTime("");
      setRegistrationDeadline("");
      setRegistrationLink("");

      setShowCreateForm(false);

      setSuccess(
        "Event published successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      setError(
        error.message ||
        "Failed to create event"
      );

    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // DELETE EVENT
  // ==========================================

  const handleDeleteEvent = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete event"
        );
      }

      setEvents((prev) =>
        prev.filter(
          (event) =>
            (
              event.id ||
              event._id
            ).toString() !==
            id.toString()
        )
      );

      setSuccess(
        "Event deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Delete event error:",
        error
      );

      setError(
        error.message ||
        "Failed to delete event"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // EVENT STATUS
  // ==========================================

  const getEventStatus = (event) => {
    const now =
      new Date();

    const start =
      new Date(
        event.startDateTime
      );

    const end =
      new Date(
        event.endDateTime
      );

    if (now >= start && now <= end) {
      return "LIVE";
    }

    if (now > end) {
      return "COMPLETED";
    }

    return "UPCOMING";
  };

  // ==========================================
  // REGISTRATION STATUS
  // ==========================================

  const getRegistrationStatus = (
    event
  ) => {
    if (
      event.isRegistered ||
      event.registrationStatus ===
      "REGISTERED"
    ) {
      return "REGISTERED";
    }

    const now =
      new Date();

    const deadline =
      new Date(
        event.registrationDeadline
      );

    if (now > deadline) {
      return "EXPIRED";
    }

    return "OPEN";
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  // ==========================================
  // OPEN REGISTRATION
  // ==========================================

  const handleRegister = (event) => {
    const registrationStatus =
      getRegistrationStatus(
        event
      );

    if (
      registrationStatus ===
      "EXPIRED"
    ) {
      setError(
        "Registration deadline has expired."
      );

      return;
    }

    if (
      registrationStatus ===
      "REGISTERED"
    ) {
      return;
    }

    if (
      event.registrationLink
    ) {
      window.open(
        event.registrationLink,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // ==========================================
  // FILTER EVENTS
  // ==========================================

  const filteredEvents =
    events.filter((event) => {
      const eventStatus =
        getEventStatus(event);

      let matchesTab =
        true;

      if (
        activeTab ===
        "Upcoming"
      ) {
        matchesTab =
          eventStatus ===
          "UPCOMING";
      }

      if (
        activeTab ===
        "Past"
      ) {
        matchesTab =
          eventStatus ===
          "COMPLETED";
      }

      if (
        activeTab ===
        "Registered"
      ) {
        matchesTab =
          event.isRegistered ||
          event.registrationStatus ===
          "REGISTERED";
      }

      const search =
        searchQuery
          .toLowerCase()
          .trim();

      if (!search) {
        return matchesTab;
      }

      return (
        matchesTab &&
        (
          event.title
            ?.toLowerCase()
            .includes(search) ||

          event.description
            ?.toLowerCase()
            .includes(search) ||

          event.category
            ?.toLowerCase()
            .includes(search) ||

          event.venue
            ?.toLowerCase()
            .includes(search)
        )
      );
    });

  // ==========================================
  // CATEGORY COLORS
  // ==========================================

  const getCategoryStyle = (
    categoryName
  ) => {
    switch (
    categoryName
    ) {
      case "Workshop":
        return "from-violet-700 to-purple-700";

      case "Seminar":
        return "from-blue-700 to-indigo-700";

      case "Fest":
        return "from-pink-700 to-rose-700";

      case "Annual Day":
        return "from-orange-600 to-red-600";

      case "Auditorium Session":
        return "from-cyan-700 to-blue-700";

      case "Resume Session":
        return "from-green-700 to-emerald-700";

      default:
        return "from-slate-700 to-slate-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">

            <CalendarDays className="w-5 h-5 text-indigo-400" />

            Campus Events & Workshops

          </h2>

          <p className="text-xs text-gray-400 mt-1">

            Discover, register and participate in
            academic and extracurricular university
            activities.

          </p>

        </div>

        <button
          onClick={() =>
            setShowCreateForm(
              (prev) => !prev
            )
          }
          className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
        >

          {showCreateForm ? (
            <X className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}

          {showCreateForm
            ? "Cancel"
            : "Post Event"}

        </button>

      </div>

      {/* ERROR */}

      {error && (

        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-xs flex items-center gap-2">

          <AlertCircle className="w-4 h-4 shrink-0" />

          {error}

        </div>

      )}

      {/* SUCCESS */}

      {success && (

        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-xs">

          {success}

        </div>

      )}

      {/* CREATE EVENT FORM */}

      {showCreateForm && (

        <div className="bg-[#111827] border border-indigo-500/20 rounded-3xl p-5 md:p-6">

          <h3 className="text-sm font-bold text-white">

            Publish New Event

          </h3>

          <p className="text-xs text-gray-500 mt-1 mb-5">

            Add college events, workshops, seminars,
            fests and other student activities.

          </p>

          <form
            onSubmit={
              handleCreateEvent
            }
            className="space-y-4"
          >

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Event Title

              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="e.g. AI & ML Workshop"
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Category

              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              >

                {categories.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >

                      {item}

                    </option>

                  )
                )}

              </select>

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Event Description

              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Write complete details about the event..."
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 resize-none"
              />

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Venue

              </label>

              <input
                type="text"
                value={venue}
                onChange={(e) =>
                  setVenue(
                    e.target.value
                  )
                }
                placeholder="e.g. Seminar Hall"
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-semibold text-gray-300 block mb-2">

                  Start Date & Time

                </label>

                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) =>
                    setStartDateTime(
                      e.target.value
                    )
                  }
                  className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                />

              </div>

              <div>

                <label className="text-xs font-semibold text-gray-300 block mb-2">

                  End Date & Time

                </label>

                <input
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) =>
                    setEndDateTime(
                      e.target.value
                    )
                  }
                  className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                />

              </div>

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Registration Deadline

              </label>

              <input
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) =>
                  setRegistrationDeadline(
                    e.target.value
                  )
                }
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2 flex items-center gap-2">

                <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />

                Registration Link

              </label>

              <input
                type="url"
                value={registrationLink}
                onChange={(e) =>
                  setRegistrationLink(
                    e.target.value
                  )
                }
                placeholder="https://forms.google.com/..."
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

            </div>

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() => {

                  setShowCreateForm(false);

                  setError("");

                }}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >

                Cancel

              </button>

              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >

                {creating && (

                  <Loader2 className="w-4 h-4 animate-spin" />

                )}

                {creating
                  ? "Publishing..."
                  : "Publish Event"}

              </button>

            </div>

          </form>

        </div>

      )}

      {/* TABS */}

      <div className="flex items-center justify-between border-b border-[#1f2937] overflow-x-auto">

        <div className="flex gap-5 min-w-max">

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab)
              }
              className={`pb-3 text-xs font-semibold transition-all border-b-2 ${activeTab === tab
                ? "text-indigo-400 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
            >

              {tab}

            </button>

          ))}

        </div>

        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-5">

          Found{" "}

          {filteredEvents.length}

          {" "}events

        </span>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="flex justify-center py-20">

          <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />

        </div>

      )}

      {/* EVENTS */}

      {!loading && (

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredEvents.length === 0 ? (

            <div className="lg:col-span-2 xl:col-span-3 text-center py-20 bg-[#111827] border border-[#1f2937] rounded-3xl text-gray-500 text-xs">

              No events found.

            </div>

          ) : (

            filteredEvents.map(
              (event) => {

                const eventId =
                  event.id ||
                  event._id;

                const eventStatus =
                  getEventStatus(event);

                const registrationStatus =
                  getRegistrationStatus(
                    event
                  );

                const isOwner =
                  event.isOwner ||
                  (
                    currentUser &&
                    (
                      currentUser.id ||
                      currentUser._id
                    ) &&
                    event.user &&
                    (
                      currentUser.id ||
                      currentUser._id
                    ).toString() ===
                    (
                      typeof event.user === "object"
                        ? event.user._id ||
                        event.user.id
                        : event.user
                    ).toString()
                  );

                return (

                  <div
                    key={eventId}
                    className="bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all"
                  >

                    {/* EVENT HEADER */}

                    <div
                      className={`p-5 bg-gradient-to-br ${getCategoryStyle(
                        event.category
                      )}`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <span className="text-[9px] font-bold uppercase tracking-wider bg-black/30 text-white px-2.5 py-1 rounded-full">

                          {event.category}

                        </span>

                        {eventStatus ===
                          "LIVE" && (

                            <span className="flex items-center gap-1.5 text-[9px] font-bold bg-red-500/20 border border-red-400/30 text-red-100 px-2.5 py-1 rounded-full">

                              <Radio className="w-3 h-3 animate-pulse" />

                              LIVE

                            </span>

                          )}

                        {eventStatus ===
                          "COMPLETED" && (

                            <span className="text-[9px] font-bold bg-black/30 text-gray-200 px-2.5 py-1 rounded-full">

                              COMPLETED

                            </span>

                          )}

                      </div>

                      <h3 className="text-lg font-bold text-white mt-12">

                        {event.title}

                      </h3>

                    </div>

                    {/* CONTENT */}

                    <div className="p-5 space-y-4">

                      <p className="text-xs text-gray-400 leading-relaxed min-h-[60px]">

                        {event.description}

                      </p>

                      <div className="space-y-2 border-y border-[#1f2937] py-4">

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <Clock className="w-4 h-4 text-indigo-400" />

                          <span>

                            {formatDate(
                              event.startDateTime
                            )}

                          </span>

                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <CalendarDays className="w-4 h-4 text-indigo-400" />

                          <span>

                            Ends{" "}

                            {formatDate(
                              event.endDateTime
                            )}

                          </span>

                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <MapPin className="w-4 h-4 text-indigo-400" />

                          <span>

                            {event.venue}

                          </span>

                        </div>

                      </div>

                      <div className="text-[10px] text-gray-500">

                        Registration deadline:{" "}

                        <span className="text-gray-400">

                          {formatDate(
                            event.registrationDeadline
                          )}

                        </span>

                      </div>

                      {/* REGISTER BUTTON */}

                      {registrationStatus ===
                        "REGISTERED" ? (

                        <button
                          disabled
                          className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold flex items-center justify-center gap-2"
                        >

                          <CheckCircle2 className="w-4 h-4" />

                          Registered ✓

                        </button>

                      ) : registrationStatus ===
                        "EXPIRED" ||
                        eventStatus ===
                        "COMPLETED" ? (

                        <button
                          disabled
                          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                        >

                          <XCircle className="w-4 h-4" />

                          Registration Expired

                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            handleRegister(
                              event
                            )
                          }
                          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
                        >

                          Register / RSVP

                          <ExternalLink className="w-4 h-4" />

                        </button>

                      )}

                      {/* DELETE */}

                      {isOwner && (

                        <button
                          onClick={() =>
                            handleDeleteEvent(
                              eventId
                            )
                          }
                          disabled={
                            deletingId ===
                            eventId
                          }
                          className="w-full py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                        >

                          {deletingId ===
                            eventId ? (

                            <Loader2 className="w-4 h-4 animate-spin" />

                          ) : (

                            <Trash2 className="w-4 h-4" />

                          )}

                          Delete Event

                        </button>

                      )}

                    </div>

                  </div>

                );

              }
            )

          )}

        </div>

      )}

    </div>
  );
}