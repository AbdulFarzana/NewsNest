const Event = require("../models/event");
const EventRegistration =
    require("../models/eventRegistration");


const getEventStatus = (event) => {
    const now = new Date();

    const start =
        new Date(event.startDateTime);

    const end =
        new Date(event.endDateTime);

    if (now >= start && now <= end) {
        return "LIVE";
    }

    if (now > end) {
        return "COMPLETED";
    }

    return "UPCOMING";
};


const getRegistrationStatus = (event) => {
    const now = new Date();

    const deadline =
        new Date(
            event.registrationDeadline
        );

    const start =
        new Date(event.startDateTime);

    if (now > deadline) {
        return "CLOSED";
    }

    if (now >= start) {
        return "CLOSED";
    }

    return "OPEN";
};


const formatEvent = (
    event,
    currentUserId,
    registeredEventIds
) => {
    const eventId =
        event._id.toString();

    return {
        id: event._id,

        title: event.title,

        description:
            event.description,

        category:
            event.category,

        venue:
            event.venue,

        startDateTime:
            event.startDateTime,

        endDateTime:
            event.endDateTime,

        registrationDeadline:
            event.registrationDeadline,

        registrationLink:
            event.registrationLink,

        user:
            event.user,

        userName:
            event.userName,

        createdAt:
            event.createdAt,

        eventStatus:
            getEventStatus(event),

        registrationStatus:
            getRegistrationStatus(event),

        isRegistered:
            registeredEventIds.includes(
                eventId
            ),

        isOwner:
            currentUserId
                ? event.user.toString() ===
                currentUserId.toString()
                : false
    };
};


const getEvents = async (
    req,
    res
) => {
    try {
        const events =
            await Event.find()
                .sort({
                    startDateTime: 1
                });

        const registrations =
            await EventRegistration.find({
                user: req.user._id
            });

        const registeredEventIds =
            registrations.map(
                (registration) =>
                    registration.event.toString()
            );

        const formattedEvents =
            events.map((event) =>
                formatEvent(
                    event,
                    req.user._id,
                    registeredEventIds
                )
            );

        return res.status(200).json({
            events:
                formattedEvents
        });

    } catch (error) {

        console.error(
            "Get events error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch events"
        });
    }
};


const createEvent = async (
    req,
    res
) => {
    try {

        const {
            title,
            description,
            category,
            venue,
            startDateTime,
            endDateTime,
            registrationDeadline,
            registrationLink
        } = req.body;


        if (
            !title ||
            !description ||
            !venue ||
            !startDateTime ||
            !endDateTime ||
            !registrationDeadline
        ) {
            return res.status(400).json({
                message:
                    "Please fill all required fields"
            });
        }


        const start =
            new Date(startDateTime);

        const end =
            new Date(endDateTime);

        const deadline =
            new Date(
                registrationDeadline
            );


        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            Number.isNaN(
                deadline.getTime()
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid date or time"
            });
        }


        if (end <= start) {
            return res.status(400).json({
                message:
                    "Event end time must be after start time"
            });
        }


        if (deadline >= start) {
            return res.status(400).json({
                message:
                    "Registration deadline must be before the event starts"
            });
        }


        const event =
            await Event.create({

                user:
                    req.user._id,

                userName:
                    req.user.name,

                title:
                    title.trim(),

                description:
                    description.trim(),

                category:
                    category || "Other",

                venue:
                    venue.trim(),

                startDateTime:
                    start,

                endDateTime:
                    end,

                registrationDeadline:
                    deadline,

                registrationLink:
                    registrationLink
                        ? registrationLink.trim()
                        : ""
            });


        return res.status(201).json({

            message:
                "Event created successfully",

            event:
                formatEvent(
                    event,
                    req.user._id,
                    []
                )
        });

    } catch (error) {

        console.error(
            "Create event error:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Failed to create event"
        });
    }
};


const registerForEvent = async (
    req,
    res
) => {
    try {

        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {
            return res.status(404).json({
                message:
                    "Event not found"
            });
        }


        const registrationStatus =
            getRegistrationStatus(
                event
            );


        if (
            registrationStatus ===
            "CLOSED"
        ) {
            return res.status(400).json({
                message:
                    "Registration is closed for this event"
            });
        }


        const existingRegistration =
            await EventRegistration.findOne({

                event:
                    event._id,

                user:
                    req.user._id
            });


        if (
            existingRegistration
        ) {
            return res.status(200).json({

                message:
                    "You are already registered",

                registrationLink:
                    event.registrationLink,

                alreadyRegistered:
                    true
            });
        }


        await EventRegistration.create({

            event:
                event._id,

            user:
                req.user._id,

            email:
                req.user.email
        });


        return res.status(201).json({

            message:
                "Registration recorded successfully",

            registrationLink:
                event.registrationLink,

            alreadyRegistered:
                false
        });

    } catch (error) {

        console.error(
            "Event registration error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to register for event"
        });
    }
};


const deleteEvent = async (
    req,
    res
) => {
    try {

        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {
            return res.status(404).json({
                message:
                    "Event not found"
            });
        }


        if (
            event.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({

                message:
                    "You can only delete your own events"
            });
        }


        await EventRegistration.deleteMany({

            event:
                event._id
        });


        await Event.findByIdAndDelete(
            event._id
        );


        return res.status(200).json({

            message:
                "Event deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete event error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to delete event"
        });
    }
};


module.exports = {

    getEvents,

    createEvent,

    registerForEvent,

    deleteEvent
};