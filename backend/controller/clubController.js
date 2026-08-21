const ClubPost = require("../models/clubPost");


const getPostStatus = (post) => {

    if (post.type !== "Event") {
        return "POST";
    }

    const now = new Date();

    if (
        post.endDateTime &&
        now > new Date(post.endDateTime)
    ) {
        return "COMPLETED";
    }

    if (
        post.startDateTime &&
        post.endDateTime &&
        now >= new Date(post.startDateTime) &&
        now <= new Date(post.endDateTime)
    ) {
        return "LIVE";
    }

    return "UPCOMING";
};


const getRegistrationStatus = (post) => {

    if (
        post.type !== "Event" ||
        !post.registrationLink
    ) {
        return "NONE";
    }

    const now = new Date();

    if (
        post.registrationDeadline &&
        now > new Date(
            post.registrationDeadline
        )
    ) {
        return "CLOSED";
    }

    if (
        post.endDateTime &&
        now > new Date(post.endDateTime)
    ) {
        return "CLOSED";
    }

    return "OPEN";
};


const formatPost = (
    post,
    currentUserId = null
) => {

    const postUserId =
        post.user && post.user._id
            ? post.user._id
            : post.user;

    return {

        id: post._id,

        club: post.club,

        type: post.type,

        title: post.title,

        description: post.description,

        venue: post.venue,

        startDateTime: post.startDateTime,

        endDateTime: post.endDateTime,

        registrationDeadline:
            post.registrationDeadline,

        registrationLink:
            post.registrationLink,

        image: post.image
            ? `http://localhost:5000/api/clubs/${post._id}/image`
            : null,

        user: postUserId,

        userName:
            post.userName ||
            (post.user && post.user.name) ||
            "Unknown User",

        createdAt: post.createdAt,

        eventStatus:
            getPostStatus(post),

        registrationStatus:
            getRegistrationStatus(post),

        isOwner:
            currentUserId &&
            postUserId &&
            currentUserId.toString() ===
            postUserId.toString()
    };
};


const getClubPosts = async (
    req,
    res
) => {

    try {

        const posts =
            await ClubPost.find()
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        const currentUserId =
            req.user
                ? req.user._id
                : null;

        const formattedPosts =
            posts.map((post) =>
                formatPost(
                    post,
                    currentUserId
                )
            );

        return res.status(200).json({
            posts: formattedPosts
        });

    } catch (error) {

        console.error(
            "Get club posts error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch club posts"
        });
    }
};


const createClubPost = async (
    req,
    res
) => {

    try {

        const {
            club,
            type,
            title,
            description,
            venue,
            startDateTime,
            endDateTime,
            registrationDeadline,
            registrationLink
        } = req.body;


        if (!club) {

            return res.status(400).json({
                message:
                    "Club is required"
            });
        }


        if (!type) {

            return res.status(400).json({
                message:
                    "Post type is required"
            });
        }


        if (!title || !title.trim()) {

            return res.status(400).json({
                message:
                    "Title is required"
            });
        }


        if (
            !description ||
            !description.trim()
        ) {

            return res.status(400).json({
                message:
                    "Description is required"
            });
        }


        if (!req.user) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }


        if (
            type === "Event" &&
            !startDateTime
        ) {

            return res.status(400).json({
                message:
                    "Start date and time are required for an event"
            });
        }


        if (
            type === "Event" &&
            !endDateTime
        ) {

            return res.status(400).json({
                message:
                    "End date and time are required for an event"
            });
        }


        if (
            startDateTime &&
            endDateTime &&
            new Date(startDateTime) >=
            new Date(endDateTime)
        ) {

            return res.status(400).json({
                message:
                    "End date and time must be after start date and time"
            });
        }


        if (
            registrationDeadline &&
            startDateTime &&
            new Date(registrationDeadline) >
            new Date(startDateTime)
        ) {

            return res.status(400).json({
                message:
                    "Registration deadline must be before the event starts"
            });
        }


        const postData = {

            club,

            type,

            title:
                title.trim(),

            description:
                description.trim(),

            venue:
                venue
                    ? venue.trim()
                    : "",

            startDateTime:
                startDateTime || null,

            endDateTime:
                endDateTime || null,

            registrationDeadline:
                registrationDeadline || null,

            registrationLink:
                registrationLink
                    ? registrationLink.trim()
                    : "",

            user:
                req.user._id,

            userName:
                req.user.name || ""
        };


        if (req.file) {

            postData.image =
                req.file.buffer;

            postData.imageContentType =
                req.file.mimetype;
        }


        const post =
            await ClubPost.create(
                postData
            );


        const populatedPost =
            await ClubPost.findById(
                post._id
            ).populate(
                "user",
                "name email"
            );


        return res.status(201).json({

            message:
                "Club post published successfully",

            post:
                formatPost(
                    populatedPost,
                    req.user._id
                )
        });

    } catch (error) {

        console.error(
            "Create club post error:",
            error
        );

        return res.status(500).json({

            message:
                error.message ||
                "Failed to create club post"
        });
    }
};


const getClubPostImage = async (
    req,
    res
) => {

    try {

        const post =
            await ClubPost.findById(
                req.params.id
            );


        if (!post) {

            return res.status(404).json({
                message:
                    "Club post not found"
            });
        }


        if (!post.image) {

            return res.status(404).json({
                message:
                    "Image not found"
            });
        }


        res.set(
            "Content-Type",
            post.imageContentType ||
            "image/jpeg"
        );


        return res.send(
            post.image
        );

    } catch (error) {

        console.error(
            "Get club post image error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to load image"
        });
    }
};


const deleteClubPost = async (
    req,
    res
) => {

    try {

        const post =
            await ClubPost.findById(
                req.params.id
            );


        if (!post) {

            return res.status(404).json({
                message:
                    "Club post not found"
            });
        }


        if (!req.user) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }


        if (
            post.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message:
                    "You can only delete your own club posts"
            });
        }


        await ClubPost.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            message:
                "Club post deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete club post error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete club post"
        });
    }
};


module.exports = {

    getClubPosts,

    createClubPost,

    getClubPostImage,

    deleteClubPost
};