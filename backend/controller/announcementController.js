const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");

const getBucket = () => {
    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("MongoDB connection is not ready");
    }

    return new mongoose.mongo.GridFSBucket(db, {
        bucketName: "announcementImages"
    });
};


// ==========================================
// GET ALL ANNOUNCEMENTS
// ==========================================

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate("user", "name email role avatar")
            .sort({ createdAt: -1 });

        const formattedAnnouncements = announcements.map(
            (announcement) => ({
                id: announcement._id,
                title: announcement.title,
                content: announcement.content,
                category: announcement.category,
                link: announcement.link,

                image: announcement.imageId
                    ? `/api/announcements/${announcement._id}/image`
                    : null,

                user: announcement.user
                    ? announcement.user._id
                    : null,

                userName: announcement.user
                    ? announcement.user.name
                    : announcement.userName || "Unknown User",

                userRole: announcement.user
                    ? announcement.user.role
                    : announcement.userRole || "Student",

                userAvatar: announcement.user
                    ? announcement.user.avatar
                    : announcement.userAvatar || "",

                createdAt: announcement.createdAt
            })
        );

        return res.status(200).json({
            announcements: formattedAnnouncements
        });

    } catch (error) {
        console.error(
            "Get announcements error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch announcements"
        });
    }
};


// ==========================================
// CREATE ANNOUNCEMENT
// ==========================================

const createAnnouncement = async (req, res) => {
    try {
        const {
            title,
            content,
            category,
            link
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Announcement title is required"
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Announcement details are required"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        let imageId = null;
        let imageContentType = "";

        // ==========================================
        // SAVE IMAGE TO MONGODB GRIDFS
        // ==========================================

        if (req.file) {

            const bucket = getBucket();

            imageContentType = req.file.mimetype;

            const filename =
                `${Date.now()}-${req.file.originalname}`;

            imageId = new mongoose.Types.ObjectId();

            const uploadStream = bucket.openUploadStreamWithId(
                imageId,
                filename,
                {
                    contentType: req.file.mimetype,
                    metadata: {
                        originalName:
                            req.file.originalname,

                        uploadedBy:
                            req.user._id,

                        uploadedFor:
                            "announcement"
                    }
                }
            );

            await new Promise((resolve, reject) => {

                uploadStream.on(
                    "finish",
                    resolve
                );

                uploadStream.on(
                    "error",
                    reject
                );

                uploadStream.end(
                    req.file.buffer
                );
            });
        }

        // ==========================================
        // CREATE ANNOUNCEMENT DOCUMENT
        // ==========================================

        const announcement =
            await Announcement.create({
                title: title.trim(),

                content: content.trim(),

                category:
                    category || "General",

                link:
                    link
                        ? link.trim()
                        : "",

                user:
                    req.user._id,

                userName:
                    req.user.name,

                userRole:
                    req.user.role || "Student",

                userAvatar:
                    req.user.avatar || "",

                imageId:
                    imageId,

                imageContentType:
                    imageContentType
            });

        // ==========================================
        // POPULATE USER
        // ==========================================

        const populatedAnnouncement =
            await Announcement.findById(
                announcement._id
            ).populate(
                "user",
                "name email role avatar"
            );

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            message:
                "Announcement published successfully",

            announcement: {

                id:
                    populatedAnnouncement._id,

                title:
                    populatedAnnouncement.title,

                content:
                    populatedAnnouncement.content,

                category:
                    populatedAnnouncement.category,

                link:
                    populatedAnnouncement.link,

                image:
                    populatedAnnouncement.imageId
                        ? `/api/announcements/${populatedAnnouncement._id}/image`
                        : null,

                user:
                    populatedAnnouncement.user
                        ? populatedAnnouncement.user._id
                        : null,

                userName:
                    populatedAnnouncement.user
                        ? populatedAnnouncement.user.name
                        : populatedAnnouncement.userName,

                userRole:
                    populatedAnnouncement.user
                        ? populatedAnnouncement.user.role
                        : populatedAnnouncement.userRole,

                userAvatar:
                    populatedAnnouncement.user
                        ? populatedAnnouncement.user.avatar
                        : populatedAnnouncement.userAvatar,

                createdAt:
                    populatedAnnouncement.createdAt
            }
        });

    } catch (error) {

        console.error(
            "Create announcement error:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Failed to create announcement"
        });
    }
};


// ==========================================
// GET ANNOUNCEMENT IMAGE
// ==========================================

const getAnnouncementImage = async (req, res) => {
    try {

        const announcement =
            await Announcement.findById(
                req.params.id
            );

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        if (!announcement.imageId) {
            return res.status(404).json({
                message: "Image not found"
            });
        }

        const bucket = getBucket();

        res.set(
            "Content-Type",
            announcement.imageContentType ||
            "image/jpeg"
        );

        const downloadStream =
            bucket.openDownloadStream(
                announcement.imageId
            );

        downloadStream.on(
            "error",
            (error) => {

                console.error(
                    "GridFS image error:",
                    error
                );

                if (!res.headersSent) {
                    res.status(404).json({
                        message:
                            "Image not found in MongoDB"
                    });
                }
            }
        );

        downloadStream.pipe(res);

    } catch (error) {

        console.error(
            "Get announcement image error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to load image"
        });
    }
};


// ==========================================
// DELETE ANNOUNCEMENT
// ==========================================

const deleteAnnouncement = async (req, res) => {
    try {

        const announcement =
            await Announcement.findById(
                req.params.id
            );

        if (!announcement) {
            return res.status(404).json({
                message:
                    "Announcement not found"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }

        // ==========================================
        // CHECK OWNER
        // ==========================================

        if (
            announcement.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message:
                    "You can only delete your own announcements"
            });
        }

        // ==========================================
        // DELETE IMAGE FROM GRIDFS
        // ==========================================

        if (announcement.imageId) {

            try {

                const bucket = getBucket();

                await bucket.delete(
                    announcement.imageId
                );

            } catch (imageError) {

                console.error(
                    "GridFS image delete error:",
                    imageError
                );

            }
        }

        // ==========================================
        // DELETE ANNOUNCEMENT
        // ==========================================

        await Announcement.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            message:
                "Announcement deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete announcement error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete announcement"
        });
    }
};


module.exports = {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncementImage
};
